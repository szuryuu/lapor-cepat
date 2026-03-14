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
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'DRAFT' | 'PENDING' | 'DISPATCHED' | 'RESOLVED'
  isHoaxSuspected?: boolean
  hoaxReason?: string | null
  survivalInstructions?: string[]
}
