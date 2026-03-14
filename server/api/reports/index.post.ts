import { getFirestoreDb, getFirebaseStorage } from '../../utils/firebase'
import type { Report } from '~/types/report'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  await checkRateLimit(ip)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'Form data kosong' })

  const audioPart = formData.find(p => p.name === 'audio')
  const textPart = formData.find(p => p.name === 'textReport')
  const photoPart = formData.find(p => p.name === 'photo')
  const latStr = formData.find(p => p.name === 'lat')?.data.toString()
  const lngStr = formData.find(p => p.name === 'lng')?.data.toString()
  const phoneStr = formData.find(p => p.name === 'phone')?.data.toString()

  if (!audioPart?.data && !textPart?.data) {
    throw createError({ statusCode: 400, message: 'Audio atau teks wajib disertakan' })
  }

  if (audioPart?.data) {
    const MAX_AUDIO_SIZE = 5 * 1024 * 1024
    const ALLOWED_AUDIO = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg', 'audio/mp3']
    if (audioPart.data.length > MAX_AUDIO_SIZE) throw createError({ statusCode: 413, message: 'File audio terlalu besar' })
    if (!audioPart.type || !ALLOWED_AUDIO.includes(audioPart.type)) throw createError({ statusCode: 400, message: 'Format audio tidak valid' })
  }

  if (photoPart?.data) {
    const MAX_PHOTO_SIZE = 10 * 1024 * 1024
    const ALLOWED_PHOTO = ['image/jpeg', 'image/png', 'image/webp']
    if (photoPart.data.length > MAX_PHOTO_SIZE) throw createError({ statusCode: 413, message: 'File foto terlalu besar' })
    if (!photoPart.type || !ALLOWED_PHOTO.includes(photoPart.type)) throw createError({ statusCode: 400, message: 'Format foto tidak valid' })
  }

  const config = useRuntimeConfig()
  
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
    summary_bahasa: groqSuccess ? `[RAW TRANSCRIPT]: ${transcript}` : '[TRANSKRIPSI GAGAL: SERVER DOWN]',
    is_hoax_suspected: false, 
    hoax_reason: null, 
    survival_instructions: []
  }

  let aiSuccess = false

  if (groqSuccess) {
    try {
      extracted = await analyzeEmergency(transcript, config.geminiApiKey as string)
      aiSuccess = true
    } catch {}
  }

  if (aiSuccess && extracted.location_text === 'TIDAK_SPESIFIK') {
    extracted.location_text = 'LOKASI VERBAL NIHIL (Lacak via Pin Peta)'
    extracted.urgency_score = Math.max(extracted.urgency_score, 6)
  }

  if (extracted.is_hoax_suspected) extracted.urgency_score = 1

  let priority: Report['priority'] = 'LOW'
  if (extracted.urgency_score >= 8) priority = 'CRITICAL'
  else if (extracted.urgency_score >= 6) priority = 'HIGH'
  else if (extracted.urgency_score >= 4) priority = 'MEDIUM'

  const bucket = getFirebaseStorage()
  const fileId = randomUUID()
  
  let finalAudioUrl = null
  if (audioPart?.data && audioPart.type) {
    const audioExt = audioPart.type === 'audio/mp4' ? 'mp4' : audioPart.type === 'audio/ogg' ? 'ogg' : audioPart.type === 'audio/mpeg' || audioPart.type === 'audio/mp3' ? 'mp3' : 'webm'
    const audioFile = bucket.file(`reports/${fileId}-audio.${audioExt}`)
    await audioFile.save(audioPart.data, { contentType: audioPart.type })
    await audioFile.makePublic()
    finalAudioUrl = audioFile.publicUrl()
  }
  
  let finalPhotoUrl = null
  if (photoPart?.data && photoPart.type) {
    const photoExt = photoPart.type === 'image/png' ? 'png' : photoPart.type === 'image/webp' ? 'webp' : 'jpg'
    const pFile = bucket.file(`reports/${fileId}-photo.${photoExt}`)
    await pFile.save(photoPart.data, { contentType: photoPart.type })
    await pFile.makePublic()
    finalPhotoUrl = pFile.publicUrl()
  }

  const reportData: Omit<Report, 'id'> = {
    timestamp: new Date().toISOString(),
    lat: latStr ? parseFloat(latStr) : null,
    lng: lngStr ? parseFloat(lngStr) : null,
    audioUrl: finalAudioUrl,
    photoUrl: finalPhotoUrl,
    disasterType: extracted.disaster_type || 'LAINNYA',
    locationText: extracted.location_text || 'Lokasi tidak spesifik',
    victimCountEstimated: extracted.victim_count_estimated,
    victimStatus: extracted.victim_status || 'TIDAK_DIKETAHUI',
    infrastructureDamage: !!extracted.infrastructure_damage,
    reporterIsVictim: !!extracted.reporter_is_victim,
    urgencyScore: extracted.urgency_score || 5,
    summaryBahasa: extracted.summary_bahasa,
    isHoaxSuspected: !!extracted.is_hoax_suspected,
    hoaxReason: extracted.hoax_reason || null,
    survivalInstructions: extracted.survival_instructions || [],
    priority,
    status: 'DRAFT',
    reporterPhone: phoneStr || null,
    isSilent: !audioPart?.data
  }

  const db = getFirestoreDb()
  const docRef = await db.collection('reports').add(reportData)

  return { id: docRef.id, ...reportData }
})
