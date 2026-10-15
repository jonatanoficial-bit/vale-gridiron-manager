export type PlayCall = 'rush' | 'short-pass' | 'punt' | 'field-goal'

export interface GameStrategy {
  offensiveIdentity: 'balanced' | 'air-raid' | 'ground-control'
  defensiveIdentity: 'contain' | 'pressure' | 'coverage'
  aggression: number
  readiness: number
  fatigueRisk: number
  chemistry: number
}

export type GameEventType =
  | 'kickoff'
  | 'snap'
  | 'run'
  | 'pass-complete'
  | 'pass-incomplete'
  | 'sack'
  | 'interception'
  | 'punt'
  | 'field-goal-good'
  | 'field-goal-missed'
  | 'touchdown'
  | 'extra-point-good'
  | 'turnover-on-downs'
  | 'end-quarter'
  | 'end-game'

export interface GameEvent {
  id: string
  sequence: number
  type: GameEventType
  teamId: string | null
  period: number
  clockMs: number
  text: string
  yards?: number
  scoreDelta?: number
}

export interface TeamGameStats {
  firstDowns: number
  passingYards: number
  rushingYards: number
  turnovers: number
  touchdowns: number
  fieldGoals: number
}

export interface GameState {
  gameId: string
  engineVersion: 'lot-04-neutral-v1' | 'lot-09-strategy-v1'
  seed: string
  randomState: number
  homeTeamId: string
  awayTeamId: string
  period: number
  gameClockMs: number
  homeScore: number
  awayScore: number
  offenseId: string
  defenseId: string
  direction: 'right' | 'left'
  ballSpot: number
  down: number
  distance: number
  strategy: GameStrategy
  eventNumber: number
  status: 'in-progress' | 'final'
  events: readonly GameEvent[]
}

export interface GameSetup {
  gameId: string
  seed: string
  homeTeamId: string
  awayTeamId: string
  quarterMs?: number
  strategy?: Partial<GameStrategy>
}

export interface GameProjection {
  home: TeamGameStats
  away: TeamGameStats
}
