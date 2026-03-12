import { readMultipartFormData } from 'h3'
import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getFirestoreDb } from '../../utils/firebase'

function scorePriority(params: {
  urgencyScore: number
  victimCount?: number | null
  victimStatus: string
  infrastructureDamage: boolean
  reporterIsVictim: boolean
  hasPhoto: boolean
}) {
  let score = params.urgencyScore * 2
  if ((params.victimCount ?? 0) > 0) score += 3
  if (params.victimStatus === 'TERJEBAK') score += 4
  if (params.victimStatus === 'MENINGGAL') score += 5
  if (params.infrastructureDamage) score += 1
  if (params.reporterIsVictim) score += 2
  if (params.hasPhoto) score += 1

  const level = score >= 16 ? 'CRITICAL' : score >= 11 ? 'HIGH' : score >= 6 ? 'MEDIUM' : 'LOW'
  return { score, level }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const parts = await readMultipartFormData(event)

  if (!parts) throw createError({ statusCode: 400, message: 'Form data kosong' })

  const audioPart = parts.find(p => p.name === 'audio')
  const photoPart = parts.find(p => p.name === 'photo')
  const latStr = parts.find(p => p.name === 'lat')?.data.toString()
  const lngStr = parts.find(p => p.name === 'lng')?.data.toString()
  const fcmToken = parts.find(p => p.name === 'fcmToken')?.data.toString() ?? null

  if (!audioPart?.data) throw createError({ statusCode: 400, message: 'Audio wajib disertakan' })

  const groq = new Groq({ apiKey: config.groqApiKey as string })
  const audioFile = new File([audioPart.data], 'laporan.webm', { type: 'audio/webm' })

  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-large-v3',
    language: 'id',
  })

  const transcript = transcription.text

  const genAI = new GoogleGenerativeAI(config.geminiApiKey as string)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `Kamu adalah parser laporan bencana untuk BPBD Indonesia.
Ekstrak field berikut dari transkrip. Balas HANYA dengan JSON valid, tanpa markdown atau teks lain.

Transkrip: "${transcript}"

Format respons:
{"location_text":"alamat atau landmark, atau null","disaster_type":"BANJIR|GEMPA|LONGSOR|KEBAKARAN|ANGIN|LAINNYA","victim_count_estimated":null,"victim_status":"TERJEBAK|LUKA|MENINGGAL|TIDAK_ADA_KORBAN|TIDAK_DIKETAHUI","infrastructure_damage":false,"reporter_is_victim":false,"urgency_score":3,"summary_bahasa":"ringkasan 1 kalimat"}`

  const geminiResult = await model.generateContent(prompt)
  const rawJson = geminiResult.response.text().replace(/```json|```/g, '').trim()
  const extracted = JSON.parse(rawJson)

  let lat = latStr ? parseFloat(latStr) : null
  let lng = lngStr ? parseFloat(lngStr) : null
  let locationText: string = extracted.location_text ?? 'Lokasi tidak diketahui'

  if (extracted.location_text) {
    try {
      const geoResults = await $fetch<Array<{ lat: string; lon: string; display_name: string }>>(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(extracted.location_text)}&format=json&countrycodes=id&limit=1`,
        { headers: { 'User-Agent': 'LaporCepat/1.0 (admin@laporcepat.id)' } },
      )
      if (geoResults?.[0]) {
        lat = parseFloat(geoResults[0].lat)
        lng = parseFloat(geoResults[0].lon)
        locationText = geoResults[0].display_name.split(',').slice(0, 3).join(', ')
      }
    } catch {}
  }

  const { score, level } = scorePriority({
    urgencyScore: extracted.urgency_score ?? 3,
    victimCount: extracted.victim_count_estimated,
    victimStatus: extracted.victim_status ?? 'TIDAK_DIKETAHUI',
    infrastructureDamage: extracted.infrastructure_damage ?? false,
    reporterIsVictim: extracted.reporter_is_victim ?? false,
    hasPhoto: !!photoPart,
  })

  const db = getFirestoreDb()
  const docRef = db.collection('reports').doc()
  const reportId = docRef.id.slice(0, 8).toUpperCase()

  const report = {
    id: reportId,
    timestamp: new Date().toISOString(),
    status: 'PENDING',
    priority: level,
    priorityScore: score,
    rawTranscript: transcript,
    locationText,
    lat,
    lng,
    disasterType: extracted.disaster_type ?? 'LAINNYA',
    victimCountEstimated: extracted.victim_count_estimated ?? null,
    victimStatus: extracted.victim_status ?? 'TIDAK_DIKETAHUI',
    infrastructureDamage: extracted.infrastructure_damage ?? false,
    reporterIsVictim: extracted.reporter_is_victim ?? false,
    urgencyScore: extracted.urgency_score ?? 3,
    summaryBahasa: extracted.summary_bahasa ?? '',
    isDuplicate: false,
    clusterId: null,
    fcmToken,
  }

  await docRef.set(report)

  return { id: reportId }
})
