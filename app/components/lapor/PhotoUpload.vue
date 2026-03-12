<template>
  <div class="w-full flex flex-col">
    <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="handleFileChange" />
    
    <div v-if="preview" class="border-2 border-slate-900 bg-white flex flex-col">
      <div class="flex justify-between items-center p-3 bg-slate-50 border-b-2 border-slate-900">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-900">Lampiran Visual</span>
        <button @click="clear" class="bg-slate-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">Hapus</button>
      </div>
      <div class="p-2">
        <img :src="preview" class="w-full h-48 object-cover border-2 border-slate-900" />
      </div>
    </div>

    <button v-else @click="fileInput?.click()" class="w-full bg-white border-2 border-dashed border-slate-400 hover:border-slate-900 hover:bg-slate-50 text-slate-600 p-8 flex flex-col items-center gap-3 transition-colors">
      <Camera class="w-8 h-8 text-slate-900" />
      <div class="flex flex-col items-center">
        <span class="text-sm font-bold uppercase tracking-widest text-slate-900">Unggah Foto Lokasi</span>
        <span class="text-xs font-bold text-slate-500 mt-1">(Opsional)</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Camera } from 'lucide-vue-next'

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
