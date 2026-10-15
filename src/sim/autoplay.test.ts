import { describe, expect, it } from 'vitest'
import { createGame } from './engine'
import { recommendAutoPlay, tacticalDecision } from './autoplay'

function stateAt(overrides: Partial<ReturnType<typeof createGame>>) {
  return { ...createGame({ gameId: 'auto', seed: 'auto', homeTeamId: 'home', awayTeamId: 'away' }), ...overrides }
}

describe('autoplay tactical assistant', () => {
  it('recommends a field goal in a reachable fourth down', () => {
    const state = stateAt({ down: 4, ballSpot: 65, distance: 4 })
    expect(recommendAutoPlay(state)).toBe('field-goal')
    expect(tacticalDecision(state)).toMatchObject({ recommended: 'field-goal' })
  })

  it('pauses the broadcast for fourth down outside scoring range', () => {
    const state = stateAt({ down: 4, ballSpot: 42, distance: 7 })
    expect(recommendAutoPlay(state)).toBe('punt')
    expect(tacticalDecision(state)).toMatchObject({ recommended: 'punt' })
  })

  it('uses the offensive identity for ordinary automatic calls', () => {
    expect(recommendAutoPlay(stateAt({ strategy: { ...stateAt({}).strategy, offensiveIdentity: 'air-raid' }, distance: 8 }))).toBe('short-pass')
    expect(recommendAutoPlay(stateAt({ strategy: { ...stateAt({}).strategy, offensiveIdentity: 'ground-control' }, distance: 8 }))).toBe('rush')
  })
})
