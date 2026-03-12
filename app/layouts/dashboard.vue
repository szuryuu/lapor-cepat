<template>
  <div class="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-yellow-300">
    <header class="bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <ShieldAlert class="w-5 h-5 text-white" />
        </div>
        <span class="font-black text-xl tracking-tighter uppercase">BPBD <span class="text-red-500">COMMAND</span></span>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/dashboard" exact-active-class="!bg-black !text-white shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]" class="flex items-center gap-2 px-4 py-2 border-2 border-black font-bold text-sm uppercase transition-all bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <List class="w-4 h-4" />
          <span class="hidden md:inline">Antrean</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/peta" exact-active-class="!bg-black !text-white shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]" class="flex items-center gap-2 px-4 py-2 border-2 border-black font-bold text-sm uppercase transition-all bg-white hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Map class="w-4 h-4" />
          <span class="hidden md:inline">Peta</span>
        </NuxtLink>
      </div>
    </header>
    <main class="max-w-6xl mx-auto w-full px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, List, Map } from 'lucide-vue-next'
</script>
