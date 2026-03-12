<script setup lang="ts">
import type { Report } from '~/types/report'

const props = defineProps<{ report: Report }>()
const emit = defineEmits<{
  dispatch: [id: string]
  view: [id: string]
}>()

const disasterEmoji: Record<string, string> = {
  BANJIR: '🌊', GEMPA: '🌍', LONGSOR: '⛰️',
  KEBAKARAN: '🔥', ANGIN: '💨', LAINNYA: '⚠️',
}

const timeAgo = computed(() => {
  const diffMs = Date.now() - new Date(props.report.timestamp).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins} mnt lalu`
  return `${Math.floor(mins / 60)} jam lalu`
})

const truncatedTranscript = computed(() => {
  const t = props.report.rawTranscript
  return t.length > 110 ? t.slice(0, 110) + '...' : t
})
</script>

<template>
  <PUCard size="medium" class="w-full">
    <div class="flex flex-col gap-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          <SharedPriorityBadge :priority="report.priority" />
          <span class="font-mono text-xs text-gray-400">#{{ report.id }}</span>
          <PUBadge v-if="report.clusterId" label="CLUSTER" severity="secondary" />
        </div>
        <span class="text-xs text-gray-400 whitespace-nowrap shrink-0">{{ timeAgo }}</span>
      </div>

      <div class="flex items-start gap-3">
        <span class="text-3xl leading-none">{{ disasterEmoji[report.disasterType] }}</span>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm leading-snug">{{ report.locationText }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ report.summaryBahasa }}</p>
        </div>
      </div>

      <div v-if="report.victimCountEstimated" class="flex items-center gap-2 text-sm">
        <span>👥</span>
        <span class="font-medium">{{ report.victimCountEstimated }} orang</span>
        <span class="text-gray-400">—</span>
        <span class="text-gray-600">{{ report.victimStatus }}</span>
      </div>

      <div v-if="report.rawTranscript" class="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 italic border">
        "{{ truncatedTranscript }}"
      </div>

      <div class="flex gap-2 pt-1">
        <PUButton
          v-if="report.status === 'PENDING'"
          size="small"
          @click="emit('dispatch', report.id)"
        >
          ▶ Tugaskan TRC
        </PUButton>
        <PUButton
          flavor="outlined"
          size="small"
          @click="emit('view', report.id)"
        >
          Detail
        </PUButton>
      </div>
    </div>
  </PUCard>
</template>
