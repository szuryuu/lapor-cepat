<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div class="flex flex-wrap gap-3">
        <div class="px-4 py-2 bg-red-500 text-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <AlertOctagon class="w-4 h-4" />
          <span>{{ stats.critical }} KRITIS</span>
        </div>
        <div class="px-4 py-2 bg-orange-500 text-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <AlertTriangle class="w-4 h-4" />
          <span>{{ stats.high }} TINGGI</span>
        </div>
        <div class="px-4 py-2 bg-white text-black border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <Clock class="w-4 h-4" />
          <span>{{ stats.pending }} PENDING</span>
        </div>
      </div>

      <div class="flex gap-2 w-full md:w-auto bg-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <button v-for="f in filterOptions" :key="f.value" @click="filter = f.value" class="flex-1 md:flex-none px-4 py-1.5 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer" :class="filter === f.value ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-200'">
          {{ f.label }}
        </button>
      </div>
    </div>

    <div v-if="!reports?.length" class="flex flex-col items-center justify-center py-24 border-4 border-dashed border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CheckCircle class="w-16 h-16 text-green-500 mb-4" />
      <h2 class="text-2xl font-black uppercase">Antrean Kosong</h2>
      <p class="font-mono font-bold text-gray-500 mt-2">Tidak ada laporan aktif saat ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardTriageCard v-for="report in reports" :key="report.id" :report="report" @dispatch="dispatchReport" @view="id => navigateTo(`/dashboard/laporan/${id}`)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { AlertOctagon, AlertTriangle, Clock, CheckCircle } from 'lucide-vue-next'
import type { Report } from '~/types/report'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Antrean TRC — BPBD' })

type FilterStatus = 'PENDING' | 'DISPATCHED' | 'ALL'
const filter = ref<FilterStatus>('PENDING')

const filterOptions: { label: string, value: FilterStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Jalan', value: 'DISPATCHED' },
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
  await $fetch(`/api/reports/${id}`, {
    method: 'PATCH',
    body: { status: 'DISPATCHED' },
  })
  await refresh()
}

onMounted(() => {
  const interval = setInterval(refresh, 5000)
  onUnmounted(() => clearInterval(interval))
})
</script>
