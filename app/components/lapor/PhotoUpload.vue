<template>
  <div class="flex flex-col gap-4 w-full">
    <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="handleFileChange" />

    <div v-if="preview" class="relative rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-2">
      <img :src="preview" alt="Foto Laporan" class="w-full h-56 object-cover border-2 border-black" />
      <button @click="clear" class="absolute -top-4 -right-4 bg-red-500 text-white border-4 border-black w-12 h-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:scale-110 transition-transform cursor-pointer">
        <Trash2 class="w-6 h-6" />
      </button>
    </div>

    <button v-else @click="fileInput?.click()" class="w-full bg-white border-4 border-dashed border-black p-8 flex flex-col items-center justify-center gap-3 text-black hover:bg-gray-100 hover:border-solid transition-all cursor-pointer">
      <Camera class="w-12 h-12 text-black" />
      <span class="font-black uppercase tracking-widest text-sm text-center text-black">Tambah Foto Lokasi<br><span class="text-[10px] text-gray-500">(Opsional tapi sangat membantu)</span></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Camera, Trash2 } from 'lucide-vue-next'

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
