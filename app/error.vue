<template>
  <div class="min-h-screen bg-[#f4f4f0] text-black flex flex-col items-center justify-center p-6 font-mono selection:bg-yellow-300">
    <div class="max-w-md w-full bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
      <AlertTriangle class="w-24 h-24 text-red-500 mb-6" stroke-width="1.5" />
      <h1 class="text-6xl md:text-8xl font-black mb-2">{{ error?.statusCode || 404 }}</h1>
      <p class="text-lg md:text-xl font-bold uppercase mb-8">{{ error?.message || 'HALAMAN TIDAK DITEMUKAN' }}</p>
      <div class="w-full h-1 bg-black mb-8"></div>
      <button @click="handleError" class="w-full py-4 bg-black text-white font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
        KEMBALI KE BERANDA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>
