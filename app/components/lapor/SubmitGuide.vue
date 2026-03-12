<script setup lang="ts">
defineEmits<{ ready: [] }>()

const guides = [
  { emoji: '📍', label: 'Lokasi', hint: 'Nama jalan / landmark terdekat' },
  { emoji: '⚠️', label: 'Kejadian', hint: 'Jenis bencana yang terjadi' },
  { emoji: '🧑', label: 'Korban', hint: 'Jumlah & kondisi korban' },
]
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <PUCard size="large" class="w-full">
      <div class="flex flex-col items-center gap-6 text-center">
        <p class="text-xl font-bold">Sebutkan dalam rekaman:</p>
        <div class="grid grid-cols-3 gap-4 w-full">
          <div v-for="item in guides" :key="item.emoji" class="flex flex-col items-center gap-2">
            <span class="text-4xl">{{ item.emoji }}</span>
            <span class="font-semibold text-sm">{{ item.label }}</span>
            <span class="text-xs text-gray-500">{{ item.hint }}</span>
          </div>
        </div>
      </div>
    </PUCard>

    <p class="text-sm text-gray-500 text-center px-4">
      Rekaman maksimal <strong>20 detik</strong>. Bicara jelas dan tenang.
    </p>

    <PUButton size="large" shape="circle" @click="$emit('ready')">
      Saya Siap →
    </PUButton>
  </div>
</template>
