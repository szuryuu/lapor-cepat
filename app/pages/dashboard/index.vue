<template>
  <div class="flex flex-col gap-6 p-2 md:p-0">
    <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
      <div class="flex flex-wrap gap-3">
        <div class="bg-white border-2 border-slate-900 px-5 py-4 flex flex-col min-w-[140px]">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Kritis (Lvl 5)</span>
          <div class="flex items-center gap-2 text-red-600">
            <AlertOctagon class="w-6 h-6" />
            <span class="text-3xl font-black leading-none">{{ stats.critical }}</span>
          </div>
        </div>
        <div class="bg-white border-2 border-slate-900 px-5 py-4 flex flex-col min-w-[140px]">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tinggi (Lvl 4)</span>
          <div class="flex items-center gap-2 text-orange-600">
            <AlertTriangle class="w-6 h-6" />
            <span class="text-3xl font-black leading-none">{{ stats.high }}</span>
          </div>
        </div>
        <div class="bg-white border-2 border-slate-900 px-5 py-4 flex flex-col min-w-[140px]">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Menunggu</span>
          <div class="flex items-center gap-2 text-slate-900">
            <Clock class="w-6 h-6" />
            <span class="text-3xl font-black leading-none">{{ stats.pending }}</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-200 p-1 flex border-2 border-slate-900 w-full xl:w-auto overflow-x-auto">
        <button 
          v-for="f in filterOptions" 
          :key="f.value" 
          @click="filter = f.value" 
          class="flex-1 xl:flex-none px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap" 
          :class="filter === f.value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-300'"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div v-if="!filteredReports?.length" class="bg-white border-2 border-slate-900 p-16 text-center flex flex-col items-center shadow-lg shadow-slate-200">
      <CheckCircle class="w-16 h-16 text-slate-300 mb-4" />
      <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Antrean Bersih</h3>
      <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Tidak ada laporan pada sektor ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      <DashboardTriageCard 
        v-for="report in filteredReports" 
        :key="report.id" 
        :report="report" 
        @dispatch="dispatchReport" 
        @view="id => navigateTo(`/dashboard/laporan/${id}`)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { AlertOctagon, AlertTriangle, Clock, CheckCircle } from 'lucide-vue-next'
import type { Report } from '~/types/report'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Antrean Operasional — BPBD' })

type FilterStatus = 'PENDING' | 'DISPATCHED' | 'RESOLVED' | 'ALL'
const filter = ref<FilterStatus>('PENDING')

const filterOptions: { label: string, value: FilterStatus }[] = [
  { label: 'Menunggu', value: 'PENDING' },
  { label: 'Diproses', value: 'DISPATCHED' },
  { label: 'Selesai', value: 'RESOLVED' },
  { label: 'Semua Data', value: 'ALL' }
]

const { data: allReports, refresh } = await useFetch<Report[]>('/api/reports', {
  query: { status: 'ALL' }
})

const filteredReports = computed(() => {
  if (!allReports.value) return []
  if (filter.value === 'ALL') return allReports.value
  return allReports.value.filter(r => r.status === filter.value)
})

const stats = computed(() => {
  const reports = allReports.value || []
  const activeReports = reports.filter(r => r.status !== 'RESOLVED')
  
  return {
    critical: activeReports.filter(r => r.priority === 'CRITICAL').length,
    high: activeReports.filter(r => r.priority === 'HIGH').length,
    pending: reports.filter(r => r.status === 'PENDING').length,
  }
})

async function dispatchReport(id: string) {
  await $fetch(`/api/reports/${id}`, { method: 'PATCH', body: { status: 'DISPATCHED' } })
  await refresh()
}

let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(refresh, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
