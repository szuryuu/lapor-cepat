<script setup lang="ts">
import type { Report, PriorityLevel } from '~/types/report'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Antrian Triage — BPBD Dashboard' })

type FilterStatus = 'PENDING' | 'DISPATCHED' | 'ALL'
const filter = ref<FilterStatus>('PENDING')

const queryParams = computed(() => filter.value === 'ALL' ? {} : { status: filter.value })

const { data: reports, refresh } = await useFetch<Report[]>('/api/reports', {
  query: queryParams,
})

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

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap gap-2">
      <PUBadge :label="`🔴 ${stats.critical} Kritis`" severity="primary" />
      <PUBadge :label="`🟠 ${stats.high} Tinggi`" severity="secondary" />
      <PUBadge :label="`📋 ${stats.pending} Belum Ditangani`" severity="ghost" />
    </div>

    <div class="flex gap-2">
      <PUButton
        v-for="f in (['PENDING', 'DISPATCHED', 'ALL'] as FilterStatus[])"
        :key="f"
        :flavor="filter === f ? 'normal' : 'outlined'"
        size="small"
        @click="filter = f"
      >
        {{ f === 'PENDING' ? 'Belum Ditangani' : f === 'DISPATCHED' ? 'Ditugaskan' : 'Semua' }}
      </PUButton>
    </div>

    <div v-if="!reports?.length" class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <span class="text-5xl">✅</span>
      <p class="text-sm">Tidak ada laporan aktif</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <DashboardTriageCard
        v-for="report in reports"
        :key="report.id"
        :report="report"
        @dispatch="dispatchReport"
        @view="id => navigateTo(`/dashboard/laporan/${id}`)"
      />
    </div>
  </div>
</template>
