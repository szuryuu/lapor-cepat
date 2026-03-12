<template>
  <div class="w-full flex flex-col gap-6">
    <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-3">
      <h1 class="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
        <Info class="w-4 h-4 text-red-600" />
        Protokol Darurat
      </h1>
      <ul class="text-slate-600 text-xs font-bold space-y-2 list-none">
        <li class="flex gap-2"><span class="text-red-600">■</span> Pastikan Anda berada di zona aman sebelum melapor.</li>
        <li class="flex gap-2"><span class="text-red-600">■</span> Izinkan akses lokasi pada browser Anda.</li>
        <li class="flex gap-2"><span class="text-red-600">■</span> Sebutkan jenis bencana, patokan lokasi, & jumlah korban.</li>
      </ul>
    </div>

    <ClientOnly>
      <div class="flex flex-col gap-6">
        <VoiceRecorder @audio-ready="handleAudio" />
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
import { Info, Loader2, Send } from 'lucide-vue-next'
import VoiceRecorder from '~/components/lapor/VoiceRecorder.vue'
import PhotoUpload from '~/components/lapor/PhotoUpload.vue'
import { useGeolocation } from '~/composables/useGeolocation'

const { capture } = useGeolocation()
const audioBlob = ref<Blob | null>(null)
const photoFile = ref<File | null>(null)
const isSubmitting = ref(false)

function handleAudio(blob: Blob) { audioBlob.value = blob }

async function submitReport() {
  if (!audioBlob.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const coords = await capture().catch(() => ({ lat: 0, lng: 0 }))
    const formData = new FormData()
    formData.append('audio', audioBlob.value, 'report.webm')
    formData.append('lat', coords.lat.toString())
    formData.append('lng', coords.lng.toString())
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
