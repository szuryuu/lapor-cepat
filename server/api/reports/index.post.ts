import { getFirestoreDb } from '../../utils/firebase'
import type { Report } from '~/types/report'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  checkRateLimit(ip)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'Form data kosong' })

  const audioPart = formData.find(p => p.name === 'audio')
  const photoPart = formData.find(p => p.name === 'photo')
  const latStr = formData.find(p => p.name === 'lat')?.data.toString()
  const lngStr = formData.find(p => p.name === 'lng')?.data.toString()

  if (!audioPart?.data) throw createError({ statusCode: 400, message: 'Audio wajib disertakan' })

  const config = useRuntimeConfig()
  
  let transcript = ''
  let groqSuccess = false

  try {
    transcript = await transcribeAudio(audioPart.data, config.groqApiKey as string)
    groqSuccess = true
  } catch (err) {
    console.warn('GROQ_FAILOVER_TRIGGERED', err)
  }

  let extracted: any = {
    disaster_type: 'LAINNYA', 
    location_text: groqSuccess ? 'FALLBACK_SYSTEM' : 'LOKASI VERBAL NIHIL (Lacak via Pin Peta)',
    victim_count_estimated: null, 
    victim_status: 'TIDAK_DIKETAHUI',
    infrastructure_damage: false, 
    reporter_is_victim: false, 
    urgency_score: groqSuccess ? 5 : 8,
    summary_bahasa: groqSuccess ? `[RAW TRANSCRIPT]: ${transcript}` : '[TRANSKRIPSI GAGAL: SERVER AUDIO DOWN. DENGARKAN REKAMAN MANUAL]',
    is_hoax_suspected: false, 
    hoax_reason: null, 
    survival_instructions: []
  }

  let aiSuccess = false

  if (groqSuccess) {
    try {
      extracted = await analyzeEmergency(transcript, config.geminiApiKey as string)
      aiSuccess = true
    } catch (err) {
      console.warn('LLM_FAILOVER_TRIGGERED', err)
    }
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

  const reportData: Omit<Report, 'id'> = {
    timestamp: new Date().toISOString(),
    lat: latStr ? parseFloat(latStr) : null,
    lng: lngStr ? parseFloat(lngStr) : null,
    audioUrl: 'upload_terpisah',
    photoUrl: photoPart ? 'ada_foto' : null,
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
    status: 'PENDING'
  }

  const db = getFirestoreDb()
  const docRef = await db.collection('reports').add(reportData)

  return { id: docRef.id, ...reportData }
})
