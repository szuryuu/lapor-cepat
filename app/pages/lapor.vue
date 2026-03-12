<template>
  <div class="max-w-2xl mx-auto flex flex-col gap-8 md:gap-12">
    <div class="bg-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div class="w-16 h-16 shrink-0 bg-yellow-300 border-4 border-black flex items-center justify-center rounded-full rotate-12">
          <Info class="w-8 h-8 text-black" />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-black uppercase mb-3 text-black">Instruksi Darurat</h2>
          <div class="flex flex-col gap-2 font-mono text-sm font-bold text-black">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-xs shrink-0">1</span> 
              <span>Izinkan akses lokasi (GPS) pada browser.</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-xs shrink-0">2</span> 
              <span>Tekan dan tahan tombol merah di bawah.</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-xs shrink-0">3</span> 
              <span>Sebutkan jenis bencana, patokan lokasi, & korban.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ClientOnly>
      <div class="flex flex-col gap-8">
        <VoiceRecorder @audio-ready="handleAudio" />
        <PhotoUpload v-model="photoFile" />
        
        <button 
          v-if="audioBlob"
          @click="submitReport"
          :disabled="isSubmitting"
          class="w-full bg-black text-white font-black text-xl md:text-2xl uppercase tracking-widest py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] transition-all disabled:opacity-50 cursor-pointer flex justify-center items-center gap-4"
        >
          <template v-if="!isSubmitting">
            <Send class="w-6 h-6 md:w-8 md:h-8" />
            <span>Kirim Laporan Sekarang</span>
          </template>
          <Loader2 v-else class="w-8 h-8 animate-spin" />
        </button>
      </div>
      
      <template #fallback>
        <div class="flex flex-col items-center justify-center py-24 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Loader2 class="w-12 h-12 animate-spin mb-4 text-black" />
          <span class="font-mono font-bold uppercase tracking-widest text-black">Aktivasi Perekam...</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Info, Loader2, Send } from 'lucide-vue-next'
import VoiceRecorder from '~/components/lapor/VoiceRecorder.vue'
import PhotoUpload from '~/components/lapor/PhotoUpload.vue'
import { useGeolocation } from '~/composables/useGeolocation'

const { getCoordinates } = useGeolocation()

const audioBlob = ref<Blob | null>(null)
const photoFile = ref<File | null>(null)
const isSubmitting = ref(false)

function handleAudio(blob: Blob) {
  audioBlob.value = blob
}

async function submitReport() {
  if (!audioBlob.value || isSubmitting.value) return
  isSubmitting.value = true
  
  try {
    const coords = await getCoordinates().catch(() => ({ lat: 0, lng: 0 }))
    const formData = new FormData()
    
    formData.append('audio', audioBlob.value, 'report.webm')
    formData.append('lat', coords.lat.toString())
    formData.append('lng', coords.lng.toString())
    
    if (photoFile.value) {
      formData.append('photo', photoFile.value)
    }

    const response: any = await $fetch('/api/reports', {
      method: 'POST',
      body: formData
    })

    navigateTo(`/konfirmasi/${response.id}`)
  } catch (e: any) {
    alert(e.message || 'Gagal mengirim laporan. Pastikan koneksi stabil.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
