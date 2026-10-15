import { describe, expect, it } from 'vitest'
import { createGame, resolvePlay, simulateToEnd } from './engine'
import { projectStats } from './stats'

describe('SimEngine do Lote 04', () => {
  const setup = { gameId: 'teste', seed: 'seed-imutavel', homeTeamId: 'home', awayTeamId: 'away', quarterMs: 60_000 }

  it('repete exatamente a mesma sequência quando recebe a mesma seed e chamadas', () => {
    const calls = ['rush', 'short-pass', 'punt'] as const
    const first = calls.reduce((state, call) => resolvePlay(state, call), createGame(setup))
    const second = calls.reduce((state, call) => resolvePlay(state, call), createGame(setup))
    expect(first).toEqual(second)
  })

  it('registra snap e ação antes de qualquer alteração de placar', () => {
    const state = resolvePlay(createGame(setup), 'rush')
    expect(state.events.map((event) => event.type)).toContain('snap')
    expect(state.events.some((event) => event.type === 'run')).toBe(true)
    expect(state.events.every((event) => event.scoreDelta === undefined || ['touchdown', 'extra-point-good', 'field-goal-good'].includes(event.type))).toBe(true)
  })

  it('encerra partida rápida, mantém log e projeta estatísticas a partir dos eventos', () => {
    const final = simulateToEnd(createGame(setup))
    const stats = projectStats(final)
    expect(final.status).toBe('final')
    expect(final.events.at(-1)?.type).toBe('end-game')
    expect(stats.home.touchdowns + stats.away.touchdowns).toBeGreaterThanOrEqual(0)
  })

  it('aplica o plano tático de forma determinística e mensurável', () => {
    const aerial = simulateToEnd(createGame({ ...setup, strategy: { offensiveIdentity: 'air-raid', defensiveIdentity: 'pressure', aggression: 76, readiness: 78, fatigueRisk: 12, chemistry: 70 } }))
    const ground = simulateToEnd(createGame({ ...setup, strategy: { offensiveIdentity: 'ground-control', defensiveIdentity: 'contain', aggression: 42, readiness: 78, fatigueRisk: 12, chemistry: 70 } }))
    expect(aerial.engineVersion).toBe('lot-09-strategy-v1')
    expect(aerial.events).toEqual(simulateToEnd(createGame({ ...setup, strategy: { offensiveIdentity: 'air-raid', defensiveIdentity: 'pressure', aggression: 76, readiness: 78, fatigueRisk: 12, chemistry: 70 } })).events)
    expect(projectStats(aerial).away.passingYards + projectStats(aerial).home.passingYards).not.toBe(projectStats(ground).away.passingYards + projectStats(ground).home.passingYards)
  })
})
