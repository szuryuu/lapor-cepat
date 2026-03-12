<script setup lang="ts">
const emit = defineEmits<{ 'update:modelValue': [Blob | null] }>()

const { isRecording, audioBlob, audioUrl, duration, error, start, stop, reset } = useVoiceRecorder()

watch(audioBlob, blob => emit('update:modelValue', blob))

const progressPercent = computed(() => Math.round((duration.value / 20) * 100))
const secondsLeft = computed(() => 20 - duration.value)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <p v-if="error" class="text-red-500 text-sm text-center px-2">{{ error }}</p>

    <div v-if="!audioUrl">
      <div v-if="isRecording" class="flex flex-col items-center gap-4 w-full">
        <div class="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center animate-pulse shadow-lg">
          <span class="text-white text-4xl">🎙</span>
        </div>
        <PUProgress :value="progressPercent" />
        <p class="text-sm text-gray-600">{{ secondsLeft }} detik tersisa</p>
        <PUButton flavor="outlined" size="small" @click="stop">Selesai Rekam</PUButton>
      </div>

      <div v-else class="flex flex-col items-center gap-3">
        <button
          class="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform select-none"
          @click="start"
        >
          <span class="text-white text-4xl">🎙</span>
        </button>
        <p class="text-sm text-gray-500">Tap untuk mulai rekam</p>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-3 w-full">
      <div class="flex items-center gap-2 text-green-600 font-semibold">
        <span>✅</span>
        <span class="text-sm">Rekaman berhasil ({{ duration }} detik)</span>
      </div>
      <audio :src="audioUrl" controls class="w-full rounded-lg" />
      <PUButton flavor="ghost" size="small" @click="reset">🔄 Rekam Ulang</PUButton>
    </div>
  </div>
</template>
