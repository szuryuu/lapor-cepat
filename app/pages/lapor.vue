<script setup lang="ts">
useSeoMeta({ title: 'Laporan Bencana — Lapor Cepat' })

type Step = 'guide' | 'record' | 'review'

const step = ref<Step>('guide')
const audioBlob = ref<Blob | null>(null)
const photoFile = ref<File | null>(null)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

const { lat, lng, capture: captureLocation } = useGeolocation()

const stepIndex = computed<Record<Step, number>>(() => ({ guide: 0, record: 1, review: 2 }))

async function onGuideReady() {
  captureLocation().catch(() => {})
  step.value = 'record'
}

function onRecordingComplete() {
  if (audioBlob.value) step.value = 'review'
}

async function submitReport() {
  if (!audioBlob.value || isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = null

  const form = new FormData()
  form.append('audio', audioBlob.value, 'laporan.webm')
  if (photoFile.value) form.append('photo', photoFile.value)
  if (lat.value) form.append('lat', String(lat.value))
  if (lng.value) form.append('lng', String(lng.value))

  try {
    const result = await $fetch<{ id: string }>('/api/reports', {
      method: 'POST',
      body: form,
    })
    await navigateTo(`/konfirmasi/${result.id}`)
  } catch {
    submitError.value = 'Gagal mengirim laporan. Periksa koneksi internet Anda.'
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex items-center gap-3 px-4 py-4 border-b-2 border-black bg-white sticky top-0 z-10">
      <button class="text-xl font-bold px-1" @click="step === 'guide' ? $router.back() : step = step === 'review' ? 'record' : 'guide'">
        ←
      </button>
      <span class="font-bold text-lg">Laporan Bencana</span>
    </header>

    <div class="flex-1 flex flex-col px-4 py-6 max-w-sm mx-auto w-full gap-6">
      <div class="flex gap-1.5">
        <div
          v-for="(_, i) in 3"
          :key="i"
          class="h-1.5 flex-1 rounded-full transition-colors duration-300"
          :class="stepIndex[step] >= i ? 'bg-black' : 'bg-gray-200'"
        />
      </div>

      <LaporSubmitGuide v-if="step === 'guide'" @ready="onGuideReady" />

      <template v-if="step === 'record'">
        <PUCard size="large" class="w-full">
          <LaporVoiceRecorder v-model="audioBlob" />
        </PUCard>
        <PUButton
          v-if="audioBlob"
          size="large"
          shape="circle"
          @click="onRecordingComplete"
        >
          Lanjut →
        </PUButton>
      </template>

      <template v-if="step === 'review'">
        <PUCard size="large" class="w-full">
          <p class="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wide">Rekaman</p>
          <div class="flex items-center gap-2 text-green-600 font-medium text-sm mb-3">
            <span>✅</span>
            <span>Suara berhasil direkam</span>
          </div>
          <audio v-if="audioBlob" controls class="w-full rounded-lg" :src="audioBlob ? URL.createObjectURL(audioBlob) : ''" />
        </PUCard>

        <PUCard size="large" class="w-full">
          <p class="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wide">Foto Kondisi</p>
          <LaporPhotoUpload v-model="photoFile" />
        </PUCard>

        <p v-if="submitError" class="text-red-500 text-sm text-center">{{ submitError }}</p>

        <PUButton
          size="large"
          :disabled="isSubmitting"
          @click="submitReport"
        >
          {{ isSubmitting ? '⏳ Memproses AI...' : '🚀 Kirim Laporan' }}
        </PUButton>
      </template>
    </div>
  </div>
</template>
