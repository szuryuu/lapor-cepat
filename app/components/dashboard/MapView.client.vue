<template>
  <div class="relative w-full h-full min-h-[500px]">
    <div class="absolute top-4 right-4 z-[400] bg-white border-2 border-slate-900 p-4 flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 border-b-2 border-slate-100 pb-2">Filter Prioritas</span>
      
      <label class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer group">
        <input type="radio" v-model="filter" value="ALL" class="w-4 h-4 accent-slate-900" /> 
        <span class="group-hover:text-slate-600 transition-colors">Semua Radar</span>
      </label>
      <label class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer group text-red-600">
        <input type="radio" v-model="filter" value="CRITICAL" class="w-4 h-4 accent-red-600" /> 
        <span class="group-hover:text-red-500 transition-colors">Kritis (Lvl 5)</span>
      </label>
      <label class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer group text-orange-600">
        <input type="radio" v-model="filter" value="HIGH" class="w-4 h-4 accent-orange-600" /> 
        <span class="group-hover:text-orange-500 transition-colors">Tinggi (Lvl 4)</span>
      </label>
      <label class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer group text-blue-600">
        <input type="radio" v-model="filter" value="MEDIUM" class="w-4 h-4 accent-blue-600" /> 
        <span class="group-hover:text-blue-500 transition-colors">Menengah (Lvl 3)</span>
      </label>
    </div>
    
    <div id="map" class="w-full h-full absolute inset-0 z-0"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { Report } from '~/types/report'

const props = defineProps<{ reports: Report[] }>()
const filter = ref('ALL')

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' }
  ]
})

const filteredReports = computed(() => {
  if (filter.value === 'ALL') return props.reports
  return props.reports.filter(r => r.priority === filter.value)
})

let map: any = null
let markers: any[] = []

onMounted(async () => {
  const L = (await import('leaflet')).default
  
  map = L.map('map', { zoomControl: false }).setView([-7.7956, 110.3695], 13)
  
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19
  }).addTo(map)

  const updateMarkers = () => {
    markers.forEach(m => map.removeLayer(m))
    markers = []

    filteredReports.value.forEach(report => {
      if (report.lat && report.lng) {
        let color = '#3b82f6' 
        if (report.priority === 'CRITICAL') color = '#ef4444'
        else if (report.priority === 'HIGH') color = '#f97316'

        const opacity = report.status === 'RESOLVED' ? '0.4' : '1'
        const border = report.status === 'PENDING' ? 'border-style: dashed;' : 'border-style: solid;'

        const icon = L.divIcon({
          className: 'custom-triage-marker',
          html: `<div style="background-color: ${color}; opacity: ${opacity}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #0f172a; ${border} box-shadow: 3px 3px 0px #0f172a;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10]
        })

        const marker = L.marker([report.lat, report.lng], { icon }).addTo(map)
        
        const popupContent = `
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding: 4px; min-width: 200px;">
            <div style="font-size: 10px; font-weight: 900; letter-spacing: 0.1em; color: ${color}; text-transform: uppercase; margin-bottom: 4px; border-bottom: 2px solid #0f172a; padding-bottom: 4px;">
              ${report.priority} PRIORITY
            </div>
            <div style="font-size: 14px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 4px;">
              ${report.disasterType}
            </div>
            <div style="font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 8px; line-height: 1.4;">
              ${report.locationText}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #e2e8f0; padding-top: 8px;">
              <span style="font-size: 10px; font-weight: 900; padding: 2px 6px; background: #0f172a; color: white;">${report.status}</span>
              <a href="/dashboard/laporan/${report.id}" style="font-size: 10px; font-weight: bold; color: #0f172a; text-decoration: none;">DETAIL ↗</a>
            </div>
          </div>
        `
        
        marker.bindPopup(popupContent, {
          className: 'triage-popup',
          closeButton: false
        })
        
        markers.push(marker)
      }
    })
  }

  watch(filteredReports, updateMarkers, { deep: true, immediate: true })
})
</script>

<style>
.triage-popup .leaflet-popup-content-wrapper {
  background: white;
  border: 2px solid #0f172a;
  border-radius: 0;
  box-shadow: 4px 4px 0px 0px rgba(15,23,42,1);
  padding: 0;
}
.triage-popup .leaflet-popup-tip-container {
  display: none;
}
</style>
