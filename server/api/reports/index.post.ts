import { getFirestoreDb } from '../../utils/firebase'
import type { Report } from '~/types/report'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  await checkRateLimit(ip)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'Form data kosong' })

  const audioPart = formData.find(p => p.name === 'audio')
  const textPart  = formData.find(p => p.name === 'textReport')
  const photoPart = formData.find(p => p.name === 'photo')
  const latStr    = formData.find(p => p.name === 'lat')?.data.toString()
  const lngStr    = formData.find(p => p.name === 'lng')?.data.toString()
  const phoneStr  = formData.find(p => p.name === 'phone')?.data.toString()

  if (!audioPart?.data && !textPart?.data) {
    throw createError({ statusCode: 400, message: 'Audio atau teks wajib disertakan' })
  }

  if (audioPart?.data) {
    const MAX_AUDIO_SIZE = 5 * 1024 * 1024
    const ALLOWED_AUDIO = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg', 'audio/mp3']
    if (audioPart.data.length > MAX_AUDIO_SIZE)
      throw createError({ statusCode: 413, message: 'File audio terlalu besar (maks 5MB)' })
    if (!audioPart.type || !ALLOWED_AUDIO.includes(audioPart.type))
      throw createError({ statusCode: 400, message: 'Format audio tidak valid' })
  }

  if (photoPart?.data) {
    const MAX_PHOTO_SIZE = 600 * 1024 // 600KB — fits in Firestore doc after base64 overhead
    const ALLOWED_PHOTO = ['image/jpeg', 'image/png', 'image/webp']
    if (photoPart.data.length > MAX_PHOTO_SIZE)
      throw createError({ statusCode: 413, message: 'Foto terlalu besar (maks 600KB). Kompres terlebih dahulu.' })
    if (!photoPart.type || !ALLOWED_PHOTO.includes(photoPart.type))
      throw createError({ statusCode: 400, message: 'Format foto tidak valid' })
  }

  const config = useRuntimeConfig()

  // ── AI processing ────────────────────────────────────────────────────────
  let transcript = ''
  let groqSuccess = false

  if (audioPart?.data) {
    try {
      transcript = await transcribeAudio(audioPart.data, config.groqApiKey as string)
      groqSuccess = true
    } catch {}
  } else if (textPart?.data) {
    transcript = textPart.data.toString()
    groqSuccess = true
  }

  let extracted: any = {
    disaster_type: 'LAINNYA',
    location_text: groqSuccess ? 'FALLBACK_SYSTEM' : 'LOKASI VERBAL NIHIL (Lacak via Pin Peta)',
    victim_count_estimated: null,
    victim_status: 'TIDAK_DIKETAHUI',
    infrastructure_damage: false,
    reporter_is_victim: false,
    urgency_score: groqSuccess ? 5 : 8,
    summary_bahasa: groqSuccess
      ? `[RAW TRANSCRIPT]: ${transcript}`
      : '[TRANSKRIPSI GAGAL: SERVER DOWN]',
    situation_narrative: null,
    is_hoax_suspected: false,
    hoax_reason: null,
    survival_instructions: [],
  }

  if (groqSuccess) {
    try {
      extracted = await analyzeEmergency(transcript, config.geminiApiKey as string)
    } catch {}
  }

  if (extracted.location_text === 'TIDAK_SPESIFIK') {
    extracted.location_text = 'LOKASI VERBAL NIHIL (Lacak via Pin Peta)'
    extracted.urgency_score = Math.max(extracted.urgency_score, 6)
  }

  if (extracted.is_hoax_suspected) extracted.urgency_score = 1

  let priority: Report['priority'] = 'LOW'
  if (extracted.urgency_score >= 8)      priority = 'CRITICAL'
  else if (extracted.urgency_score >= 6) priority = 'HIGH'
  else if (extracted.urgency_score >= 4) priority = 'MEDIUM'

  let finalAudioUrl: string | null = null
  if (audioPart?.data && audioPart.type) {
    finalAudioUrl = `data:${audioPart.type};base64,${audioPart.data.toString('base64')}`
  }

  // ── Save main report document (NO photoUrl base64 here) ──────────────────
  const db = getFirestoreDb()

  const reportData: any = {
    timestamp: new Date().toISOString(),
    lat: latStr ? parseFloat(latStr) : null,
    lng: lngStr ? parseFloat(lngStr) : null,
    audioUrl: finalAudioUrl,
    hasPhoto: false,
    disasterType: extracted.disaster_type || 'LAINNYA',
    locationText: extracted.location_text || 'Lokasi tidak spesifik',
    victimCountEstimated: extracted.victim_count_estimated,
    victimStatus: extracted.victim_status || 'TIDAK_DIKETAHUI',
    infrastructureDamage: !!extracted.infrastructure_damage,
    reporterIsVictim: !!extracted.reporter_is_victim,
    urgencyScore: extracted.urgency_score || 5,
    summaryBahasa: extracted.summary_bahasa,
    situationNarrative: extracted.situation_narrative || null,
    isHoaxSuspected: !!extracted.is_hoax_suspected,
    hoaxReason: extracted.hoax_reason || null,
    survivalInstructions: extracted.survival_instructions || [],
    priority,
    status: 'DRAFT',
    reporterPhone: phoneStr || null,
    isSilent: !audioPart?.data,
  }

  const docRef = await db.collection('reports').add(reportData)
  const reportId = docRef.id

  // ── Save photo to separate collection, same ID as report ─────────────────
  let photoUrl: string | null = null

  if (photoPart?.data && photoPart.type) {
    photoUrl = `data:${photoPart.type};base64,${photoPart.data.toString('base64')}`
    await db.collection('report_photos').doc(reportId).set({ photoUrl })
    await docRef.update({ hasPhoto: true })
  }

  return {
    id: reportId,
    ...reportData,
    hasPhoto: !!photoUrl,
    photoUrl, 
  }
})
