<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex items-center gap-4 px-6 py-4 border-b-4 border-black bg-white sticky top-0 z-10 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <NuxtLink to="/" class="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
        <ArrowLeft class="w-6 h-6" />
      </NuxtLink>
      <span class="font-black text-xl uppercase tracking-tighter">Status Laporan</span>
    </header>

    <div class="flex-1 px-4 py-10 max-w-lg mx-auto w-full">
      <div v-if="report" class="flex flex-col gap-8">
        
        <div class="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div class="flex flex-col gap-8 relative">
            <div class="absolute left-6 top-2 bottom-2 w-1 bg-black"></div>
            
            <div v-for="(item, index) in timeline" :key="item.key" class="flex items-center gap-6 relative z-10">
              <div class="w-12 h-12 shrink-0 border-4 border-black rounded-full flex items-center justify-center transition-colors duration-500" :class="isReached(item.key) ? item.bgColor : 'bg-white'">
                <component :is="item.icon" class="w-6 h-6" :class="isReached(item.key) ? 'text-white' : 'text-gray-300'" />
              </div>
              <div class="flex flex-col">
                <span class="font-black uppercase tracking-widest text-lg" :class="isReached(item.key) ? 'text-black' : 'text-gray-400'">{{ item.title }}</span>
                <span class="font-mono font-bold text-xs" :class="isReached(item.key) ? 'text-gray-600' : 'text-gray-300'">{{ item.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-yellow-300 border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center border-b-2 border-black pb-2">
              <span class="font-bold text-xs uppercase text-black/70">ID Unik</span>
              <span class="font-mono font-black text-sm">{{ report.id.split('-')[0] }}</span>
            </div>
            <div class="flex justify-between items-center border-b-2 border-black pb-2">
              <span class="font-bold text-xs uppercase text-black/70">Tipe Bencana</span>
              <span class="font-black uppercase">{{ report.disasterType }}</span>
            </div>
            <div class="flex justify-between items-start pt-1">
              <span class="font-bold text-xs uppercase text-black/70 shrink-0">Lokasi</span>
              <span class="font-black uppercase text-right leading-tight max-w-[200px]">{{ report.locationText }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 font-mono text-xs font-bold text-gray-500">
          <RefreshCw class="w-4 h-4 animate-spin-slow" />
          <span>Auto-sync aktif (10s)</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ArrowLeft, CheckCircle, Truck, Flag, RefreshCw } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, refresh } = await useFetch<Report>(`/api/reports/${route.params.id}`)

useSeoMeta({ title: 'Lacak Status — BPBD' })

const timeline = [
  { key: 'PENDING', icon: CheckCircle, bgColor: 'bg-yellow-500', title: 'Terverifikasi AI', desc: 'Laporan masuk antrean TRC' },
  { key: 'VERIFIED', icon: CheckCircle, bgColor: 'bg-blue-500', title: 'Diterima Komandan', desc: 'TRC menganalisis prioritas' },
  { key: 'DISPATCHED', icon: Truck, bgColor: 'bg-red-500', title: 'TRC Berangkat', desc: 'Bantuan menuju lokasi Anda' },
  { key: 'RESOLVED', icon: Flag, bgColor: 'bg-green-500', title: 'Selesai', desc: 'Situasi terkendali' },
]

const statusOrder = ['PENDING', 'VERIFIED', 'DISPATCHED', 'RESOLVED']

function isReached(key: string) {
  if (!report.value) return false
  return statusOrder.indexOf(report.value.status) >= statusOrder.indexOf(key)
}

onMounted(() => {
  const interval = setInterval(refresh, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>
