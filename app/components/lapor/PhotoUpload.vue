<script setup lang="ts">
const emit = defineEmits<{ 'update:modelValue': [File | null] }>()

const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = URL.createObjectURL(file)
  emit('update:modelValue', file)
}

function clear() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}

onUnmounted(() => {
  if (preview.value) URL.revokeObjectURL(preview.value)
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleFileChange"
    />

    <div v-if="preview" class="relative rounded-xl overflow-hidden border-2 border-black">
      <img :src="preview" alt="Foto bencana" class="w-full h-44 object-cover" />
      <button
        class="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md font-bold text-sm"
        @click="clear"
      >
        ✕
      </button>
    </div>

    <PUButton
      :flavor="preview ? 'outlined' : 'ghost'"
      @click="fileInput?.click()"
    >
      {{ preview ? '🔄 Ganti Foto' : '📷 Tambah Foto (opsional)' }}
    </PUButton>
  </div>
</template>
