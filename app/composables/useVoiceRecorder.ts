export function useVoiceRecorder() {
  const isRecording = ref(false)
  const audioBlob = ref<Blob | null>(null)
  const audioUrl = ref<string | null>(null)
  const duration = ref(0)
  const error = ref<string | null>(null)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: Blob[] = []
  let timer: ReturnType<typeof setInterval> | null = null

  async function start() {
    error.value = null
    audioBlob.value = null
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = null
    duration.value = 0
    chunks = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        audioBlob.value = blob
        audioUrl.value = URL.createObjectURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start()
      isRecording.value = true

      timer = setInterval(() => {
        duration.value++
        if (duration.value >= 20) stop()
      }, 1000)
    } catch {
      error.value = 'Izin mikrofon ditolak. Aktifkan mikrofon di pengaturan browser.'
    }
  }

  function stop() {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop()
      isRecording.value = false
      if (timer) clearInterval(timer)
    }
  }

  function reset() {
    stop()
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
    audioBlob.value = null
    audioUrl.value = null
    duration.value = 0
    error.value = null
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer)
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  })

  return { isRecording, audioBlob, audioUrl, duration, error, start, stop, reset }
}
