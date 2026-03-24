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
      <div
        v-if="isPending"
        class="absolute inset-0 z-10 bg-slate-50 flex flex-col items-center justify-center gap-4"
      >
        <Loader2 class="w-10 h-10 animate-spin text-slate-900" />
        <p class="font-bold text-xs uppercase tracking-widest text-slate-500">Memuat Data Laporan...</p>
      </div>

      <ClientOnly>
        <MapView :reports="activeReports" class="flex-1" />
        <template #fallback>
          <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
            <Loader2 class="w-10 h-10 animate-spin text-slate-900 mb-4" />
            <p class="font-bold text-xs uppercase tracking-widest text-slate-500">Memuat Peta...</p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="bg-white border-2 border-slate-900 p-5 flex flex-wrap gap-6 items-center justify-center">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
        <div
          class="w-4 h-4 rounded-full border-2 border-slate-900"
          :class="item.colorClass"
          :style="item.dashed ? 'border-style: dashed;' : ''"
        ></div>
        <span class="font-bold text-xs uppercase tracking-widest text-slate-700">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { MapPin, Loader2 } from 'lucide-vue-next'
import type { Report } from '~/types/report'
import MapView from '~/components/dashboard/MapView.client.vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Peta Spasial — BPBD' })

const isPending = ref(true)
const { data: allReports, refresh } = await useFetch<Report[]>('/api/reports', {
  query: { status: 'ALL' },
  onResponse() { isPending.value = false },
  onResponseError() { isPending.value = false }
})

const activeReports = computed(() => {
  if (!allReports.value) return []
  return allReports.value.filter(r => r.status === 'PENDING' || r.status === 'DISPATCHED')
})

const legendItems = [
  { colorClass: 'bg-red-600',    label: 'Kritis (Lvl 5)',   dashed: false },
  { colorClass: 'bg-orange-500', label: 'Tinggi (Lvl 4)',   dashed: false },
  { colorClass: 'bg-blue-500',   label: 'Menengah (Lvl 3)', dashed: false },
  { colorClass: 'bg-slate-400',  label: 'Menunggu TRC',     dashed: true  },
]

onMounted(() => {
  const interval = setInterval(refresh, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>
