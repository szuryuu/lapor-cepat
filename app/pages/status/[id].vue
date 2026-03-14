<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div v-if="pending" class="flex flex-col items-center gap-4">
      <Loader2 class="w-10 h-10 animate-spin text-slate-900" />
      <p class="text-xs font-bold uppercase tracking-widest text-slate-500">Melacak Sinyal...</p>
    </div>

    <div v-else-if="error || !report" class="w-full max-w-md bg-white border-2 border-slate-900 flex flex-col items-center text-center p-8 gap-4 shadow-lg shadow-red-900/5">
      <AlertTriangle class="w-12 h-12 text-red-600" />
      <div class="flex flex-col">
        <h1 class="text-2xl font-black uppercase text-slate-900 tracking-tight">Data Tidak Ditemukan</h1>
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">ID Laporan tidak valid atau telah dihapus.</p>
      </div>
      <NuxtLink to="/" class="w-full bg-slate-900 hover:bg-black text-white border-2 border-slate-900 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors mt-4">
        Kembali ke Portal
      </NuxtLink>
    </div>

    <div v-else class="w-full max-w-md bg-white border-2 border-slate-900 flex flex-col shadow-lg shadow-slate-200">
      <div class="bg-slate-900 p-6 flex flex-col items-center text-center gap-2">
        <Activity class="w-8 h-8 text-white mb-2" />
        <h1 class="text-xl font-black uppercase text-white tracking-tight">Status Evakuasi</h1>
        <button @click="copyId" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 transition-colors group border border-slate-700 hover:border-slate-500">
          <span class="text-[10px] font-mono font-bold" :class="copied ? 'text-green-400' : 'text-slate-300'">ID: {{ report.id }}</span>
          <CheckCircle v-if="copied" class="w-3 h-3 text-green-400" />
          <Copy v-else class="w-3 h-3 text-slate-400 group-hover:text-white" />
        </button>
      </div>

      <div v-if="report.survivalInstructions && report.survivalInstructions.length > 0 && report.status === 'PENDING'" class="bg-yellow-50 border-y-2 border-yellow-500 p-6 flex flex-col gap-3">
        <h2 class="text-xs font-black uppercase tracking-widest text-yellow-800 flex items-center gap-2">
          <AlertTriangle class="w-4 h-4" />
          Instruksi Keselamatan Darurat
        </h2>
        <ul class="flex flex-col gap-2">
          <li v-for="(instruction, idx) in report.survivalInstructions" :key="idx" class="flex gap-3 items-start">
            <span class="bg-yellow-500 text-slate-900 text-[10px] font-black w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">{{ idx + 1 }}</span>
            <span class="text-sm font-bold text-yellow-900 leading-snug">{{ instruction }}</span>
          </li>
        </ul>
      </div>

      <div class="p-8 flex flex-col gap-8">
        <div class="flex flex-col gap-2 relative">
          <div class="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>

          <div class="flex items-start gap-4 z-10 relative">
            <div class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 border-slate-900" :class="report.status === 'PENDING' ? 'bg-red-500 animate-pulse' : 'bg-green-500'">
              <Check v-if="report.status !== 'PENDING'" class="w-4 h-4 text-slate-900 font-bold" />
              <div v-else class="w-2 h-2 bg-slate-900 rounded-full"></div>
            </div>
            <div class="flex flex-col pt-1">
              <span class="text-sm font-black uppercase tracking-widest text-slate-900">1. Laporan Diterima</span>
              <span class="text-xs font-bold text-slate-500 mt-1">Sistem pusat telah mengamankan data Anda.</span>
            </div>
          </div>

          <div class="flex items-start gap-4 z-10 relative mt-4">
            <div class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 border-slate-900" :class="report.status === 'DISPATCHED' ? 'bg-blue-500 animate-pulse' : (report.status === 'RESOLVED' ? 'bg-green-500' : 'bg-slate-100')">
              <Check v-if="report.status === 'RESOLVED'" class="w-4 h-4 text-slate-900 font-bold" />
              <div v-else-if="report.status === 'DISPATCHED'" class="w-2 h-2 bg-slate-900 rounded-full"></div>
            </div>
            <div class="flex flex-col pt-1">
              <span class="text-sm font-black uppercase tracking-widest" :class="report.status !== 'PENDING' ? 'text-slate-900' : 'text-slate-400'">2. TRC Dikerahkan</span>
              <span class="text-xs font-bold mt-1" :class="report.status !== 'PENDING' ? 'text-slate-500' : 'text-slate-400'">Tim Reaksi Cepat sedang menuju lokasi kordinat.</span>
            </div>
          </div>

          <div class="flex items-start gap-4 z-10 relative mt-4">
            <div class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 border-slate-900" :class="report.status === 'RESOLVED' ? 'bg-green-500' : 'bg-slate-100'">
              <Check v-if="report.status === 'RESOLVED'" class="w-4 h-4 text-slate-900 font-bold" />
            </div>
            <div class="flex flex-col pt-1">
              <span class="text-sm font-black uppercase tracking-widest" :class="report.status === 'RESOLVED' ? 'text-slate-900' : 'text-slate-400'">3. Situasi Terkendali</span>
              <span class="text-xs font-bold mt-1" :class="report.status === 'RESOLVED' ? 'text-slate-500' : 'text-slate-400'">Operasi evakuasi dan penanganan selesai.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 pt-0 flex flex-col gap-3">
        <button @click="refresh" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-900 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2">
          <RefreshCcw class="w-4 h-4" /> Segarkan Status
        </button>
        <NuxtLink to="/" class="w-full bg-slate-900 hover:bg-black text-white border-2 border-slate-900 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors">
          Kembali ke Portal
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loader2, AlertTriangle, Activity, RefreshCcw, Copy, CheckCircle, Check } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, pending, error, refresh } = await useFetch<Report>(`/api/reports/${route.params.id}`)
useSeoMeta({ title: 'Pelacakan Evakuasi — LaporCepat' })

const copied = ref(false)

function copyId() {
  if (report.value?.id) {
    navigator.clipboard.writeText(report.value.id)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>
