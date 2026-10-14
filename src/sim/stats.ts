import type { GameProjection, GameState, TeamGameStats } from './types'

const blankStats = (): TeamGameStats => ({
  firstDowns: 0,
  passingYards: 0,
  rushingYards: 0,
  turnovers: 0,
  touchdowns: 0,
  fieldGoals: 0,
})

export function projectStats(state: GameState): GameProjection {
  const home = blankStats()
  const away = blankStats()

  for (const event of state.events) {
    const stats = event.teamId === state.homeTeamId ? home : event.teamId === state.awayTeamId ? away : null
    if (!stats) continue

    if (event.type === 'run') stats.rushingYards += event.yards ?? 0
    if (event.type === 'pass-complete' || event.type === 'sack') stats.passingYards += event.yards ?? 0
    if (event.type === 'touchdown') stats.touchdowns += 1
    if (event.type === 'field-goal-good') stats.fieldGoals += 1
    if (event.type === 'interception') stats.turnovers += 1
  }

  for (const event of state.events) {
    if (event.type !== 'turnover-on-downs') continue
    const team = event.teamId === state.homeTeamId ? home : event.teamId === state.awayTeamId ? away : null
    if (team) team.turnovers += 1
  }

  const drives = new Map<string, { lastDown: number; firstDowns: number }>()
  for (const event of state.events) {
    if (event.type !== 'snap' || !event.teamId) continue
    const previous = drives.get(event.teamId) ?? { lastDown: 0, firstDowns: 0 }
    if (event.text.includes('1ª & 10') && previous.lastDown > 1) previous.firstDowns += 1
    previous.lastDown = Number(event.text.match(/(\d)ª/)?.[1] ?? 0)
    drives.set(event.teamId, previous)
  }
  home.firstDowns = drives.get(state.homeTeamId)?.firstDowns ?? 0
  away.firstDowns = drives.get(state.awayTeamId)?.firstDowns ?? 0

  return { home, away }
}
