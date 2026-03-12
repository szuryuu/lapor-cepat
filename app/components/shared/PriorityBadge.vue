<script setup lang="ts">
import type { PriorityLevel } from '~/types/report'
import { getPriorityLabel, getPriorityClasses } from '~/utils/priority'

defineProps<{ priority: PriorityLevel }>()
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded border-2 font-bold text-xs tracking-widest"
    :class="getPriorityClasses(priority)"
  >
    {{ getPriorityLabel(priority) }}
  </span>
</template>
