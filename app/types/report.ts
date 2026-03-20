export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export interface Report {
  id: string
  timestamp: string
  lat: number | null
  lng: number | null
  audioUrl: string | null
  photoUrl: string | null
  disasterType: string
  locationText: string
  victimCountEstimated: number | null
  victimStatus: string
  infrastructureDamage: boolean
  reporterIsVictim: boolean
  urgencyScore: number
  summaryBahasa: string
  situationNarrative?: string | null
  priority: PriorityLevel
  status: 'DRAFT' | 'PENDING' | 'DISPATCHED' | 'RESOLVED'
  isHoaxSuspected?: boolean
  hoaxReason?: string | null
  survivalInstructions?: string[]
  reporterPhone?: string | null
  isSilent?: boolean
}
