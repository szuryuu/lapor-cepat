<template>
  <div class="flex flex-col gap-10 md:gap-12">
    <section class="flex flex-col items-start md:items-center md:text-center gap-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-300 border-2 border-black font-mono text-xs md:text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
        <Siren class="w-4 h-4" />
        <span>SISTEM TRIAGE BENCANA AI</span>
      </div>
      
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[1.1] tracking-tight">
        Lapor Darurat <br />
        <span class="bg-black text-white px-4 pb-2 pt-1 inline-block mt-2 rotate-[1deg]">Tanpa Ngetik.</span>
      </h1>
      
      <p class="text-lg md:text-xl font-medium max-w-2xl border-l-4 border-red-500 pl-4 text-left mt-2">
        Tekan tombol, bicara, dan sistem AI kami otomatis menerjemahkan kepanikan Anda menjadi data prioritas akurat untuk Tim BPBD.
      </p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border-4 border-black p-5 flex items-start gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div class="w-12 h-12 shrink-0 bg-black text-white font-black text-2xl flex items-center justify-center">1</div>
        <div class="flex-1">
          <h3 class="font-black uppercase text-lg leading-tight mb-1">Izinkan Lokasi</h3>
          <p class="text-sm font-bold text-gray-600 leading-snug">Berikan akses GPS saat diminta oleh browser.</p>
        </div>
      </div>
      <div class="bg-yellow-300 border-4 border-black p-5 flex items-start gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div class="w-12 h-12 shrink-0 bg-red-500 text-white border-2 border-black font-black text-2xl flex items-center justify-center">2</div>
        <div class="flex-1">
          <h3 class="font-black uppercase text-lg leading-tight mb-1">Tahan & Bicara</h3>
          <p class="text-sm font-bold text-gray-800 leading-snug">Sebutkan patokan alamat & jumlah korban.</p>
        </div>
      </div>
      <div class="bg-white border-4 border-black p-5 flex items-start gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div class="w-12 h-12 shrink-0 bg-green-500 text-black border-2 border-black font-black text-2xl flex items-center justify-center">3</div>
        <div class="flex-1">
          <h3 class="font-black uppercase text-lg leading-tight mb-1">Bantuan Jalan</h3>
          <p class="text-sm font-bold text-gray-600 leading-snug">AI mengirim prioritas ke BPBD seketika.</p>
        </div>
      </div>
    </section>

    <section class="flex flex-col md:flex-row gap-6 md:gap-8">
      <NuxtLink to="/lapor" class="flex-1 flex flex-col items-center justify-center gap-4 p-8 md:p-12 bg-red-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group cursor-pointer">
        <Mic class="w-16 h-16 md:w-20 md:h-20 group-hover:scale-110 transition-transform" />
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-black uppercase mb-1">Buat Laporan</h2>
          <p class="font-mono text-sm font-bold opacity-90 tracking-widest">WARGA DARURAT</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/dashboard" class="flex-1 flex flex-col items-center justify-center gap-4 p-8 md:p-12 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group cursor-pointer">
        <Activity class="w-16 h-16 md:w-20 md:h-20 text-black group-hover:scale-110 transition-transform" />
        <div class="text-center">
          <h2 class="text-3xl md:text-4xl font-black uppercase mb-1">TRC BPBD</h2>
          <p class="font-mono text-sm font-bold text-gray-500 tracking-widest">MONITOR ANTREAN</p>
        </div>
      </NuxtLink>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t-4 border-black">
      <div class="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <MapPin class="w-8 h-8 text-blue-500 mb-4" />
        <h3 class="text-xl font-black uppercase mb-2">Auto GPS</h3>
        <p class="text-sm font-medium text-gray-700">Sistem menarik koordinat akurat di latar belakang tanpa mengisi form alamat manual.</p>
      </div>
      <div class="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <BrainCircuit class="w-8 h-8 text-purple-500 mb-4" />
        <h3 class="text-xl font-black uppercase mb-2">AI Extraction</h3>
        <p class="text-sm font-medium text-gray-700">Mengubah ucapan tidak terstruktur menjadi tingkat prioritas evakuasi (Level 1-5).</p>
      </div>
      <div class="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Zap class="w-8 h-8 text-yellow-500 mb-4" />
        <h3 class="text-xl font-black uppercase mb-2">Real-Time</h3>
        <p class="text-sm font-medium text-gray-700">Data terdistribusi seketika ke dashboard komando tanpa perlu me-refresh halaman.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Siren, Mic, Activity, MapPin, BrainCircuit, Zap } from 'lucide-vue-next'
</script>
