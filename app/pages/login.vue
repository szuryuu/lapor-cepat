<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white border-2 border-slate-900 flex flex-col shadow-lg shadow-slate-200">
      <div class="p-6 border-b-2 border-slate-900 flex items-center gap-3 bg-slate-50">
        <ShieldAlert class="w-6 h-6 text-red-600" />
        <h1 class="text-xl font-black uppercase tracking-tight text-slate-900">Otentikasi Petugas</h1>
      </div>
      
      <div class="p-8 flex flex-col gap-6">
        <p class="text-sm font-bold text-slate-600 leading-relaxed">
          Area ini terbatas untuk operator Pusat Komando BPBD. Masukkan PIN akses untuk melanjutkan.
        </p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="pin" class="text-xs font-bold uppercase tracking-widest text-slate-900">Security PIN</label>
            <input 
              id="pin"
              v-model="pin"
              type="password"
              placeholder="••••••"
              class="w-full border-2 border-slate-300 focus:border-slate-900 p-4 text-center text-xl font-mono tracking-widest outline-none transition-colors"
              required
              autofocus
            />
          </div>

          <div v-if="errorMsg" class="bg-red-50 text-red-600 text-xs font-bold p-3 border-2 border-red-200">
            {{ errorMsg }}
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-4 font-bold text-sm uppercase tracking-widest transition-colors mt-2 disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <span v-else>Verifikasi Akses</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShieldAlert, Loader2 } from 'lucide-vue-next'

useSeoMeta({ title: 'Otentikasi BPBD — LaporCepat' })

const pin = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!pin.value) return
  
  isLoading.value = true
  errorMsg.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { pin: pin.value }
    })
    
    navigateTo('/dashboard')
  } catch (e: any) {
    errorMsg.value = 'PIN tidak valid. Akses ditolak.'
    pin.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>
