<template>
  <div class="max-w-2xl mx-auto flex flex-col gap-8 md:gap-12">
    <div class="bg-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div class="w-16 h-16 shrink-0 bg-yellow-300 border-4 border-black flex items-center justify-center rounded-full rotate-12">
          <Info class="w-8 h-8" />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-black uppercase mb-3">Instruksi Darurat</h2>
          <div class="flex flex-col gap-2 font-mono text-sm font-bold">
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

    <VoiceRecorder />
  </div>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import VoiceRecorder from '~/components/lapor/VoiceRecorder.vue'
</script>
