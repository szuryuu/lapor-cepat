<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard" class="bg-slate-900 hover:bg-black text-white p-2 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <h1 class="text-2xl font-black uppercase tracking-tight text-slate-900">Detail Operasi</h1>
    </div>

    <div v-if="pending" class="bg-white border-2 border-slate-900 p-12 flex flex-col items-center justify-center gap-4">
      <Loader2 class="w-8 h-8 animate-spin text-slate-900" />
      <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Menarik Data Arsip...</span>
    </div>

    <div v-else-if="report" class="bg-white border-2 border-slate-900 flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">

      <div v-if="report.isHoaxSuspected" class="bg-yellow-400 border-b-2 border-slate-900 p-4 flex gap-4">
        <AlertTriangle class="w-8 h-8 text-slate-900 shrink-0" />
        <div class="flex flex-col">
          <span class="font-black text-sm uppercase tracking-widest text-slate-900">Peringatan Integritas Data (Potensi Hoax)</span>
          <span class="font-bold text-xs text-slate-800 mt-1">Sistem AI Triage mendeteksi anomali: "{{ report.hoaxReason }}"</span>
        </div>
      </div>

      <div v-if="report.situationNarrative" class="bg-slate-900 border-b-2 border-slate-900 p-5 flex flex-col gap-2">
        <span class="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
          <Brain class="w-3 h-3" /> Briefing Situasi — Dihasilkan AI
        </span>
        <p class="text-sm font-bold text-slate-100 leading-relaxed">{{ report.situationNarrative }}</p>
      </div>

      <div class="bg-slate-50 border-b-2 border-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">ID Laporan</span>
          <span class="font-mono font-black text-lg text-slate-900">{{ report.id }}</span>
        </div>
        <SharedPriorityBadge :priority="report.priority" class="text-base px-4 py-1" />
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Klasifikasi Insiden</span>
            <span class="text-xl font-black text-slate-900 uppercase">{{ report.disasterType }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Titik Koordinat Geospasial</span>
            <span class="text-base font-bold text-slate-900 uppercase leading-snug">{{ report.locationText }}</span>
            <span v-if="report.lat && report.lng" class="text-xs font-mono font-bold text-slate-400 mt-1">
              LAT: {{ report.lat }} | LNG: {{ report.lng }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Estimasi Korban</span>
            <span class="text-base font-black text-red-600 uppercase">{{ report.victimCountEstimated || 0 }} Orang ({{ report.victimStatus }})</span>
          </div>
          <div v-if="report.reporterPhone" class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Kontak Pelapor</span>
            <div class="flex items-center gap-2">
              <span class="text-base font-black text-slate-900">{{ report.reporterPhone }}</span>
              <a :href="`tel:${report.reporterPhone}`" class="bg-slate-900 text-white p-1.5"><Phone class="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Transkrip Kognitif AI</span>
            <div class="bg-slate-50 border-2 border-slate-200 p-4">
              <p class="text-sm font-bold text-slate-700 leading-relaxed uppercase">"{{ report.summaryBahasa }}"</p>
            </div>
            <div v-if="report.isSilent" class="bg-slate-800 text-white p-3 flex gap-3 text-[10px] font-bold uppercase tracking-widest border-l-4 border-slate-500 mt-1">
              <Keyboard class="w-4 h-4 shrink-0" />
              Laporan Teks (Mode Bisu)
            </div>
          </div>
          <div v-if="report.photoUrl" class="flex flex-col gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Foto Kondisi Lapangan</span>
            <img :src="report.photoUrl" alt="Kondisi Lapangan" class="w-full border-2 border-slate-900 object-cover max-h-64" />
          </div>
        </div>
      </div>

      <div class="bg-slate-100 border-t-2 border-slate-900 p-6 flex flex-col gap-4">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Tindakan Komando</span>
        <div class="flex flex-wrap gap-4">
          <button @click="updateStatus('DISPATCHED')" :disabled="report.status === 'DISPATCHED' || report.status === 'RESOLVED' || isUpdating" class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:bg-slate-300 text-white border-2 border-slate-900 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
            Tugaskan TRC
          </button>
          <button @click="updateStatus('RESOLVED')" :disabled="report.status === 'RESOLVED' || isUpdating" class="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:bg-slate-300 text-white border-2 border-slate-900 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
            Tandai Selesai
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Loader2, AlertTriangle, Phone, Keyboard, Brain } from 'lucide-vue-next'
import type { Report } from '~/types/report'
import SharedPriorityBadge from '~/components/shared/PriorityBadge.vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const isUpdating = ref(false)

const { data: report, pending, refresh } = await useFetch<Report>(`/api/reports/${route.params.id}`)
useSeoMeta({ title: 'Detail Operasi — BPBD' })

async function updateStatus(newStatus: string) {
  isUpdating.value = true
  try {
    await $fetch(`/api/reports/${route.params.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    await refresh()
  } catch (e: any) {
    alert('Gagal memperbarui status')
  } finally {
    isUpdating.value = false
  }
}
</script>
