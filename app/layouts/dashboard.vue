<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b-2 border-black px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🚨</span>
        <span class="font-bold text-lg tracking-tight">LAPOR CEPAT — BPBD</span>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/dashboard">
          <PUButton flavor="ghost" size="small">Antrian</PUButton>
        </NuxtLink>
        <NuxtLink to="/dashboard/peta">
          <PUButton flavor="ghost" size="small">Peta</PUButton>
        </NuxtLink>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
