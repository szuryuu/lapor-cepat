<template>
  <div class="bg-white border-2 border-slate-900 flex flex-col hover:border-red-600 transition-colors group">
    <div class="flex justify-between items-center p-3 border-b-2 border-slate-900" :class="headerColor">
      <SharedPriorityBadge :priority="report.priority" />
      <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">{{ timeAgo }} | ID:{{ report.id.split('-')[0] }}</span>
    </div>
    
    <div class="p-5 flex flex-col gap-4">
      <h3 class="font-black text-slate-900 text-lg uppercase leading-tight flex items-start gap-2 h-[44px] overflow-hidden line-clamp-2" :title="report.locationText">
        <MapPin class="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
        {{ report.locationText }}
      </h3>
      
      <div class="bg-slate-50 border-2 border-slate-200 p-3 h-[64px]">
        <p class="text-xs font-bold text-slate-700 uppercase leading-relaxed line-clamp-2" :title="report.summaryBahasa">
          "{{ report.summaryBahasa }}"
        </p>
      </div>

      <div class="flex items-center justify-between pt-1">
        <div v-if="report.victimCountEstimated" class="flex items-center gap-1.5 text-red-700 font-bold text-[10px] uppercase tracking-widest">
          <Users class="w-4 h-4" /> {{ report.victimCountEstimated }} Korban
        </div>
        <div v-else class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Users class="w-4 h-4" /> Nihil
        </div>
        <span class="text-[10px] font-black uppercase tracking-widest text-slate-900">{{ report.disasterType }}</span>
      </div>
    </div>

    <div class="flex border-t-2 border-slate-900 bg-slate-50 mt-auto">
      <button 
        v-if="report.status === 'PENDING'" 
        @click="emit('dispatch', report.id)" 
        class="flex-1 bg-slate-900 hover:bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest transition-colors"
      >
        Tugaskan Tim
      </button>
      <button 
        @click="emit('view', report.id)" 
        class="py-4 text-slate-900 hover:bg-slate-200 text-[10px] font-bold uppercase tracking-widest transition-colors" 
        :class="{ 'flex-1': report.status !== 'PENDING', 'px-6 border-l-2 border-slate-900': report.status === 'PENDING' }"
      >
        Lihat Detail
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
