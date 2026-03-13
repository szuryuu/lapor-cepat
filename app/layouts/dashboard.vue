<template>
  <div class="min-h-screen bg-slate-200 text-slate-900 font-sans antialiased flex flex-col">
    <header class="bg-slate-900 border-b-4 border-red-600 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-white p-1">
            <ShieldAlert class="w-5 h-5 text-slate-900" />
          </div>
          <span class="font-black text-lg tracking-widest uppercase text-white">BPBD <span class="text-slate-400">TRC</span></span>
        </div>
        <nav class="flex items-center gap-2">
          <NuxtLink to="/dashboard" exact-active-class="bg-slate-800 text-white border-slate-700" class="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-transparent">
            <List class="w-4 h-4" /> <span class="hidden sm:inline">Antrean</span>
          </NuxtLink>
          <NuxtLink to="/dashboard/peta" exact-active-class="bg-slate-800 text-white border-slate-700" class="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-transparent">
            <MapIcon class="w-4 h-4" /> <span class="hidden sm:inline">Peta</span>
          </NuxtLink>
          <button @click="logout" class="ml-2 sm:ml-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, List, Map as MapIcon } from 'lucide-vue-next'

const authCookie = useCookie('bpbd_auth')

if (authCookie.value !== 'true') {
  if (import.meta.client) {
    navigateTo('/login')
  }
}

function logout() {
  authCookie.value = null
  navigateTo('/login')
}
</script>
