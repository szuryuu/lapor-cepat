<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex flex-wrap gap-3">
        <div class="bg-white border border-zinc-200 rounded-lg px-4 py-3 flex flex-col shadow-sm min-w-[120px]">
          <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Kritis (Lvl 5)</span>
          <div class="flex items-center gap-2 text-red-600">
            <AlertOctagon class="w-5 h-5" />
            <span class="text-2xl font-bold leading-none">{{ stats.critical }}</span>
          </div>
        </div>
        <div class="bg-white border border-zinc-200 rounded-lg px-4 py-3 flex flex-col shadow-sm min-w-[120px]">
          <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Tinggi (Lvl 4)</span>
          <div class="flex items-center gap-2 text-orange-600">
            <AlertTriangle class="w-5 h-5" />
            <span class="text-2xl font-bold leading-none">{{ stats.high }}</span>
          </div>
        </div>
        <div class="bg-white border border-zinc-200 rounded-lg px-4 py-3 flex flex-col shadow-sm min-w-[120px]">
          <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Antrean Aktif</span>
          <div class="flex items-center gap-2 text-zinc-700">
            <Clock class="w-5 h-5" />
            <span class="text-2xl font-bold leading-none">{{ stats.pending }}</span>
          </div>
        </div>
      </div>

      <div class="bg-zinc-100 p-1 rounded-lg inline-flex">
        <button v-for="f in filterOptions" :key="f.value" @click="filter = f.value" class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors" :class="filter === f.value ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-700'">
          {{ f.label }}
        </button>
      </div>
    </div>

    <div v-if="!reports?.length" class="bg-white border border-zinc-200 rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
      <CheckCircle class="w-12 h-12 text-zinc-300 mb-3" />
      <h3 class="text-lg font-semibold text-zinc-900">Antrean Bersih</h3>
      <p class="text-zinc-500 text-sm mt-1">Tidak ada laporan darurat yang menunggu tindakan.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <DashboardTriageCard v-for="report in reports" :key="report.id" :report="report" @dispatch="dispatchReport" @view="id => navigateTo(`/dashboard/laporan/${id}`)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { AlertOctagon, AlertTriangle, Clock, CheckCircle } from 'lucide-vue-next'
import type { Report } from '~/types/report'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Antrean Operasional — BPBD' })

type FilterStatus = 'PENDING' | 'DISPATCHED' | 'ALL'
const filter = ref<FilterStatus>('PENDING')

const filterOptions: { label: string, value: FilterStatus }[] = [
  { label: 'Menunggu', value: 'PENDING' },
  { label: 'Diproses', value: 'DISPATCHED' },
  { label: 'Semua', value: 'ALL' }
]

const queryParams = computed(() => filter.value === 'ALL' ? {} : { status: filter.value })
const { data: reports, refresh } = await useFetch<Report[]>('/api/reports', { query: queryParams })

const stats = computed(() => ({
  critical: reports.value?.filter(r => r.priority === 'CRITICAL').length ?? 0,
  high: reports.value?.filter(r => r.priority === 'HIGH').length ?? 0,
  pending: reports.value?.filter(r => r.status === 'PENDING').length ?? 0,
}))

async function dispatchReport(id: string) {
  await $fetch(`/api/reports/${id}`, { method: 'PATCH', body: { status: 'DISPATCHED' } })
  await refresh()
}

onMounted(() => {
  const interval = setInterval(refresh, 5000)
  onUnmounted(() => clearInterval(interval))
})
</script>
