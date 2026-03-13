import { ref } from 'vue'

export function useVoiceRecorder() {
  const isRecording = ref(false)
  const duration = ref(0)
  const audioBlob = ref<Blob | null>(null)
  const error = ref('')

  let mediaRecorder: MediaRecorder | null = null
  let audioChunks: Blob[] = []
  let timer: any = null

  const start = async () => {
    try {
      error.value = ''
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Akses diblokir sistem. Wajib gunakan HTTPS.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      let mimeType = 'audio/webm'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4'
      }

      mediaRecorder = new MediaRecorder(stream, { mimeType })
      audioChunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        audioBlob.value = new Blob(audioChunks, { type: mimeType })
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(250)
      isRecording.value = true
      duration.value = 0
      timer = setInterval(() => { duration.value++ }, 1000)

    } catch (err: any) {
      error.value = err.message || 'Akses mikrofon diblokir.'
    }
  }

  const stop = () => {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop()
      isRecording.value = false
      clearInterval(timer)
    }
  }

  return { start, stop, isRecording, duration, audioBlob, error }
}
