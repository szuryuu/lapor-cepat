<template>
  <div class="bg-white border-4 border-black p-5 flex flex-col gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
    <div class="flex items-start justify-between gap-2 border-b-2 border-black pb-3">
      <div class="flex items-center gap-3 flex-wrap">
        <SharedPriorityBadge :priority="report.priority" />
        <span class="font-mono text-xs font-bold text-gray-500">ID: {{ report.id.split('-')[0] }}</span>
        <span v-if="report.clusterId" class="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold tracking-widest">CLUSTER</span>
      </div>
      <div class="flex items-center gap-1 text-gray-500 font-mono text-xs font-bold bg-gray-100 px-2 py-1 border border-black">
        <History class="w-3 h-3" />
        <span>{{ timeAgo }}</span>
      </div>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-12 h-12 shrink-0 bg-black flex items-center justify-center border-2 border-black text-white">
        <component :is="disasterIcon" class="w-6 h-6" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-black text-lg leading-tight uppercase mb-1">{{ report.locationText }}</p>
        <p class="text-sm font-medium text-gray-700">{{ report.summaryBahasa }}</p>
      </div>
    </div>

    <div v-if="report.victimCountEstimated" class="flex items-center gap-3 bg-red-50 border-2 border-red-500 px-3 py-2 text-red-900">
      <Users class="w-5 h-5 shrink-0" />
      <span class="font-black">{{ report.victimCountEstimated }} Korban</span>
      <span class="font-mono text-xs">{{ report.victimStatus }}</span>
    </div>

    <div v-if="report.rawTranscript" class="bg-[#f4f4f0] border-2 border-black p-3 text-xs font-mono font-bold text-gray-600 relative overflow-hidden">
      <Quote class="w-16 h-16 absolute -top-2 -left-2 text-gray-200 opacity-50" />
      <span class="relative z-10">"{{ truncatedTranscript }}"</span>
    </div>

    <div class="flex gap-3 pt-2">
      <button v-if="report.status === 'PENDING'" @click="emit('dispatch', report.id)" class="flex-1 bg-black text-white border-2 border-black py-2 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer">
        <Send class="w-4 h-4" /> TRC BERANGKAT
      </button>
      <button @click="emit('view', report.id)" class="flex-1 bg-white text-black border-2 border-black py-2 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
        <FileText class="w-4 h-4" /> DETAIL
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Waves, Activity, Mountain, Flame, Wind, AlertTriangle, History, Users, Quote, Send, FileText } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const props = defineProps<{ report: Report }>()
const emit = defineEmits<{ dispatch: [id: string], view: [id: string] }>()

const disasterIcon = computed(() => {
  const map: Record<string, any> = {
    BANJIR: Waves, GEMPA: Activity, LONGSOR: Mountain,
    KEBAKARAN: Flame, ANGIN: Wind, LAINNYA: AlertTriangle,
  }
  return map[props.report.disasterType] || AlertTriangle
})

const timeAgo = computed(() => {
  const diffMs = Date.now() - new Date(props.report.timestamp).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'NOW'
  if (mins < 60) return `${mins}M`
  return `${Math.floor(mins / 60)}H`
})

const truncatedTranscript = computed(() => {
  const t = props.report.rawTranscript
  return t.length > 100 ? t.slice(0, 100) + '...' : t
})
</script>
