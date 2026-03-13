import { getFirestoreDb } from '../../utils/firebase'
import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Report } from '~/types/report'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const db = getFirestoreDb()

    const formData = await readMultipartFormData(event)
    if (!formData) throw createError({ statusCode: 400, message: 'Form data kosong' })

    const audioPart = formData.find(p => p.name === 'audio')
    const photoPart = formData.find(p => p.name === 'photo')
    const latStr = formData.find(p => p.name === 'lat')?.data.toString()
    const lngStr = formData.find(p => p.name === 'lng')?.data.toString()

    if (!audioPart?.data) throw createError({ statusCode: 400, message: 'Audio wajib disertakan' })

    const groq = new Groq({ apiKey: config.groqApiKey as string })
    const audioFile = new File([audioPart.data], 'laporan.webm', { type: 'audio/webm' })

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      language: 'id',
    })

    const transcript = transcription.text
    if (!transcript) throw createError({ statusCode: 400, message: 'Gagal mendeteksi suara' })

    const genAI = new GoogleGenerativeAI(config.geminiApiKey as string)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Ekstrak laporan darurat warga berikut menjadi JSON murni tanpa markdown.
    
Transkrip: "${transcript}"

Format respons JSON (wajib patuhi tanpa teks tambahan apapun):
{"location_text":"alamat atau landmark, atau null","disaster_type":"BANJIR|GEMPA|LONGSOR|KEBAKARAN|ANGIN|LAINNYA","victim_count_estimated":null,"victim_status":"TERJEBAK|LUKA|MENINGGAL|TIDAK_ADA_KORBAN|TIDAK_DIKETAHUI","infrastructure_damage":false,"reporter_is_victim":false,"urgency_score":3,"summary_bahasa":"ringkasan 1 kalimat"}`

    const geminiResult = await model.generateContent(prompt)
    let rawText = geminiResult.response.text()
    
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    const extracted = JSON.parse(rawText)

    const lat = latStr ? parseFloat(latStr) : null
    const lng = lngStr ? parseFloat(lngStr) : null

    let priority: Report['priority'] = 'LOW'
    if (extracted.urgency_score >= 8) priority = 'CRITICAL'
    else if (extracted.urgency_score >= 6) priority = 'HIGH'
    else if (extracted.urgency_score >= 4) priority = 'MEDIUM'

    const reportData: Omit<Report, 'id'> = {
      timestamp: new Date().toISOString(),
      lat,
      lng,
      audioUrl: 'upload_terpisah',
      photoUrl: photoPart ? 'ada_foto' : null,
      disasterType: extracted.disaster_type || 'LAINNYA',
      locationText: extracted.location_text || 'Lokasi tidak spesifik',
      victimCountEstimated: extracted.victim_count_estimated,
      victimStatus: extracted.victim_status || 'TIDAK_DIKETAHUI',
      infrastructureDamage: !!extracted.infrastructure_damage,
      reporterIsVictim: !!extracted.reporter_is_victim,
      urgencyScore: extracted.urgency_score || 1,
      summaryBahasa: extracted.summary_bahasa || transcript,
      priority,
      status: 'PENDING'
    }

    const docRef = await db.collection('reports').add(reportData)

    return { id: docRef.id, ...reportData }
  } catch (e: any) {
    console.error('SERVER ERROR:', e)
    throw createError({ statusCode: e.statusCode || 500, message: e.message || 'Server Error' })
  }
})
