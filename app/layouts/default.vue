<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col selection:bg-red-200">
    <header class="bg-white border-b-2 border-slate-900 sticky top-0 z-50">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="bg-red-600 p-1.5 border-2 border-slate-900">
            <ShieldAlert class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-black tracking-tighter uppercase text-slate-900">BPBD<span class="text-red-600">.</span>PORTAL</span>
        </NuxtLink>
        <NuxtLink to="/login" class="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black px-2 py-1">
          Akses Petugas
        </NuxtLink>
      </div>
    </header>
    <main class="max-w-3xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next'
</script>
