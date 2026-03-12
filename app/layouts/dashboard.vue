<template>
  <div v-if="isAuthenticated" class="min-h-screen bg-slate-200 text-slate-900 font-sans antialiased flex flex-col">
    <header class="bg-slate-900 border-b-4 border-red-600 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-white p-1">
            <ShieldAlert class="w-5 h-5 text-slate-900" />
          </div>
          <span class="font-black text-lg tracking-widest uppercase text-white">BPBD <span class="text-slate-400">TRC</span></span>
        </div>
        <div class="flex items-center gap-4">
          <nav class="flex items-center gap-2">
            <NuxtLink to="/dashboard" exact-active-class="bg-slate-800 text-white border-slate-700" class="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-transparent">
              <List class="w-4 h-4" /> <span class="hidden sm:inline">Antrean</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/peta" exact-active-class="bg-slate-800 text-white border-slate-700" class="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-transparent">
              <Map class="w-4 h-4" /> <span class="hidden sm:inline">Peta</span>
            </NuxtLink>
          </nav>
          <button @click="logout" class="ml-2 bg-red-600 hover:bg-red-700 text-white p-2 transition-colors border-2 border-transparent hover:border-red-400" title="Keluar">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShieldAlert, List, Map, LogOut } from 'lucide-vue-next'

const isAuthenticated = ref(false)

onMounted(() => {
  if (import.meta.client) {
    const auth = localStorage.getItem('bpbd_auth')
    if (auth === 'true') {
      isAuthenticated.value = true
    } else {
      navigateTo('/login')
    }
  }
})

function logout() {
  if (import.meta.client) {
    localStorage.removeItem('bpbd_auth')
    navigateTo('/login')
  }
}
</script>
