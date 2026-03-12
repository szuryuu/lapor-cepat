<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div v-if="pending" class="flex flex-col items-center gap-4">
      <Loader2 class="w-10 h-10 animate-spin text-slate-900" />
      <p class="text-xs font-bold uppercase tracking-widest text-slate-500">MENGAMANKAN DATA...</p>
    </div>

    <div v-else-if="report" class="w-full max-w-md bg-white border-2 border-slate-900 flex flex-col">
      <div class="bg-slate-50 border-b-2 border-slate-900 p-8 flex flex-col items-center text-center gap-4">
        <div class="bg-green-500 p-3 border-2 border-slate-900">
          <ShieldCheck class="w-8 h-8 text-slate-900" />
        </div>
        <div class="flex flex-col">
          <h1 class="text-2xl font-black uppercase text-slate-900 tracking-tight">Laporan Diterima</h1>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Sistem BPBD Aktif</p>
        </div>
      </div>

      <div class="p-6 flex flex-col gap-4">
        <div class="flex justify-between items-center pb-3 border-b-2 border-slate-100">
          <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Prioritas</span>
          <SharedPriorityBadge :priority="report.priority" />
        </div>
        
        <div class="flex flex-col gap-1 pb-3 border-b-2 border-slate-100">
          <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Titik Koordinat Bencana</span>
          <span class="text-base font-black text-slate-900 uppercase leading-snug">{{ report.locationText }}</span>
        </div>

        <div v-if="report.victimCountEstimated" class="flex justify-between items-center bg-red-50 border-2 border-red-600 p-3">
          <span class="text-xs font-bold uppercase tracking-widest text-red-700">Korban Terdeteksi</span>
          <span class="text-sm font-black text-red-700 uppercase">{{ report.victimCountEstimated }} Orang</span>
        </div>

        <div class="bg-slate-50 border-2 border-slate-200 p-4 relative mt-2">
          <p class="text-sm font-bold text-slate-700 uppercase">"{{ report.summaryBahasa }}"</p>
          <span class="absolute top-2 right-2 text-[10px] font-bold text-slate-400">ID:{{ report.id.split('-')[0] }}</span>
        </div>
      </div>

      <div class="p-6 pt-0 flex flex-col gap-3">
        <NuxtLink :to="`/status/${report.id}`" class="w-full bg-slate-900 hover:bg-black text-white border-2 border-slate-900 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors">
          Pantau Status Evakuasi
        </NuxtLink>
        <NuxtLink to="/" class="w-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 py-4 text-xs font-bold uppercase tracking-widest text-center transition-colors">
          Kembali ke Portal
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShieldCheck } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, pending } = await useFetch<Report>(`/api/reports/${route.params.id}`)
useSeoMeta({ title: 'Konfirmasi — LaporCepat' })
</script>
