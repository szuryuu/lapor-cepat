export type DisasterType = 'BANJIR' | 'GEMPA' | 'LONGSOR' | 'KEBAKARAN' | 'ANGIN' | 'LAINNYA'
export type VictimStatus = 'TERJEBAK' | 'LUKA' | 'MENINGGAL' | 'TIDAK_ADA_KORBAN' | 'TIDAK_DIKETAHUI'
export type ReportStatus = 'PENDING' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED'
export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export interface Report {
  id: string
  timestamp: string
  status: ReportStatus
  priority: PriorityLevel
  priorityScore: number
  audioUrl?: string
  photoUrl?: string
  rawTranscript: string
  locationText: string
  lat?: number
  lng?: number
  disasterType: DisasterType
  victimCountEstimated?: number
  victimStatus: VictimStatus
  infrastructureDamage: boolean
  reporterIsVictim: boolean
  urgencyScore: number
  summaryBahasa: string
  clusterId?: string
  isDuplicate: boolean
  duplicateOf?: string
  assignedTo?: string
  dispatchedAt?: string
  fcmToken?: string
}
