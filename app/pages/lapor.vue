<template>
  <div class="w-full flex flex-col gap-6 relative">
    <div v-if="submitError" class="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50 bg-red-600 text-white p-4 text-xs font-bold uppercase tracking-widest flex items-start justify-between border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-in slide-in-from-top-4 fade-in duration-300">
      <div class="flex items-start gap-3">
        <AlertOctagon class="w-5 h-5 shrink-0 mt-0.5" />
        <p class="leading-relaxed">{{ submitError }}</p>
      </div>
      <button @click="submitError = null" class="shrink-0 hover:text-slate-900 transition-colors"><X class="w-5 h-5" /></button>
    </div>

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
        
        <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Phone class="w-3 h-3" /> Nomor HP Darurat (Opsional, Untuk Hubungan TRC)
          </label>
          <input v-model="phone" type="tel" placeholder="08xxxxxxxxxx" class="w-full bg-slate-50 border-2 border-slate-200 px-4 py-3 text-sm font-bold tracking-widest outline-none focus:border-slate-900 transition-colors" />
        </div>

        <div class="flex flex-col w-full gap-4">
          <div class="flex bg-slate-200 p-1 border-2 border-slate-900">
            <button @click="isSilentMode = false" class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2" :class="!isSilentMode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'">
              <Mic class="w-3 h-3" /> Suara
            </button>
            <button @click="isSilentMode = true" class="flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2" :class="isSilentMode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'">
              <Keyboard class="w-3 h-3" /> Teks (Bisu)
            </button>
          </div>

          <div class="border-2 border-slate-900 bg-white flex flex-col">
            <div class="flex justify-between items-start p-5 bg-slate-50 border-b-2 border-slate-900">
              <div class="text-2xl font-black uppercase leading-none tracking-tight text-slate-900">Lapor<br/><span class="text-red-600">Darurat</span></div>
              <div class="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-2">
                <template v-if="!isSilentMode">
                  <span class="w-2 h-2 rounded-full" :class="isRecording ? 'bg-red-500 animate-pulse' : (isLocked ? 'bg-green-400' : 'bg-slate-500')"></span>
                  {{ isRecording ? `MEREKAM ${duration}S` : (isLocked ? 'SENSOR AKTIF' : 'MENUNGGU SENSOR') }}
                </template>
                <template v-else>
                  <span class="w-2 h-2 rounded-full" :class="isLocked ? 'bg-green-400' : 'bg-slate-500'"></span>
                  {{ isLocked ? 'GPS AKTIF' : 'MENUNGGU GPS' }}
                </template>
              </div>
            </div>
            
            <div v-if="isFallback" class="bg-yellow-500 text-slate-900 p-3 flex items-center justify-center gap-2 border-b-2 border-slate-900">
              <AlertTriangle class="w-4 h-4 shrink-0" />
              <span class="text-[10px] font-bold uppercase tracking-widest text-center leading-snug">Sinyal GPS Lemah. Estimasi lokasi kurang akurat. Mohon sebutkan patokan tempat secara spesifik.</span>
            </div>
            
            <div class="p-6 md:p-12 flex flex-col items-center justify-center gap-8 min-h-[250px]">
              
              <template v-if="isSilentMode">
                <textarea v-model="textContent" rows="5" placeholder="Ketik situasi darurat Anda secara detail di sini..." class="w-full bg-slate-50 border-2 border-slate-300 focus:border-slate-900 outline-none p-4 text-sm font-bold resize-none transition-colors"></textarea>
              </template>

              <template v-else>
                <div v-if="audioBlob" class="w-full max-w-sm flex flex-col gap-4">
                  <div class="bg-green-50 border-2 border-green-600 p-4 flex items-center gap-3">
                    <CheckCircle class="w-6 h-6 text-green-600 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs font-black uppercase tracking-widest text-green-700">Audio Diamankan</span>
                      <span class="text-[10px] font-bold text-green-600 uppercase mt-0.5">Durasi: {{ duration }} Detik</span>
                    </div>
                  </div>
                  
                  <audio :src="audioUrl" controls class="w-full h-10 outline-none border-2 border-slate-900 bg-slate-50"></audio>
                  
                  <button @click="resetAudio" class="py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 mt-2 border-2 border-transparent hover:border-slate-900">
                    <RotateCcw class="w-4 h-4" /> Buang & Rekam Ulang
                  </button>
                </div>

                <template v-else>
                  <p class="text-sm font-bold text-slate-700 leading-relaxed text-center max-w-sm">
                    Tekan tombol di bawah untuk mulai. Sistem akan meminta izin GPS & Mic. Bicara dengan jelas, lalu tekan lagi untuk selesai.
                  </p>

                  <button
                    @click="toggleRecord"
                    class="w-full max-w-sm py-4 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-colors border-2 select-none"
                    :class="isRecording ? 'bg-red-700 text-white border-slate-900 animate-pulse' : 'bg-red-600 hover:bg-red-700 text-white border-slate-900'"
                  >
                    <Mic class="w-5 h-5" />
                    {{ isRecording ? 'TAP UNTUK BERHENTI' : 'TAP & MULAI BICARA' }}
                  </button>
                </template>
              </template>

            </div>
          </div>
          <div v-if="(!isSilentMode && audioError) || gpsError" class="bg-slate-900 text-white p-4 text-xs font-bold uppercase tracking-widest flex gap-3 border-2 border-red-600">
            <AlertOctagon class="w-4 h-4 shrink-0 text-red-500" />
            <p>{{ (!isSilentMode ? audioError : '') || gpsError }}</p>
          </div>
        </div>

        <PhotoUpload v-model="photoFile" />
        
        <button 
          @click="submitReport"
          :disabled="isSubmitting || (!isSilentMode && !audioBlob) || (isSilentMode && !textContent.trim())"
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
import { ref, onMounted } from 'vue'
import { Info, Loader2, Send, Mic, AlertOctagon, CheckCircle, RotateCcw, X, Phone, Keyboard, AlertTriangle } from 'lucide-vue-next'
import PhotoUpload from '~/components/lapor/PhotoUpload.vue'
import { useGeolocation } from '~/composables/useGeolocation'
import { useVoiceRecorder } from '~/composables/useVoiceRecorder'

const { requestGPS, coords, isLocked, errorMsg: gpsError, isFallback } = useGeolocation()
const { start, stop, reset, isRecording, duration, audioBlob, audioUrl, error: audioError } = useVoiceRecorder()

const isSilentMode = ref(false)
const textContent = ref('')
const phone = ref('')
const photoFile = ref<File | null>(null)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

onMounted(() => {
  requestGPS().catch(() => {})
})

function resetAudio() {
  reset()
}

async function toggleRecord() {
  if (isRecording.value) {
    stop()
  } else {
    if (!isLocked.value) {
      await requestGPS().catch(() => {})
    }
    await start()
    if (import.meta.client && navigator.vibrate) navigator.vibrate(50)
  }
}

async function submitReport() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  submitError.value = null
  
  try {
    if (!isLocked.value) {
      await requestGPS().catch(() => {})
    }

    const finalCoords = coords.value || { lat: 0, lng: 0 }
    const formData = new FormData()
    
    formData.append('lat', finalCoords.lat.toString())
    formData.append('lng', finalCoords.lng.toString())
    if (phone.value) formData.append('phone', phone.value)
    if (photoFile.value) formData.append('photo', photoFile.value)

    if (isSilentMode.value) {
      formData.append('textReport', textContent.value)
    } else {
      if (!audioBlob.value) throw new Error('Audio belum direkam')
      formData.append('audio', audioBlob.value, 'report.webm')
    }

    const response: any = await $fetch('/api/reports', { method: 'POST', body: formData })
    navigateTo(`/konfirmasi/${response.id}`)
  } catch (e: any) {
    submitError.value = e.data?.message || e.message || 'Gagal mengirim laporan'
    setTimeout(() => { submitError.value = null }, 7000)
  } finally {
    isSubmitting.value = false
  }
}
</script>
