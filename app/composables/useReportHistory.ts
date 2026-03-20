import { ref } from 'vue'

const MAX_HISTORY = 5

export interface ReportHistoryItem {
  id: string
  timestamp: string
  disasterType: string
  locationText: string
}

export function useReportHistory() {
  const history = ref<ReportHistoryItem[]>([])

  function load() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem('laporcepat_history')
      history.value = raw ? JSON.parse(raw) : []
    } catch {
      history.value = []
    }
  }

  function save(item: ReportHistoryItem) {
    if (!import.meta.client) return
    try {
      load()
      const existing = history.value.filter(h => h.id !== item.id)
      const updated = [item, ...existing].slice(0, MAX_HISTORY)
      localStorage.setItem('laporcepat_history', JSON.stringify(updated))
      history.value = updated
    } catch {}
  }

  function remove(id: string) {
    if (!import.meta.client) return
    try {
      const updated = history.value.filter(h => h.id !== id)
      localStorage.setItem('laporcepat_history', JSON.stringify(updated))
      history.value = updated
    } catch {}
  }

  return { history, load, save, remove }
}
