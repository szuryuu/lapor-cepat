<template>
  <span class="inline-flex items-center px-2 py-0.5 border-2 border-black font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :class="badgeStyle.classes">
    {{ badgeStyle.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PriorityLevel } from '~/types/report'

const props = defineProps<{ priority: PriorityLevel }>()

const badgeStyle = computed(() => {
  const map: Record<PriorityLevel, { classes: string, label: string }> = {
    CRITICAL: { classes: 'bg-red-500 text-white', label: 'Kritis' },
    HIGH: { classes: 'bg-orange-500 text-white', label: 'Tinggi' },
    MEDIUM: { classes: 'bg-yellow-400 text-black', label: 'Sedang' },
    LOW: { classes: 'bg-green-500 text-white', label: 'Rendah' },
  }
  return map[props.priority] || map.LOW
})
</script>
