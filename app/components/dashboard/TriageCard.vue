<template>
  <div class="bg-white border-2 border-slate-900 flex flex-col">
    <div class="flex justify-between items-center p-3 border-b-2 border-slate-900" :class="headerColor">
      <SharedPriorityBadge :priority="report.priority" />
      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-900">{{ timeAgo }} | ID:{{ report.id.split('-')[0] }}</span>
    </div>
    <div class="p-5 flex flex-col gap-3">
      <h3 class="font-black text-slate-900 text-lg uppercase leading-tight flex items-start gap-2">
        <MapPin class="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
        {{ report.locationText }}
      </h3>
      <p class="text-sm font-bold text-slate-600 mt-2 bg-slate-50 p-3 border-2 border-slate-200">
        {{ report.summaryBahasa }}
      </p>
      <div class="flex items-center justify-between mt-2 pt-3 border-t-2 border-slate-100">
        <div v-if="report.victimCountEstimated" class="flex items-center gap-1.5 text-red-700 font-bold text-xs uppercase tracking-widest">
          <Users class="w-4 h-4" /> {{ report.victimCountEstimated }} KORBAN
        </div>
        <div v-else class="text-xs font-bold text-slate-400 uppercase tracking-widest">0 Korban</div>
        <span class="text-xs font-black uppercase tracking-widest text-slate-900">{{ report.disasterType }}</span>
      </div>
    </div>
    <div class="flex border-t-2 border-slate-900 bg-slate-50">
      <button v-if="report.status === 'PENDING'" @click="emit('dispatch', report.id)" class="flex-1 bg-slate-900 hover:bg-black text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors">
        Tugaskan Tim
      </button>
      <button @click="emit('view', report.id)" class="px-6 py-3 text-slate-900 hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-colors" :class="{ 'flex-1': report.status !== 'PENDING', 'border-l-2 border-slate-900': report.status === 'PENDING' }">
        Detail
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Users } from 'lucide-vue-next'
import type { Report } from '~/types/report'

const props = defineProps<{ report: Report }>()
const emit = defineEmits<{ dispatch: [id: string], view: [id: string] }>()

const headerColor = computed(() => {
  const map: Record<string, string> = { CRITICAL: 'bg-red-100', HIGH: 'bg-orange-100', MEDIUM: 'bg-yellow-100', LOW: 'bg-green-100' }
  return map[props.report.priority] || 'bg-slate-100'
})

const timeAgo = computed(() => {
  const diffMs = Date.now() - new Date(props.report.timestamp).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'NOW'
  if (mins < 60) return `${mins}M`
  return `${Math.floor(mins / 60)}H`
})
</script>
