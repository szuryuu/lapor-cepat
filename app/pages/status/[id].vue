<template>
  <div class="min-h-screen flex flex-col bg-slate-100 font-sans antialiased">
    <header class="bg-white border-b-2 border-slate-900 px-4 py-4 flex items-center gap-4 sticky top-0 z-40">
      <NuxtLink to="/" class="bg-slate-900 hover:bg-black text-white p-2 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <span class="font-black text-lg uppercase tracking-tight text-slate-900">Status Operasi</span>
    </header>

    <main class="flex-1 p-4 max-w-md mx-auto w-full flex flex-col gap-6 py-8">
      <div v-if="report" class="bg-white border-2 border-slate-900 p-6 flex flex-col gap-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
          ID:{{ report.id.split('-')[0] }}
        </div>

        <div class="relative pl-10 flex flex-col gap-8 mt-4">
          <div class="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>
          
          <div v-for="item in timeline" :key="item.key" class="relative z-10 flex flex-col gap-1">
            <div class="absolute -left-10 w-7 h-7 bg-white border-2 flex items-center justify-center" :class="isReached(item.key) ? item.borderColor : 'border-slate-300'">
              <component :is="item.icon" class="w-4 h-4" :class="isReached(item.key) ? item.iconColor : 'text-slate-300'" />
            </div>
            <span class="text-sm font-black uppercase tracking-tight" :class="isReached(item.key) ? 'text-slate-900' : 'text-slate-400'">{{ item.title }}</span>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest" :class="isReached(item.key) ? 'text-slate-600' : 'text-slate-400'">{{ item.desc }}</span>
          </div>
        </div>
      </div>

      <div v-if="report" class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-3">
        <div class="flex justify-between items-center pb-3 border-b-2 border-slate-100">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Klasifikasi Bencana</span>
          <span class="text-xs font-black text-slate-900 uppercase tracking-widest">{{ report.disasterType }}</span>
        </div>
        <div class="flex justify-between items-start pt-1">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 mt-0.5">Titik Lokasi</span>
          <span class="text-sm font-black text-slate-900 uppercase text-right leading-tight max-w-[200px]">{{ report.locationText }}</span>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <RefreshCw class="w-3.5 h-3.5 animate-spin-slow" />
        SINKRONISASI SATELIT (10S)
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ArrowLeft, CheckCircle, Truck, Flag, RefreshCw } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, refresh } = await useFetch<Report>(`/api/reports/${route.params.id}`)
useSeoMeta({ title: 'Status Operasi — LaporCepat' })

const timeline = [
  { key: 'PENDING', icon: CheckCircle, borderColor: 'border-yellow-500', iconColor: 'text-yellow-600', title: 'Verifikasi Sistem', desc: 'Validasi AI Selesai' },
  { key: 'VERIFIED', icon: CheckCircle, borderColor: 'border-blue-600', iconColor: 'text-blue-600', title: 'Diterima Komando', desc: 'Triage BPBD' },
  { key: 'DISPATCHED', icon: Truck, borderColor: 'border-red-600', iconColor: 'text-red-600', title: 'TRC Berangkat', desc: 'Menuju Koordinat' },
  { key: 'RESOLVED', icon: Flag, borderColor: 'border-green-600', iconColor: 'text-green-600', title: 'Terkendali', desc: 'Operasi Selesai' },
]

const statusOrder = ['PENDING', 'VERIFIED', 'DISPATCHED', 'RESOLVED']
const isReached = (key: string) => report.value && statusOrder.indexOf(report.value.status) >= statusOrder.indexOf(key)

onMounted(() => {
  const interval = setInterval(refresh, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>
