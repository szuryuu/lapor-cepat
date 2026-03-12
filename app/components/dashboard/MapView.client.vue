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
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
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
        .bindPopup(`<b>${r.disasterType}</b><br/>${r.locationText}<br/><small>${r.summaryBahasa}</small>`)
        .addTo(map!)
    })
}

onMounted(() => {
  if (!mapContainer.value) return
  map = L.map(mapContainer.value).setView([-6.2, 106.8], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)
  renderMarkers()
})

watch(() => props.reports, renderMarkers, { deep: true })

onUnmounted(() => map?.remove())
</script>

<template>
  <div ref="mapContainer" class="w-full h-full" />
</template>
