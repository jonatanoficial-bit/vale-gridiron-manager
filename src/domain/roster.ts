import type { ContentRightsStatus, ContentStatus, SeasonSnapshotContract } from './contracts'

export interface AthleteRosterRecord extends SeasonSnapshotContract {
  id: string
  name: string
  playerUrl: string
  teamId: string
  jerseyNumber: number | null
  position: string
  rosterStatus: string
  heightIn: number
  weightLbs: number
  experienceLabel: string
  college: string | null
  sourceId: string
  identityStatus: ContentStatus
  contractStatus: ContentStatus
  mediaStatus: ContentStatus
  simulationAttributeStatus: ContentStatus
}

export interface StaffRosterRecord extends SeasonSnapshotContract {
  id: string
  name: string
  teamId: string
  role: string
  sourceId: string
  identityStatus: ContentStatus
  contractStatus: ContentStatus
  mediaStatus: ContentStatus
}

export interface StaffContractRecord extends SeasonSnapshotContract {
  id: string
  staffId: string
  teamId: string
  durationYears: number | null
  salary: number | null
  sourceId: string
  contractStatus: ContentStatus
  notes: string
}

export interface RosterImportBatch {
  id: string
  teamId: string
  seasonId: string
  sourceId: string
  sourceUrl: string
  sourceAsOfDate: string
  sourceChecksum: string
  rowCount: number
  duplicateCount: number
  importStatus: ContentStatus
  notes: string
}

export interface RosterCoverageReport {
  snapshotId: string
  teamId: string
  rosterRows: number
  staffRows: number
  athleteContracts: number
  staffContracts: number
  portraitAssets: number
  uniformAssets: number
  stadiumAssets: number
  simulationProfiles: number
  contentRightsStatus: ContentRightsStatus
  notes: string
}
