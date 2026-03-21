<template>
  <div class="w-full flex flex-col">
    <input ref="fileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="handleFileChange" />

    <div v-if="preview" class="border-2 border-slate-900 bg-white flex flex-col">
      <div class="flex justify-between items-center p-3 bg-slate-50 border-b-2 border-slate-900">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-900">Lampiran Visual</span>
        <button @click="clear" class="bg-slate-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">Hapus</button>
      </div>
      <div class="p-2 relative">
        <img :src="preview" class="w-full h-48 object-cover border-2 border-slate-900" />
        <div v-if="isCompressing" class="absolute inset-2 bg-slate-900/70 flex items-center justify-center border-2 border-slate-900">
          <span class="text-[10px] font-black uppercase tracking-widest text-white">Mengompresi...</span>
        </div>
      </div>
      <div v-if="compressedSize" class="px-3 pb-3">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ukuran foto: {{ compressedSize }}</span>
      </div>
    </div>

    <button v-else @click="fileInput?.click()" class="w-full bg-white border-2 border-dashed border-slate-400 hover:border-slate-900 hover:bg-slate-50 text-slate-600 p-8 flex flex-col items-center gap-3 transition-colors">
      <Camera class="w-8 h-8 text-slate-900" />
      <div class="flex flex-col items-center">
        <span class="text-sm font-bold uppercase tracking-widest text-slate-900">Unggah Foto Lokasi</span>
        <span class="text-xs font-bold text-slate-500 mt-1">(Opsional)</span>
      </div>
    </button>

    <div v-if="errorMsg" class="mt-2 bg-red-50 border-2 border-red-400 p-3">
      <span class="text-[10px] font-bold text-red-700 uppercase tracking-widest">{{ errorMsg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Camera } from 'lucide-vue-next'

const emit = defineEmits<{ 'update:modelValue': [File | null] }>()
const preview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const isCompressing = ref(false)
const compressedSize = ref<string | null>(null)
const errorMsg = ref<string | null>(null)

const MAX_COMPRESSED_BYTES = 600 * 1024

function formatBytes(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(0)} KB`
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const MAX_DIM = 1024
      let { width, height } = img

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width)
          width = MAX_DIM
        } else {
          width = Math.round((width * MAX_DIM) / height)
          height = MAX_DIM
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      const tryQuality = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Kompresi gagal'))
            if (blob.size <= MAX_COMPRESSED_BYTES || quality <= 0.35) {
              resolve(blob)
            } else {
              tryQuality(Math.round((quality - 0.15) * 100) / 100)
            }
          },
          'image/jpeg',
          quality
        )
      }

      tryQuality(0.7)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal memuat gambar'))
    }

    img.src = url
  })
}

async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  errorMsg.value = null
  isCompressing.value = true
  compressedSize.value = null
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null

  try {
    const compressed = await compressImage(file)

    if (compressed.size > MAX_COMPRESSED_BYTES) {
      errorMsg.value = `Foto terlalu besar bahkan setelah kompresi (${formatBytes(compressed.size)}). Coba foto dengan resolusi lebih rendah.`
      emit('update:modelValue', null)
      return
    }

    const compressedFile = new File([compressed], 'photo.jpg', { type: 'image/jpeg' })
    preview.value = URL.createObjectURL(compressed)
    compressedSize.value = formatBytes(compressed.size)
    emit('update:modelValue', compressedFile)
  } catch {
    errorMsg.value = 'Gagal memproses foto.'
    emit('update:modelValue', null)
  } finally {
    isCompressing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function clear() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = null
  compressedSize.value = null
  errorMsg.value = null
  emit('update:modelValue', null)
  if (fileInput.value) fileInput.value.value = ''
}

onUnmounted(() => {
  if (preview.value) URL.revokeObjectURL(preview.value)
})
</script>
