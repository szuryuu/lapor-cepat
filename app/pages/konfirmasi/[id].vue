<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4 gap-6">
    <div v-if="pending" class="flex flex-col items-center gap-4">
      <Loader2 class="w-10 h-10 animate-spin text-slate-900" />
      <span class="text-xs font-bold uppercase tracking-widest text-slate-500">AI sedang menganalisis laporan Anda...</span>
    </div>

    <div v-else-if="report" class="w-full max-w-md bg-white border-2 border-slate-900 flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
      <div class="bg-slate-900 text-white p-6 flex items-center gap-3">
        <ShieldAlert class="w-6 h-6 text-red-500" />
        <h1 class="text-lg font-black uppercase tracking-widest">Verifikasi Laporan</h1>
      </div>

      <div class="p-6 flex flex-col gap-6">

        <div v-if="report.situationNarrative" class="bg-slate-900 text-white p-4 flex flex-col gap-2 border-l-4 border-red-500">
          <span class="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
            <Brain class="w-3 h-3" /> Analisis Situasi AI
          </span>
          <p class="text-sm font-bold leading-relaxed text-slate-100">{{ report.situationNarrative }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ringkasan Sistem</span>
          <p class="text-sm font-black text-slate-900 leading-snug">{{ report.summaryBahasa }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 border-2 border-slate-200 p-3 flex flex-col">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tipe Bencana</span>
            <span class="text-sm font-black text-slate-900">{{ report.disasterType }}</span>
          </div>
          <div class="bg-slate-50 border-2 border-slate-200 p-3 flex flex-col">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lokasi</span>
            <span class="text-sm font-black text-slate-900 line-clamp-2">{{ report.locationText }}</span>
          </div>
        </div>

        <div v-if="report.survivalInstructions?.length" class="bg-yellow-50 border-2 border-yellow-500 p-4 flex flex-col gap-3">
          <h2 class="text-[10px] font-black uppercase tracking-widest text-yellow-800 flex items-center gap-2">
            <AlertTriangle class="w-4 h-4" /> Instruksi Bertahan Hidup
          </h2>
          <ul class="flex flex-col gap-2">
            <li v-for="(inst, i) in report.survivalInstructions" :key="i" class="flex items-start gap-2">
              <span class="bg-yellow-500 text-slate-900 text-[10px] font-black w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">{{ i + 1 }}</span>
              <span class="text-xs font-bold text-yellow-900">{{ inst }}</span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 mt-2">
          <button @click="confirmReport" :disabled="isSubmitting" class="w-full bg-slate-900 hover:bg-black text-white p-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            <Send v-if="!isSubmitting" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isSubmitting ? 'MENGIRIM...' : 'DATA BENAR, KIRIM SEKARANG' }}
          </button>
          <button @click="cancelReport" :disabled="isSubmitting" class="w-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 p-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            <RotateCcw class="w-4 h-4" />
            BATALKAN & REKAM ULANG
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loader2, ShieldAlert, AlertTriangle, Send, RotateCcw, Brain } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, pending } = await useFetch<Report>(`/api/reports/${route.params.id}`)
const isSubmitting = ref(false)

async function confirmReport() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await $fetch(`/api/reports/${route.params.id}/confirm`, { method: 'POST' })
    navigateTo(`/status/${route.params.id}`)
  } catch {
    isSubmitting.value = false
  }
}

async function cancelReport() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await $fetch(`/api/reports/${route.params.id}/cancel`, { method: 'DELETE' })
    navigateTo('/lapor')
  } catch {
    isSubmitting.value = false
  }
}
</script>
