<template>
  <div class="flex flex-col gap-8">
    <div class="bg-white border-2 border-slate-900 p-6 flex flex-col gap-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
        Sistem Siaga
      </div>
      <h1 class="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight text-slate-900 mt-2">
        Lapor Bencana<br/><span class="text-red-600">Darurat.</span>
      </h1>
      <p class="text-sm font-bold text-slate-600 max-w-lg leading-relaxed border-l-2 border-red-600 pl-3">
        Portal resmi pelaporan warga. LLM AI secara kognitif memproses pesan suara Anda untuk mengekstrak titik koordinat, jumlah korban, dan tingkat ancaman ke layar Tim Reaksi Cepat secara *real-time*.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-50 border-2 border-slate-900 p-5 flex flex-col gap-3">
        <span class="text-2xl font-black text-slate-300 leading-none">01</span>
        <h2 class="font-bold text-sm uppercase tracking-widest text-slate-900">Geospasial</h2>
        <p class="text-xs font-bold text-slate-500">Sensor otomatis menarik titik koordinat GPS presisi tanpa perlu mengetik alamat.</p>
      </div>
      <div class="bg-slate-50 border-2 border-slate-900 p-5 flex flex-col gap-3">
        <span class="text-2xl font-black text-slate-300 leading-none">02</span>
        <h2 class="font-bold text-sm uppercase tracking-widest text-slate-900">Transkripsi Suara</h2>
        <p class="text-xs font-bold text-slate-500">Tekan tombol dan bicara. Sistem mengubah kepanikan verbal menjadi teks terstruktur.</p>
      </div>
      <div class="bg-slate-50 border-2 border-slate-900 p-5 flex flex-col gap-3">
        <span class="text-2xl font-black text-slate-300 leading-none">03</span>
        <h2 class="font-bold text-sm uppercase tracking-widest text-slate-900">Triage AI (LLM)</h2>
        <p class="text-xs font-bold text-slate-500">Mengekstrak jumlah korban, jenis insiden, dan mengkalkulasi prioritas operasi evakuasi.</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mt-2">
      <NuxtLink to="/lapor" class="flex-1 bg-white hover:bg-red-50 border-2 border-slate-900 p-6 flex items-center justify-between transition-colors group">
        <div class="flex flex-col">
          <span class="text-xl font-black uppercase tracking-tight text-slate-900 group-hover:text-red-700">Buat Laporan</span>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Portal Warga</span>
        </div>
        <Mic class="w-8 h-8 text-slate-900 group-hover:text-red-700" />
      </NuxtLink>
      <NuxtLink to="/login" class="flex-1 bg-slate-900 hover:bg-black border-2 border-slate-900 p-6 flex items-center justify-between transition-colors group">
        <div class="flex flex-col">
          <span class="text-xl font-black uppercase tracking-tight text-white">Dashboard TRC</span>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Akses BPBD</span>
        </div>
        <Activity class="w-8 h-8 text-white" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mic, Activity } from 'lucide-vue-next'
</script>
