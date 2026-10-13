export type Route = 'inicio' | 'carreira' | 'temporada' | 'elenco' | 'jogoUnico' | 'banco' | 'configuracoes'

export type GameMode = 'career' | 'season' | 'game'

export type ContentStatus = 'pending' | 'partial' | 'ready'

export type ContentRightsStatus = 'cleared' | 'pending' | 'denied' | 'reference-only'

export interface ContentLayer {
  name: string
  status: ContentStatus
  nextAction: string
}

export interface CoachProfile {
  name: string
  nationality: string
  difficulty: 'Equilibrada' | 'Desafiadora' | 'Lenda'
  philosophy: 'Ataque equilibrado' | 'Defesa agressiva' | 'Controle de jogo'
  reduceMotion: boolean
}

export interface ContentCoverage {
  catalogLabel: string
  completedFields: number
  totalFields: number
  sourceMessage: string
  layers: ContentLayer[]
}

export interface SourceReference {
  id: string
  label: string
  url: string
  scope: string
  sourceAsOfDate: string
}

export interface SeasonSnapshotContract {
  seasonId: string
  sourceAsOfDate: string
  contentRightsStatus: ContentRightsStatus
}

export interface LeagueSnapshot extends SeasonSnapshotContract {
  leagueId: string
  leagueName: string
  seasonYear: number
  providerSourceIds: string[]
  rulesetId: string
  coverageStatus: ContentStatus
}

export interface FranchiseCatalogEntry extends SeasonSnapshotContract {
  id: string
  name: string
  leagueId: 'nfl' | 'ufl'
  conference: 'AFC' | 'NFC' | null
  division: 'East' | 'North' | 'South' | 'West' | null
  sourceIds: string[]
  identificationStatus: ContentStatus
  rosterStatus: ContentStatus
  staffStatus: ContentStatus
  scheduleStatus: ContentStatus
  mediaStatus: ContentStatus
  officialLogo?: OfficialLogoAsset
}

export interface OfficialLogoAsset {
  assetId: string
  path: string
  sourceId: string
  spritePosition?: string
  spriteSize?: string
}

export interface RightsAssetManifestEntry {
  assetId: string
  assetType: 'team-logo'
  subjectId: string
  seasonId: string
  sourceId: string
  path: string
  contentRightsStatus: ContentRightsStatus
  attribution: string
}

export interface CalendarMilestone extends SeasonSnapshotContract {
  id: string
  leagueId: 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs'
  label: string
  dateLabel: string
  detail: string
  sourceId: string
  importStatus: ContentStatus
}

export interface RuleSetContract {
  id: string
  leagueId: 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs'
  seasonId: string
  displayName: string
  facts: string[]
  sourceIds: string[]
  coverageStatus: ContentStatus
}

export interface CoverageMetric {
  field: 'identificação' | 'rosters' | 'técnicos' | 'jogos' | 'uniformes' | 'faces' | 'contratos'
  completed: number
  expected: number
  status: ContentStatus
}

export interface CompetitionCoverageReport {
  leagueId: 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs'
  snapshotId: string
  label: string
  sourceIds: string[]
  metrics: CoverageMetric[]
}

export interface CareerScenario {
  id: string
  label: string
  leagueId: 'ncaa-fcs' | 'ncaa-fbs' | 'ufl' | 'nfl'
  status: ContentStatus
  requirement: string
}

export interface CatalogSelection {
  seasonId: string
  franchiseId: string | null
}

export interface CareerSaveContract {
  id: string
  mode: 'career'
  userCoachId: string
  currentClubId: string | null
  contentSnapshotIds: string[]
  schemaVersion: number
}
