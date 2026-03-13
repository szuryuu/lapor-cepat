<template>
  <div class="flex flex-col gap-6">
    <div class="bg-white border-2 border-slate-900 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <MapPin class="w-6 h-6 text-red-600" />
        <h1 class="text-2xl font-black uppercase tracking-tight text-slate-900">Peta Spasial</h1>
      </div>
      <div class="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2">
        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        {{ activeReports.length }} LAPORAN AKTIF
      </div>
    </div>

    <div class="h-[60vh] min-h-[500px] border-2 border-slate-900 bg-slate-200 relative z-0 flex flex-col">
      <ClientOnly>
        <MapView :reports="activeReports" class="flex-1" />
        <template #fallback>
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
            <Loader2 class="w-10 h-10 animate-spin text-slate-900 mb-4" />
            <p class="font-bold text-xs uppercase tracking-widest text-slate-500">Mengunduh Data Satelit...</p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="bg-white border-2 border-slate-900 p-5 flex flex-wrap gap-6 items-center justify-center">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
        <div class="w-4 h-4 border-2 border-slate-900" :class="item.colorClass"></div>
        <span class="font-bold text-xs uppercase tracking-widest text-slate-700">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { MapPin, Loader2 } from 'lucide-vue-next'
import type { Report } from '~/types/report'
import MapView from '~/components/dashboard/MapView.client.vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Peta Spasial — BPBD' })

const { data: allReports, refresh } = await useFetch<Report[]>('/api/reports', { query: { status: 'ALL' } })

const activeReports = computed(() => {
  if (!allReports.value) return []
  return allReports.value.filter(r => r.status === 'PENDING' || r.status === 'DISPATCHED')
})

const legendItems = [
  { colorClass: 'bg-red-600', label: 'Kritis' },
  { colorClass: 'bg-orange-500', label: 'Tinggi' },
  { colorClass: 'bg-yellow-400', label: 'Sedang' },
  { colorClass: 'bg-green-500', label: 'Rendah' },
]

onMounted(() => {
  const interval = setInterval(refresh, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>
