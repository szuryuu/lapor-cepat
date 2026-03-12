import type { PriorityLevel } from '~/types/report'

export function getPriorityLabel(priority: PriorityLevel): string {
  const map: Record<PriorityLevel, string> = {
    CRITICAL: 'KRITIS',
    HIGH: 'TINGGI',
    MEDIUM: 'SEDANG',
    LOW: 'RENDAH',
  }
  return map[priority]
}

export function getPriorityClasses(priority: PriorityLevel): string {
  const map: Record<PriorityLevel, string> = {
    CRITICAL: 'bg-red-600 text-white border-red-700',
    HIGH: 'bg-orange-500 text-white border-orange-600',
    MEDIUM: 'bg-yellow-500 text-white border-yellow-600',
    LOW: 'bg-green-500 text-white border-green-600',
  }
  return map[priority]
}

export function getPriorityMapColor(priority: PriorityLevel): string {
  const map: Record<PriorityLevel, string> = {
    CRITICAL: '#dc2626',
    HIGH: '#ea580c',
    MEDIUM: '#ca8a04',
    LOW: '#16a34a',
  }
  return map[priority]
}
