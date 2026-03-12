<script setup lang="ts">
import type { Report } from '~/types/report'
import { getPriorityMapColor } from '~/utils/priority'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{ reports: Report[] }>()

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null

function buildIcon(priority: Report['priority']) {
  const color = getPriorityMapColor(priority)
  return L.divIcon({
    html: `<div style="background:${color};width:16px;height:16px;border:2px solid #0f172a;"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function renderMarkers() {
  if (!map) return
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map!.removeLayer(layer)
  })
  props.reports
    .filter(r => r.lat && r.lng)
    .forEach(r => {
      L.marker([r.lat!, r.lng!], { icon: buildIcon(r.priority) })
        .bindPopup(`
          <div style="font-family: ui-sans-serif, system-ui, sans-serif; padding: 4px;">
            <div style="font-weight: 900; text-transform: uppercase; font-size: 12px; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 8px;">${r.disasterType}</div>
            <div style="font-weight: 700; font-size: 14px; line-height: 1.2; margin-bottom: 8px;">${r.locationText}</div>
            <div style="font-size: 12px; background: #f8fafc; padding: 8px; border: 1px solid #e2e8f0;">${r.summaryBahasa}</div>
          </div>
        `)
        .addTo(map!)
    })
}

onMounted(() => {
  if (!mapContainer.value) return
  map = L.map(mapContainer.value).setView([-6.2, 106.8], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map)
  renderMarkers()
})

watch(() => props.reports, renderMarkers, { deep: true })

onUnmounted(() => map?.remove())
</script>

<template>
  <div ref="mapContainer" class="w-full h-full" />
</template>
