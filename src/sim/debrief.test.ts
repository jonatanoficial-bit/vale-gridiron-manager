import { describe, expect, it } from 'vitest'
import { createGame, resolvePlay, simulateToEnd } from './engine'
import { createMatchDebrief } from './debrief'

describe('sala de análise pós-jogo', () => {
  it('resume uma partida final somente a partir do EventLog e do plano local', () => {
    const final = simulateToEnd(createGame({
      gameId: 'review',
      seed: 'review-seed',
      homeTeamId: 'home',
      awayTeamId: 'away',
      quarterMs: 60_000,
      strategy: { offensiveIdentity: 'ground-control' },
    }))
    const report = createMatchDebrief(final)

    expect(final.status).toBe('final')
    expect(report.context).toMatch(/simengine/i)
    expect(report.focus.label).toMatch(/POSSE|MARGEM|TERRESTRE/)
    expect(report.moments.length).toBeGreaterThanOrEqual(0)
    expect(report.moments.length).toBeLessThanOrEqual(3)
  })

  it('prioritizes protection of possession when a turnover is recorded', () => {
    const state = resolvePlay(createGame({ gameId: 'turnover', seed: 'turnover-seed', homeTeamId: 'home', awayTeamId: 'away' }), 'short-pass')
    const withTurnover = {
      ...state,
      events: [...state.events, { id: 'turnover-1', sequence: 99, type: 'interception' as const, teamId: 'away', period: 1, clockMs: 1_000, text: 'Passe interceptado.' }],
    }

    expect(createMatchDebrief(withTurnover).focus.label).toBe('PROTEÇÃO DA POSSE')
  })
})
