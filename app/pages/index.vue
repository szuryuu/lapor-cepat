<template>
  <div class="flex flex-col gap-8">

    <div class="bg-white border-2 border-slate-900 p-6 flex flex-col gap-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
        Sistem Siaga Aktif
      </div>
      <div class="flex items-center gap-2 mt-2">
        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Triage Online</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight text-slate-900">
        Lapor Bencana<br/><span class="text-red-600">Dalam Detik.</span>
      </h1>
      <p class="text-sm font-bold text-slate-600 max-w-lg leading-relaxed border-l-4 border-red-600 pl-3">
        Bicara — AI kami mengekstrak lokasi, korban, dan tingkat ancaman secara otomatis, lalu mengirimkannya langsung ke layar Tim Reaksi Cepat BPBD secara real-time.
      </p>
      <div class="flex flex-wrap gap-3 pt-2 border-t-2 border-slate-100">
        <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div> Whisper AI — Transkripsi Suara
        </div>
        <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div> Gemini 2.5 — Triage Otomatis
        </div>
        <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <div class="w-2 h-2 bg-orange-500 rounded-full"></div> Firestore — Realtime Dashboard
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-red-600 border-2 border-slate-900 p-4 flex flex-col gap-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <span class="text-3xl font-black text-white leading-none">#2</span>
        <span class="text-[10px] font-bold text-red-100 uppercase tracking-widest leading-snug">Negara paling rawan bencana di dunia</span>
      </div>
      <div class="bg-slate-900 border-2 border-slate-900 p-4 flex flex-col gap-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.3)]">
        <span class="text-3xl font-black text-white leading-none">43.5%</span>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-snug">Skor kerentanan bencana Indonesia</span>
      </div>
      <div class="bg-white border-2 border-slate-900 p-4 flex flex-col gap-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <span class="text-3xl font-black text-slate-900 leading-none">&lt;30s</span>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-snug">Dari suara ke dashboard operator</span>
      </div>
      <div class="bg-white border-2 border-slate-900 p-4 flex flex-col gap-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <span class="text-3xl font-black text-slate-900 leading-none">4</span>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-snug">Level prioritas triage otomatis AI</span>
      </div>
    </div>

    <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-4">
      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b-2 border-slate-100 pb-3">Bagaimana AI Bekerja</span>
      <div class="flex flex-col md:flex-row gap-2 items-stretch">
        <div class="flex-1 bg-slate-50 border-2 border-slate-200 p-4 flex flex-col gap-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">01 INPUT</span>
          <span class="font-black text-sm text-slate-900 uppercase">Suara / Teks + GPS</span>
          <span class="text-[10px] font-bold text-slate-500 leading-relaxed">Warga bicara atau mengetik situasi darurat. GPS menarik koordinat presisi otomatis.</span>
        </div>
        <div class="hidden md:flex items-center text-slate-300 font-black text-xl px-1">→</div>
        <div class="flex-1 bg-slate-50 border-2 border-slate-200 p-4 flex flex-col gap-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">02 PROSES</span>
          <span class="font-black text-sm text-slate-900 uppercase">Whisper → Gemini</span>
          <span class="text-[10px] font-bold text-slate-500 leading-relaxed">Suara ditranskripsi, lalu LLM mengekstrak jenis bencana, korban, dan skor urgensi.</span>
        </div>
        <div class="hidden md:flex items-center text-slate-300 font-black text-xl px-1">→</div>
        <div class="flex-1 bg-red-50 border-2 border-red-200 p-4 flex flex-col gap-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-red-400">03 OUTPUT</span>
          <span class="font-black text-sm text-slate-900 uppercase">Dashboard TRC</span>
          <span class="text-[10px] font-bold text-slate-500 leading-relaxed">Laporan terstruktur muncul di layar operator BPBD secara real-time dengan level prioritas.</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4">
      <NuxtLink to="/lapor" class="flex-1 bg-red-600 hover:bg-red-700 border-2 border-slate-900 p-6 flex items-center justify-between transition-colors group shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        <div class="flex flex-col">
          <span class="text-xl font-black uppercase tracking-tight text-white">Buat Laporan</span>
          <span class="text-xs font-bold text-red-200 uppercase tracking-widest mt-1">Portal Warga — Gratis & Anonim</span>
        </div>
        <Mic class="w-8 h-8 text-white" />
      </NuxtLink>
      <NuxtLink to="/login" class="flex-1 bg-slate-900 hover:bg-black border-2 border-slate-900 p-6 flex items-center justify-between transition-colors group shadow-[4px_4px_0px_0px_rgba(15,23,42,0.3)]">
        <div class="flex flex-col">
          <span class="text-xl font-black uppercase tracking-tight text-white">Dashboard TRC</span>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Akses Operator BPBD</span>
        </div>
        <Activity class="w-8 h-8 text-white" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-3">
        <div class="bg-slate-900 w-8 h-8 flex items-center justify-center border-2 border-slate-900">
          <MapPin class="w-4 h-4 text-white" />
        </div>
        <h2 class="font-black text-sm uppercase tracking-widest text-slate-900">Geospasial Presisi</h2>
        <p class="text-xs font-bold text-slate-500 leading-relaxed">GPS browser dengan fallback IP geolocation. Koordinat real dikirim ke peta operator secara otomatis.</p>
      </div>
      <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-3">
        <div class="bg-red-600 w-8 h-8 flex items-center justify-center border-2 border-slate-900">
          <Mic class="w-4 h-4 text-white" />
        </div>
        <h2 class="font-black text-sm uppercase tracking-widest text-slate-900">Voice-First</h2>
        <p class="text-xs font-bold text-slate-500 leading-relaxed">Dirancang untuk kondisi panik. Warga cukup bicara — tidak perlu mengetik atau mengisi form apapun.</p>
      </div>
      <div class="bg-white border-2 border-slate-900 p-5 flex flex-col gap-3">
        <div class="bg-orange-500 w-8 h-8 flex items-center justify-center border-2 border-slate-900">
          <ShieldAlert class="w-4 h-4 text-white" />
        </div>
        <h2 class="font-black text-sm uppercase tracking-widest text-slate-900">Anti-Hoax AI</h2>
        <p class="text-xs font-bold text-slate-500 leading-relaxed">Gemini mendeteksi laporan palsu atau anomali secara otomatis sebelum laporan masuk ke antrean operator.</p>
      </div>
    </div>

    <form @submit.prevent="trackReport" class="flex flex-col md:flex-row gap-2 border-2 border-slate-900 bg-white p-4 items-end">
      <div class="flex flex-col flex-1 w-full gap-2">
        <label for="trackId" class="text-xs font-bold uppercase tracking-widest text-slate-900">Lacak Status Evakuasi</label>
        <input
          id="trackId"
          v-model="trackId"
          type="text"
          placeholder="Masukkan ID Laporan..."
          class="w-full border-2 border-slate-300 focus:border-slate-900 p-3 text-sm font-mono tracking-widest outline-none transition-colors"
          required
        />
      </div>
      <button type="submit" class="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center h-[52px]">
        <Search class="w-4 h-4 mr-2" /> Lacak
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mic, Activity, Search, MapPin, ShieldAlert } from 'lucide-vue-next'

useSeoMeta({
  title: 'LaporCepat — Sistem Pelaporan Darurat Bencana Berbasis AI',
  description: 'Portal pelaporan bencana warga dengan AI triage otomatis. Bicara — AI mengekstrak lokasi, korban, dan prioritas secara real-time ke dashboard BPBD.'
})

const trackId = ref('')

function trackReport() {
  if (trackId.value.trim()) {
    navigateTo(`/status/${trackId.value.trim()}`)
  }
}
</script>
