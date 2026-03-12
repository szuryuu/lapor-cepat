<script setup lang="ts">
import type { Report } from '~/types/report'

const route = useRoute()
const { data: report, pending } = await useFetch<Report>(`/api/reports/${route.params.id}`)

useSeoMeta({ title: 'Laporan Diterima — Lapor Cepat' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8">
    <div v-if="pending" class="flex flex-col items-center gap-4">
      <PULoading />
      <p class="text-gray-500 text-sm">Memuat konfirmasi...</p>
    </div>

    <div v-else-if="report" class="w-full max-w-sm flex flex-col gap-4">
      <div class="text-center flex flex-col items-center gap-2">
        <span class="text-7xl">✅</span>
        <h1 class="text-2xl font-black">Laporan Diterima</h1>
        <p class="text-gray-500 text-sm">AI telah menganalisis laporan Anda</p>
      </div>

      <PUCard size="large" class="w-full">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Prioritas</span>
            <SharedPriorityBadge :priority="report.priority" />
          </div>
          <PUDivider />
          <div class="flex justify-between items-start gap-4">
            <span class="text-sm text-gray-500 shrink-0">Lokasi</span>
            <span class="text-sm font-medium text-right">{{ report.locationText }}</span>
          </div>
          <PUDivider />
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Bencana</span>
            <span class="text-sm font-medium">{{ report.disasterType }}</span>
          </div>
          <template v-if="report.victimCountEstimated">
            <PUDivider />
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Estimasi Korban</span>
              <span class="text-sm font-medium">{{ report.victimCountEstimated }} orang — {{ report.victimStatus }}</span>
            </div>
          </template>
        </div>
      </PUCard>

      <PUCard size="medium" class="w-full">
        <p class="text-xs text-gray-500 italic leading-relaxed">"{{ report.summaryBahasa }}"</p>
        <p class="text-xs text-gray-400 mt-2 font-mono">ID: {{ report.id }}</p>
      </PUCard>

      <div class="flex flex-col gap-2">
        <NuxtLink :to="`/status/${report.id}`" class="block">
          <PUButton flavor="outlined" size="large" class="w-full">Pantau Status Laporan →</PUButton>
        </NuxtLink>
        <NuxtLink to="/" class="block">
          <PUButton flavor="ghost" class="w-full">Kembali ke Beranda</PUButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
