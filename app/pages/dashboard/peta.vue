<script setup lang="ts">
import type { Report } from '~/types/report'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Peta Bencana — BPBD Dashboard' })

const { data: reports, refresh } = await useFetch<Report[]>('/api/reports', {
  query: { status: 'PENDING' },
})

const legendItems = [
  { color: '#dc2626', label: 'Kritis' },
  { color: '#ea580c', label: 'Tinggi' },
  { color: '#ca8a04', label: 'Sedang' },
  { color: '#16a34a', label: 'Rendah' },
]

onMounted(() => {
  const interval = setInterval(refresh, 10000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold">Peta Laporan Aktif</h1>
      <PUBadge :label="`${reports?.length ?? 0} laporan`" severity="secondary" />
    </div>

    <div class="h-[560px] rounded-xl overflow-hidden border-2 border-black shadow-md">
      <ClientOnly>
        <DashboardMapView :reports="reports ?? []" />
        <template #fallback>
          <div class="flex items-center justify-center h-full bg-gray-100">
            <div class="flex flex-col items-center gap-2 text-gray-400">
              <PULoading />
              <p class="text-sm">Memuat peta...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="flex gap-4 flex-wrap">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2 text-xs">
        <span class="w-3 h-3 rounded-full" :style="{ background: item.color }" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
