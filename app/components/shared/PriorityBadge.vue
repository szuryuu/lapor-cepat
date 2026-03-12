<template>
  <span class="inline-flex items-center px-2 py-0.5 border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest" :class="badgeStyle.classes">
    {{ badgeStyle.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PriorityLevel } from '~/types/report'

const props = defineProps<{ priority: PriorityLevel }>()

const badgeStyle = computed(() => {
  const map: Record<PriorityLevel, { classes: string, label: string }> = {
    CRITICAL: { classes: 'bg-red-600 text-white', label: 'KRITIS' },
    HIGH: { classes: 'bg-orange-500 text-slate-900', label: 'TINGGI' },
    MEDIUM: { classes: 'bg-yellow-400 text-slate-900', label: 'SEDANG' },
    LOW: { classes: 'bg-green-500 text-slate-900', label: 'RENDAH' },
  }
  return map[props.priority] || map.LOW
})
</script>
