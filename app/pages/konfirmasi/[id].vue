<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center py-12">
    <div v-if="pending" class="flex flex-col items-center gap-6">
      <Loader2 class="w-16 h-16 animate-spin text-black" />
      <p class="font-mono font-bold uppercase tracking-widest text-lg">Memverifikasi AI...</p>
    </div>

    <div v-else-if="report" class="w-full max-w-lg flex flex-col gap-6">
      <div class="bg-green-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
        <ShieldCheck class="w-20 h-20 text-black mb-4" />
        <h1 class="text-4xl font-black uppercase tracking-tight mb-2">Laporan Diterima</h1>
        <p class="font-mono font-bold text-black/80">AI telah menganalisis dan meneruskan ke BPBD.</p>
      </div>

      <div class="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
        <div class="flex justify-between items-center border-b-4 border-black pb-4">
          <span class="font-black uppercase text-gray-500">Prioritas</span>
          <SharedPriorityBadge :priority="report.priority" />
        </div>
        
        <div class="flex flex-col gap-1 border-b-2 border-dashed border-black pb-4">
          <span class="font-bold text-xs uppercase text-gray-500 flex items-center gap-2"><MapPin class="w-4 h-4"/> Lokasi Bencana</span>
          <span class="font-black text-lg leading-tight">{{ report.locationText }}</span>
        </div>
        
        <div class="flex justify-between items-center border-b-2 border-dashed border-black pb-4">
          <span class="font-bold text-xs uppercase text-gray-500 flex items-center gap-2"><AlertTriangle class="w-4 h-4"/> Jenis</span>
          <span class="font-black uppercase">{{ report.disasterType }}</span>
        </div>

        <div v-if="report.victimCountEstimated" class="flex justify-between items-center bg-red-100 border-2 border-red-500 p-3">
          <span class="font-bold text-xs uppercase text-red-800 flex items-center gap-2"><Users class="w-4 h-4"/> Korban</span>
          <span class="font-black text-red-900">{{ report.victimCountEstimated }} ORANG - {{ report.victimStatus }}</span>
        </div>
      </div>

      <div class="bg-yellow-300 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
        <Quote class="w-8 h-8 absolute -top-4 bg-white border-2 border-black rounded-full p-1" />
        <p class="font-mono font-bold text-sm mt-2 leading-relaxed">"{{ report.summaryBahasa }}"</p>
        <p class="font-mono text-[10px] text-black/60 mt-4 text-right">ID: {{ report.id }}</p>
      </div>

      <div class="flex flex-col gap-3 mt-4">
        <NuxtLink :to="`/status/${report.id}`" class="bg-black text-white border-4 border-black py-4 font-black uppercase text-center tracking-widest hover:bg-gray-800 hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
          Pantau Status TRC
        </NuxtLink>
        <NuxtLink to="/" class="bg-white text-black border-4 border-black py-4 font-black uppercase text-center tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
          Kembali Beranda
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShieldCheck, MapPin, AlertTriangle, Users, Quote } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, pending } = await useFetch<Report>(`/api/reports/${route.params.id}`)

useSeoMeta({ title: 'Konfirmasi — Lapor Cepat' })
</script>
