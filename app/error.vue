<template>
  <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans antialiased">
    <div class="w-full max-w-md bg-white border-2 border-slate-900 p-8 flex flex-col items-center text-center gap-6">
      <div class="bg-red-600 p-4 border-2 border-slate-900">
        <AlertTriangle class="w-10 h-10 text-white" />
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-6xl font-black text-slate-900 tracking-tighter">{{ error?.statusCode || 404 }}</h1>
        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Sistem Interruption</span>
      </div>
      <p class="text-sm font-bold text-slate-700 leading-relaxed border-t-2 border-slate-100 pt-6 w-full">
        {{ error?.message || 'Halaman atau direktori yang Anda tuju tidak ditemukan dalam sistem.' }}
      </p>
      <button @click="handleError" class="w-full bg-slate-900 hover:bg-black text-white border-2 border-slate-900 py-4 font-bold text-xs uppercase tracking-widest transition-colors mt-2">
        KEMBALI KE PORTAL UTAMA
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import type { NuxtError } from '#app'

defineProps({ error: Object as () => NuxtError })
const handleError = () => clearError({ redirect: '/' })
</script>
