<template>
  <div class="min-h-screen bg-slate-100 flex flex-col md:flex-row">
    <aside class="w-full md:w-64 bg-slate-900 text-white flex flex-col border-r-4 border-slate-900 shrink-0 md:h-screen sticky top-0">
      <div class="p-6 border-b-2 border-slate-800 flex items-center gap-3">
        <ShieldAlert class="w-8 h-8 text-red-500" />
        <div class="flex flex-col">
          <span class="text-lg font-black uppercase tracking-widest leading-none">BPBD</span>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pusat Komando</span>
        </div>
      </div>
      <nav class="flex-1 p-4 flex flex-col gap-2">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 p-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors" exact-active-class="bg-red-600 text-white hover:bg-red-600 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Activity class="w-4 h-4 shrink-0" />
          <span>Antrean</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/peta" class="flex items-center gap-3 p-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors" exact-active-class="bg-red-600 text-white hover:bg-red-600 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <MapPin class="w-4 h-4 shrink-0" />
          <span>Peta Radar</span>
        </NuxtLink>
      </nav>
      <div class="p-4 border-t-2 border-slate-800">
        <button @click="logout" class="w-full flex items-center justify-center gap-2 p-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <LogOut class="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
    <main class="flex-1 p-4 md:p-8 h-full min-h-screen overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, Activity, MapPin, LogOut } from 'lucide-vue-next'

const authCookie = useCookie('bpbd_auth')

if (authCookie.value !== 'authenticated') {
  navigateTo('/login')
}

function logout() {
  authCookie.value = null
  navigateTo('/login')
}
</script>
