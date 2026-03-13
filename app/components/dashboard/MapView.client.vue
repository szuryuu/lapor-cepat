<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Report } from '~/types/report'
import { getPriorityMapColor } from '~/utils/priority'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{ reports: Report[] }>()

const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let markersLayer: L.FeatureGroup | null = null

function buildIcon(priority: Report['priority'], count: number) {
  const color = getPriorityMapColor(priority)
  const badge = count > 1 
    ? `<div style="position:absolute; top:-8px; right:-8px; background:#0f172a; color:#fff; font-size:10px; font-weight:900; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; z-index:10;">${count}</div>` 
    : ''
    
  return L.divIcon({
    html: `<div style="position:relative; background:${color};width:20px;height:20px;border:2px solid #0f172a;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${badge}</div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

function renderMarkers() {
  if (!map) return
  if (markersLayer) map.removeLayer(markersLayer)
  
  const grouped = new Map<string, Report[]>()
  
  props.reports.forEach(r => {
    const lat = r.lat || -7.782888
    const lng = r.lng || 110.367069
    
    const key = `${lat},${lng}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(r)
  })

  const markers: L.Marker[] = []
  const priorityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

  grouped.forEach((group, key) => {
    const [lat, lng] = key.split(',').map(Number)
    
    let highestPriority: Report['priority'] = 'LOW'
    for (const p of priorityOrder) {
      if (group.some(r => r.priority === p)) {
        highestPriority = p as Report['priority']
        break
      }
    }

    let popupHtml = `<div style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 4px; font-family: ui-sans-serif, system-ui, sans-serif;">`
    
    group.forEach(r => {
      popupHtml += `
        <div style="padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <span style="font-weight: 900; text-transform: uppercase; font-size: 12px; color: #0f172a; letter-spacing: 0.05em;">${r.disasterType}</span>
            <span style="font-size: 10px; font-weight: bold; color: #64748b; font-family: monospace;">ID:${r.id.split('-')[0]}</span>
          </div>
          <div style="font-weight: 700; font-size: 13px; line-height: 1.3; margin-bottom: 8px; color: #334155;">${r.locationText}</div>
          <div style="font-size: 11px; background: #f8fafc; padding: 8px; border: 1px solid #cbd5e1; color: #475569; font-weight: 600; text-transform: uppercase;">"${r.summaryBahasa}"</div>
        </div>`
    })
    
    popupHtml += `</div>`

    const marker = L.marker([lat, lng], { icon: buildIcon(highestPriority, group.length) })
      .bindPopup(popupHtml, { minWidth: 280, maxWidth: 320 })
    
    markers.push(marker)
  })

  markersLayer = L.featureGroup(markers).addTo(map)
  
  if (markers.length > 0) {
    map.fitBounds(markersLayer.getBounds(), { padding: [50, 50], maxZoom: 15 })
  }
}

onMounted(() => {
  if (!mapContainer.value) return
  map = L.map(mapContainer.value).setView([-7.782888, 110.367069], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map)
  renderMarkers()
})

watch(() => props.reports, renderMarkers, { deep: true })

onUnmounted(() => map?.remove())
</script>

<template>
  <div ref="mapContainer" class="w-full h-full z-0" />
</template>
