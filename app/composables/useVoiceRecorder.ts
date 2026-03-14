import { ref } from 'vue'

export function useVoiceRecorder() {
  const isRecording = ref(false)
  const duration = ref(0)
  const audioBlob = ref<Blob | null>(null)
  const audioUrl = ref<string | null>(null)
  const error = ref<string | null>(null)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: Blob[] = []
  let timer: ReturnType<typeof setInterval> | null = null

  const MAX_DURATION = 45 

  const start = async () => {
    try {
      error.value = null
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        audioBlob.value = blob
        audioUrl.value = URL.createObjectURL(blob)
        chunks = []
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      isRecording.value = true
      duration.value = 0

      timer = setInterval(() => {
        duration.value++
        if (duration.value >= MAX_DURATION) {
          stop()
        }
      }, 1000)

    } catch {
      error.value = 'Akses mikrofon ditolak atau tidak tersedia.'
      isRecording.value = false
    }
  }

  const stop = () => {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop()
      isRecording.value = false
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      
      if (duration.value < 3) {
        error.value = 'REKAMAN TERLALU PENDEK (MINIMAL 3 DETIK).'
        audioBlob.value = null
        if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
        audioUrl.value = null
      }
    }
  }

  const reset = () => {
    audioBlob.value = null
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = null
    duration.value = 0
    error.value = null
  }

  return { start, stop, reset, isRecording, duration, audioBlob, audioUrl, error }
}
