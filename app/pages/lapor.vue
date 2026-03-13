<template>
  <div class="w-full flex flex-col gap-6">
    <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-3">
      <h1 class="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
        <Info class="w-4 h-4 text-red-600" />
        Protokol Darurat
      </h1>
      <ul class="text-slate-600 text-xs font-bold space-y-2 list-none">
        <li class="flex gap-2"><span class="text-red-600">■</span> Pastikan Anda berada di zona aman sebelum melapor.</li>
        <li class="flex gap-2"><span class="text-red-600">■</span> Izinkan akses <strong>LOKASI & MIKROFON</strong> pada peringatan browser.</li>
        <li class="flex gap-2"><span class="text-red-600">■</span> Sebutkan jenis bencana, patokan lokasi, & jumlah korban.</li>
      </ul>
    </div>

    <ClientOnly>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col w-full gap-4">
          <div class="border-2 border-slate-900 bg-white flex flex-col">
            <div class="flex justify-between items-start p-5 bg-slate-50 border-b-2 border-slate-900">
              <div class="text-2xl font-black uppercase leading-none tracking-tight text-slate-900">Lapor<br/><span class="text-red-600">Darurat</span></div>
              <div class="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="isRecording ? 'bg-red-500 animate-pulse' : (isLocked ? 'bg-green-400' : 'bg-slate-500')"></span>
                  {{ isRecording ? `MEREKAM ${duration}S` : (isLocked ? 'SENSOR AKTIF' : 'MENUNGGU SENSOR') }}
              </div>
            </div>
            
            <div class="p-8 md:p-12 flex flex-col items-center justify-center gap-8 min-h-[250px]">
              <p class="text-sm font-bold text-slate-700 leading-relaxed text-center max-w-sm">
                <span v-if="audioBlob">Rekaman diamankan. Sistem akan otomatis melampirkan koordinat GPS Anda.</span>
                <span v-else>Tekan dan tahan tombol di bawah. Sistem akan meminta izin GPS & Mic secara bersamaan. Bicara dengan jelas.</span>
              </p>

              <button
                @mousedown="handleStart"
                @mouseup="stop"
                @mouseleave="stop"
                @touchstart.prevent="handleStart"
                @touchend.prevent="stop"
                class="w-full max-w-sm py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border-2 select-none touch-none"
                :class="isRecording ? 'bg-red-700 text-white border-slate-900 scale-95' : 'bg-red-600 hover:bg-red-700 text-white border-slate-900'"
              >
                <Mic class="w-5 h-5" />
                {{ isRecording ? 'LEPASKAN UNTUK SELESAI' : 'TAHAN & BICARA KE BPBD' }}
              </button>
            </div>
          </div>
          <div v-if="audioError || gpsError" class="bg-slate-900 text-white p-4 text-xs font-bold uppercase tracking-widest flex gap-3 border-2 border-red-600">
            <AlertOctagon class="w-4 h-4 shrink-0 text-red-500" />
            <p>{{ audioError || gpsError }}</p>
          </div>
        </div>

        <PhotoUpload v-model="photoFile" />
        
        <button 
          v-if="audioBlob"
          @click="submitReport"
          :disabled="isSubmitting"
          class="w-full bg-slate-900 hover:bg-black text-white border-2 border-slate-900 py-4 px-6 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
        >
          <template v-if="!isSubmitting">
            <Send class="w-5 h-5" />
            KIRIM KE PUSAT KOMANDO
          </template>
          <Loader2 v-else class="w-5 h-5 animate-spin" />
        </button>
      </div>
      
      <template #fallback>
        <div class="bg-slate-50 border-2 border-slate-900 p-12 flex flex-col items-center justify-center gap-4">
          <Loader2 class="w-8 h-8 animate-spin text-slate-900" />
          <span class="text-xs font-bold uppercase tracking-widest text-slate-600">Inisialisasi Sistem...</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Info, Loader2, Send, Mic, AlertOctagon } from 'lucide-vue-next'
import PhotoUpload from '~/components/lapor/PhotoUpload.vue'
import { useGeolocation } from '~/composables/useGeolocation'
import { useVoiceRecorder } from '~/composables/useVoiceRecorder'

const { requestGPS, coords, isLocked, errorMsg: gpsError } = useGeolocation()
const { start, stop, isRecording, duration, audioBlob, error: audioError } = useVoiceRecorder()

const photoFile = ref<File | null>(null)
const isSubmitting = ref(false)

async function handleStart() {
  if (!isLocked.value) {
    requestGPS().catch(() => {}) // Tembak GPS API di saat user interaksi pertama kali
  }
  await start()
  if (import.meta.client && navigator.vibrate) navigator.vibrate(50)
}

async function submitReport() {
  if (!audioBlob.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const finalCoords = coords.value || { lat: 0, lng: 0 }
    const formData = new FormData()
    formData.append('audio', audioBlob.value, 'report.webm')
    formData.append('lat', finalCoords.lat.toString())
    formData.append('lng', finalCoords.lng.toString())
    if (photoFile.value) formData.append('photo', photoFile.value)

    const response: any = await $fetch('/api/reports', { method: 'POST', body: formData })
    navigateTo(`/konfirmasi/${response.id}`)
  } catch (e: any) {
    alert(e.message || 'Gagal mengirim laporan. Periksa koneksi internet.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
