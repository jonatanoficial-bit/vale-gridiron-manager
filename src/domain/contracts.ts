export type Route = 'inicio' | 'carreira' | 'temporada' | 'jogoUnico' | 'banco' | 'configuracoes'

export type GameMode = 'career' | 'season' | 'game'

export type ContentStatus = 'pending' | 'ready'

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

export interface SeasonSnapshotContract {
  seasonId: string
  sourceAsOfDate: string
  contentRightsStatus: ContentStatus
}

export interface CareerSaveContract {
  id: string
  mode: 'career'
  userCoachId: string
  currentClubId: string | null
  contentSnapshotIds: string[]
  schemaVersion: number
}
