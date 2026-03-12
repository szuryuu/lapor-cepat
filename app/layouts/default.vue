<template>
  <div class="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-yellow-300 flex flex-col">
    <header class="border-b-4 border-black bg-white sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-red-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
            <Radio class="w-5 h-5 text-white" />
          </div>
          <span class="text-2xl font-black tracking-tighter uppercase">LaporCepat<span class="text-red-500">.</span></span>
        </NuxtLink>
        
        <NuxtLink to="/dashboard" class="hidden md:flex items-center gap-2 px-5 py-2 bg-yellow-400 border-2 border-black font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
          <LayoutDashboard class="w-4 h-4" />
          Dashboard TRC
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-4xl mx-auto w-full px-4 py-8 md:py-16 flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Radio, LayoutDashboard } from 'lucide-vue-next'
</script>
