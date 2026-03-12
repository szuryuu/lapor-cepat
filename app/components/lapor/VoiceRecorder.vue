<template>
  <div class="flex flex-col items-center w-full gap-6">
    <div class="w-full bg-white border-4 border-black p-8 md:p-16 flex flex-col items-center justify-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative transition-colors duration-500" :class="{ 'bg-red-50 border-red-500': isRecording }">
      <div v-if="isRecording" class="absolute top-6 right-6 flex items-center gap-2 bg-white px-3 py-1 border-2 border-black">
        <span class="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
        <span class="font-mono font-bold text-red-600 text-sm">REC {{ recordingTime }}s</span>
      </div>

      <button
        @mousedown="startRecording"
        @mouseup="stopRecording"
        @mouseleave="handleMouseLeave"
        @touchstart.prevent="startRecording"
        @touchend.prevent="stopRecording"
        class="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-black flex items-center justify-center transition-all duration-150 focus:outline-none cursor-pointer"
        :class="[
          isRecording 
            ? 'bg-red-700 scale-95 shadow-[inset_0px_0px_30px_rgba(0,0,0,0.6)]' 
            : 'bg-red-500 hover:bg-red-600 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        ]"
      >
        <Mic class="w-20 h-20 md:w-24 md:h-24 text-white" :class="{ 'animate-pulse': isRecording }" />
      </button>

      <p class="mt-8 font-black text-xl md:text-3xl uppercase tracking-widest text-center" :class="isRecording ? 'text-red-600' : 'text-black'">
        {{ statusText }}
      </p>
    </div>

    <div v-if="errorMsg" class="w-full bg-red-100 border-4 border-black p-4 text-red-900 font-mono font-bold flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <AlertOctagon class="w-6 h-6 shrink-0 mt-0.5" />
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Mic, AlertOctagon } from 'lucide-vue-next'
import { useVoiceRecorder } from '~/composables/useVoiceRecorder'

const emit = defineEmits<{ 'audio-ready': [Blob] }>()
const { startRecord, stopRecord, isRecording, recordingTime } = useVoiceRecorder()

const hasRecorded = ref(false)
const errorMsg = ref('')

const statusText = computed(() => {
  if (isRecording.value) return 'LEPAS UNTUK SELESAI'
  if (hasRecorded.value) return 'SUARA TEREKAM'
  return 'TEKAN & TAHAN'
})

async function startRecording() {
  errorMsg.value = ''
  try {
    await startRecord()
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(50)
  } catch (e: any) {
    errorMsg.value = 'Akses mikrofon ditolak atau gagal dimulai.'
  }
}

async function stopRecording() {
  if (!isRecording.value) return
  await processAudio()
}

async function handleMouseLeave() {
  if (isRecording.value) {
    await processAudio()
  }
}

async function processAudio() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([50, 100, 50])
  try {
    const audioBlob = await stopRecord()
    hasRecorded.value = true
    emit('audio-ready', audioBlob)
  } catch (e: any) {
    errorMsg.value = 'Gagal menyimpan rekaman.'
  }
}
</script>
