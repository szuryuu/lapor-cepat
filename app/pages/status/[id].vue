<script setup lang="ts">
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, refresh } = await useFetch<Report>(`/api/reports/${route.params.id}`)

useSeoMeta({ title: 'Status Laporan — Lapor Cepat' })

const timeline = [
  { key: 'PENDING', icon: '🟡', label: 'Laporan diverifikasi AI' },
  { key: 'VERIFIED', icon: '🔵', label: 'Tim BPBD menerima laporan' },
  { key: 'DISPATCHED', icon: '🟢', label: 'Tim dikirim ke lokasi Anda' },
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

<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex items-center gap-3 px-4 py-4 border-b-2 border-black bg-white">
      <NuxtLink to="/" class="text-xl font-bold px-1">←</NuxtLink>
      <span class="font-bold text-lg">Status Laporan</span>
    </header>

    <div class="flex-1 px-4 py-6 max-w-sm mx-auto w-full">
      <div v-if="report" class="flex flex-col gap-4">
        <PUCard size="large" class="w-full">
          <div class="flex flex-col gap-5">
            <div v-for="item in timeline" :key="item.key" class="flex items-center gap-4">
              <span class="text-2xl leading-none">
                {{ isReached(item.key) ? item.icon : '⚪' }}
              </span>
              <span
                class="text-sm leading-snug"
                :class="isReached(item.key) ? 'font-semibold text-black' : 'text-gray-400'"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
        </PUCard>

        <PUCard size="medium" class="w-full">
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">ID Laporan</span>
              <span class="text-xs font-mono">{{ report.id }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Bencana</span>
              <span class="text-xs font-medium">{{ report.disasterType }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Lokasi</span>
              <span class="text-xs font-medium text-right max-w-40">{{ report.locationText }}</span>
            </div>
          </div>
        </PUCard>

        <p class="text-xs text-center text-gray-400">
          Diperbarui otomatis setiap 10 detik
        </p>
      </div>
    </div>
  </div>
</template>
