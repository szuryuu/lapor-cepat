<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div class="flex items-center gap-3">
        <MapPin class="w-6 h-6 text-red-500" />
        <h1 class="text-2xl font-black uppercase">Peta Bencana</h1>
      </div>
      <div class="px-3 py-1 bg-black text-white font-mono font-bold text-sm">
        {{ reports?.length ?? 0 }} LAPORAN AKTIF
      </div>
    </div>

    <div class="h-[60vh] min-h-[500px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-200 relative z-0">
      <ClientOnly>
        <DashboardMapView :reports="reports ?? []" />
        <template #fallback>
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#f4f4f0]">
            <Loader2 class="w-12 h-12 animate-spin mb-4" />
            <p class="font-mono font-bold uppercase tracking-widest">Inisialisasi Satelit...</p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-6 items-center justify-center">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
        <div class="w-4 h-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :class="item.colorClass"></div>
        <span class="font-bold text-sm uppercase">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { MapPin, Loader2 } from 'lucide-vue-next'
import type { Report } from '~/types/report'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Peta Bencana — BPBD' })

const { data: reports, refresh } = await useFetch<Report[]>('/api/reports', { query: { status: 'PENDING' } })

const legendItems = [
  { colorClass: 'bg-red-500', label: 'Kritis' },
  { colorClass: 'bg-orange-500', label: 'Tinggi' },
  { colorClass: 'bg-yellow-400', label: 'Sedang' },
  { colorClass: 'bg-green-500', label: 'Rendah' },
]

onMounted(() => {
  const interval = setInterval(refresh, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>
