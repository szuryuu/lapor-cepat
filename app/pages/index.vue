<script setup lang="ts">
useSeoMeta({
  title: 'Lapor Cepat — Sistem Pelaporan Bencana',
  description: 'Laporkan bencana dengan cepat menggunakan AI',
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12">
    <div class="w-full max-w-sm flex flex-col items-center gap-10">
      <div class="flex flex-col items-center gap-3 text-center">
        <span class="text-7xl">🚨</span>
        <h1 class="text-4xl font-black tracking-tight">LAPOR CEPAT</h1>
        <p class="text-gray-500 text-sm leading-relaxed">
          Sistem pelaporan bencana cerdas<br />berbasis AI untuk BPBD Indonesia
        </p>
      </div>

      <div class="flex flex-col gap-3 w-full">
        <NuxtLink to="/lapor" class="block">
          <PUButton size="large" class="w-full">🆘 &nbsp; Laporkan Bencana</PUButton>
        </NuxtLink>
        <NuxtLink to="/dashboard" class="block">
          <PUButton flavor="outlined" size="large" class="w-full">📋 &nbsp; Dashboard BPBD</PUButton>
        </NuxtLink>
      </div>

      <p class="text-xs text-gray-400 text-center leading-relaxed">
        Laporan diproses AI dalam &lt;5 detik<br />dan langsung masuk antrian petugas
      </p>
    </div>
  </div>
</template>
