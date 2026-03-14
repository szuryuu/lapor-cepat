import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function transcribeAudio(audioData: Buffer, apiKey: string): Promise<string> {
  const groq = new Groq({ apiKey })
  const audioFile = new File([audioData], 'laporan.webm', { type: 'audio/webm' })

  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-large-v3',
    language: 'id',
  })

  if (!transcription.text) throw createError({ statusCode: 400, message: 'Gagal mendeteksi suara' })
  return transcription.text
}

export async function analyzeEmergency(transcript: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: "Anda adalah Sistem Pertahanan Kognitif & Pakar Survival BPBD. TUGAS: 1. Filter hoax/fiksi/anomali geografi. 2. Jika pelapor TIDAK menyebutkan nama jalan/patokan, WAJIB isi location_text: 'TIDAK_SPESIFIK'. 3. Berikan maksimal 3 instruksi taktis survival singkat untuk korban sambil menunggu bantuan."
  })

  const prompt = `Transkrip laporan warga: "${transcript}"\n\nAnalisis secara kritis menggunakan logika sains, fisika, dan realitas dunia nyata. Hasilkan JSON dengan parameter berikut:\n- reasoning_geografi: (string)\n- is_hoax_suspected: (boolean)\n- hoax_reason: (string|null)\n- location_text: (string) Nama tempat. JIKA SAMA SEKALI TIDAK ADA petunjuk lokasi di transkrip, WAJIB ISI DENGAN EXACT STRING: "TIDAK_SPESIFIK".\n- disaster_type: (string) BANJIR|GEMPA|LONGSOR|KEBAKARAN|ANGIN|TSUNAMI|LAINNYA\n- victim_count_estimated: (number|null)\n- victim_status: (string)\n- infrastructure_damage: (boolean)\n- reporter_is_victim: (boolean)\n- survival_instructions: (array of string) Maksimal 3 langkah darurat (maks 10 kata per langkah) yang HARUS dilakukan warga detik ini juga untuk bertahan hidup/mengamankan diri berdasarkan jenis bencananya.\n- urgency_score: (number 1-10)\n- summary_bahasa: (string)`

  const geminiResult = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  })

  return JSON.parse(geminiResult.response.text())
}
