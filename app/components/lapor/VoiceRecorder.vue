<template>
  <div class="flex flex-col w-full gap-4">
    <div class="border-2 border-slate-900 bg-white flex flex-col">
      <div class="flex justify-between items-start p-5 bg-slate-50 border-b-2 border-slate-900">
        <div class="text-2xl font-black uppercase leading-none tracking-tight text-slate-900">Lapor<br/><span class="text-red-600">Darurat</span></div>
        <div class="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-400'"></span>
            {{ isRecording ? `MEREKAM ${duration}S` : 'GPS AKTIF' }}
        </div>
      </div>
      
      <div class="p-8 md:p-12 flex flex-col items-center justify-center gap-8 min-h-[250px]">
        <p class="text-sm font-bold text-slate-700 leading-relaxed text-center max-w-sm">
          <span v-if="hasRecorded">Rekaman berhasil diamankan. Anda dapat mengirimkan laporan sekarang.</span>
          <span v-else>Koordinat Anda telah terdeteksi. Bicara langsung ke sistem untuk merekam kondisi Anda.</span>
        </p>

        <button
          @mousedown="startRecording"
          @mouseup="stopRecording"
          @mouseleave="handleMouseLeave"
          @touchstart.prevent="startRecording"
          @touchend.prevent="stopRecording"
          class="w-full max-w-sm py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border-2"
          :class="isRecording ? 'bg-red-700 text-white border-slate-900' : 'bg-red-600 hover:bg-red-700 text-white border-slate-900'"
        >
          <Mic class="w-5 h-5" />
          {{ isRecording ? 'LEPASKAN UNTUK SELESAI' : 'TAHAN & BICARA KE BPBD' }}
        </button>
      </div>
      
      <div class="bg-slate-100 border-t-2 border-slate-900 p-3 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
        <span>Diteruskan ke <strong class="text-slate-900">BPBD Setempat</strong></span>
        <span>SYS.24</span>
      </div>
    </div>

    <div v-if="errorMsg || recorderError" class="bg-slate-900 text-white p-4 text-xs font-bold uppercase tracking-widest flex gap-3 border-2 border-red-600">
      <AlertOctagon class="w-4 h-4 shrink-0 text-red-500" />
      <p>{{ errorMsg || recorderError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Mic, AlertOctagon } from 'lucide-vue-next'
import { useVoiceRecorder } from '~/composables/useVoiceRecorder'

const emit = defineEmits<{ 'audio-ready': [Blob] }>()
const { start, stop, isRecording, duration, error: recorderError, audioBlob } = useVoiceRecorder()
const hasRecorded = ref(false)
const errorMsg = ref('')

async function startRecording() {
  errorMsg.value = ''; hasRecorded.value = false;
  try { await start(); navigator?.vibrate?.(50) } 
  catch { errorMsg.value = 'Izin mikrofon ditolak.' }
}

function stopRecording() { if (isRecording.value) stop() }
function handleMouseLeave() { if (isRecording.value) stop() }

watch(audioBlob, (newBlob) => {
  if (newBlob) {
    navigator?.vibrate?.([50, 100, 50])
    hasRecorded.value = true
    emit('audio-ready', newBlob)
  }
})
</script>
