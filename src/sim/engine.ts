import type { GameEvent, GameEventType, GameSetup, GameState, PlayCall } from './types'

export const GAME_QUARTER_MS = 15 * 60 * 1000

const neutralStrategy: GameState['strategy'] = {
  offensiveIdentity: 'balanced',
  defensiveIdentity: 'contain',
  aggression: 55,
  readiness: 50,
  fatigueRisk: 20,
  chemistry: 50,
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function normalizeStrategy(strategy?: GameSetup['strategy']): GameState['strategy'] {
  return {
    ...neutralStrategy,
    ...strategy,
    aggression: clamp(strategy?.aggression ?? neutralStrategy.aggression, 25, 85),
    readiness: clamp(strategy?.readiness ?? neutralStrategy.readiness, 0, 100),
    fatigueRisk: clamp(strategy?.fatigueRisk ?? neutralStrategy.fatigueRisk, 0, 100),
    chemistry: clamp(strategy?.chemistry ?? neutralStrategy.chemistry, 0, 100),
  }
}

function hasCustomStrategy(strategy: GameState['strategy']) {
  return strategy.offensiveIdentity !== neutralStrategy.offensiveIdentity
    || strategy.defensiveIdentity !== neutralStrategy.defensiveIdentity
    || strategy.aggression !== neutralStrategy.aggression
    || strategy.readiness !== neutralStrategy.readiness
    || strategy.fatigueRisk !== neutralStrategy.fatigueRisk
    || strategy.chemistry !== neutralStrategy.chemistry
}

function strategyText(strategy: GameState['strategy']) {
  const offense = strategy.offensiveIdentity === 'air-raid' ? 'ataque aéreo' : strategy.offensiveIdentity === 'ground-control' ? 'controle terrestre' : 'equilíbrio situacional'
  const defense = strategy.defensiveIdentity === 'pressure' ? 'pressão' : strategy.defensiveIdentity === 'coverage' ? 'cobertura' : 'contenção'
  return `Plano tático ativo · ${offense}, ${defense}, agressividade ${strategy.aggression}.`
}

function preparationDelta(state: GameState) {
  return (state.strategy.readiness - 50) * 0.002 + (state.strategy.chemistry - 50) * 0.0014 - state.strategy.fatigueRisk * 0.0012
}

function hashSeed(seed: string) {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function random(state: GameState) {
  const nextState = (Math.imul(state.randomState, 1664525) + 1013904223) >>> 0
  return { state: { ...state, randomState: nextState }, value: nextState / 4294967296 }
}

function firstAndTenText(down: number, distance: number) {
  return `${down}ª & ${distance}`
}

function addEvent(state: GameState, type: GameEventType, text: string, options: Pick<GameEvent, 'teamId' | 'yards' | 'scoreDelta'>) {
  const event: GameEvent = {
    id: `${state.gameId}-${state.eventNumber + 1}`,
    sequence: state.eventNumber + 1,
    type,
    teamId: options.teamId,
    period: state.period,
    clockMs: state.gameClockMs,
    text,
    ...(options.yards === undefined ? {} : { yards: options.yards }),
    ...(options.scoreDelta === undefined ? {} : { scoreDelta: options.scoreDelta }),
  }
  return { ...state, eventNumber: event.sequence, events: [...state.events, event] }
}

function addScore(state: GameState, teamId: string, points: number) {
  return teamId === state.homeTeamId
    ? { ...state, homeScore: state.homeScore + points }
    : { ...state, awayScore: state.awayScore + points }
}

function switchPossession(state: GameState, ballSpot = 25): GameState {
  return {
    ...state,
    offenseId: state.defenseId,
    defenseId: state.offenseId,
    direction: state.direction === 'right' ? 'left' : 'right',
    ballSpot,
    down: 1,
    distance: 10,
  }
}

function finishClock(state: GameState, elapsedMs: number) {
  let next = { ...state, gameClockMs: Math.max(0, state.gameClockMs - elapsedMs) }
  if (next.gameClockMs > 0) return next
  if (next.period === 4) return addEvent({ ...next, status: 'final' }, 'end-game', 'Fim de jogo · protótipo determinístico encerrado.', { teamId: null })
  next = addEvent(next, 'end-quarter', `Fim do ${next.period}º quarto.`, { teamId: null })
  return { ...next, period: next.period + 1, gameClockMs: GAME_QUARTER_MS }
}

function changeDown(state: GameState) {
  if (state.down === 4) {
    const turn = addEvent(state, 'turnover-on-downs', 'Turnover on downs.', { teamId: state.offenseId })
    return switchPossession(turn, Math.max(5, Math.min(95, 100 - state.ballSpot)))
  }
  return { ...state, down: state.down + 1 }
}

function resolveGain(state: GameState, type: 'run' | 'pass-complete' | 'sack', yards: number) {
  const teamId = state.offenseId
  const nextSpot = state.ballSpot + yards
  const action = addEvent(state, type, type === 'run' ? `Corrida neutra para ${yards} jardas.` : type === 'sack' ? `Sack para ${yards} jardas.` : `Passe completo para ${yards} jardas.`, { teamId, yards })
  if (nextSpot >= 100) {
    let next = addScore({ ...action, ballSpot: 100 }, teamId, 6)
    next = addEvent(next, 'touchdown', 'Touchdown.', { teamId, scoreDelta: 6 })
    const extra = random(next)
    next = extra.state
    if (extra.value < 0.94) {
      next = addScore(next, teamId, 1)
      next = addEvent(next, 'extra-point-good', 'Ponto extra convertido.', { teamId, scoreDelta: 1 })
    }
    return switchPossession(next)
  }
  if (yards >= state.distance) return { ...action, ballSpot: Math.max(1, nextSpot), down: 1, distance: 10 }
  return changeDown({ ...action, ballSpot: Math.max(1, nextSpot), distance: Math.max(1, state.distance - yards) })
}

function shortPass(state: GameState) {
  const teamId = state.offenseId
  let draw = random(state)
  let next = addEvent(draw.state, 'snap', `Snap · ${firstAndTenText(state.down, state.distance)}.`, { teamId })
  const preparation = preparationDelta(state)
  const aggressionRisk = (state.strategy.aggression - 55) * 0.0007
  const identityBonus = state.strategy.offensiveIdentity === 'air-raid' ? 0.032 : state.strategy.offensiveIdentity === 'ground-control' ? -0.018 : 0
  if (draw.value < clamp(0.055 + aggressionRisk - preparation * 0.25, 0.025, 0.11)) {
    next = addEvent(next, 'interception', 'Passe interceptado.', { teamId })
    return switchPossession(next, Math.max(5, Math.min(95, 100 - state.ballSpot)))
  }
  if (draw.value < clamp(0.14 - preparation * 0.32 + (state.strategy.defensiveIdentity === 'pressure' ? 0.01 : 0), 0.08, 0.21)) {
    draw = random(next)
    return resolveGain(draw.state, 'sack', -(3 + Math.floor(draw.value * 6)))
  }
  if (draw.value < clamp(0.43 - identityBonus - preparation, 0.31, 0.5)) return changeDown(addEvent(next, 'pass-incomplete', 'Passe incompleto.', { teamId }))
  draw = random(next)
  const yardsBonus = state.strategy.offensiveIdentity === 'air-raid' ? 3 : 0
  return resolveGain(draw.state, 'pass-complete', 3 + yardsBonus + Math.floor(draw.value * 15))
}

function rush(state: GameState) {
  const snap = addEvent(state, 'snap', `Snap · ${firstAndTenText(state.down, state.distance)}.`, { teamId: state.offenseId })
  const draw = random(snap)
  const preparation = preparationDelta(state)
  const groundBonus = state.strategy.offensiveIdentity === 'ground-control' ? 3 : state.strategy.offensiveIdentity === 'air-raid' ? -1 : 0
  return resolveGain(draw.state, 'run', -2 + groundBonus + Math.floor(draw.value * 13) + Math.round(preparation * 3))
}

function punt(state: GameState) {
  const teamId = state.offenseId
  const snap = addEvent(state, 'snap', `Snap · ${firstAndTenText(state.down, state.distance)}.`, { teamId })
  const draw = random(snap)
  const yards = 36 + Math.floor(draw.value * 19)
  const event = addEvent(draw.state, 'punt', `Punt de ${yards} jardas; posse muda de lado.`, { teamId, yards })
  return switchPossession(event, Math.max(8, Math.min(92, 100 - (state.ballSpot + yards - 8))))
}

function fieldGoal(state: GameState) {
  const teamId = state.offenseId
  const snap = addEvent(state, 'snap', `Snap · field goal tentado.`, { teamId })
  const draw = random(snap)
  const chance = Math.max(0.38, 0.94 - Math.max(0, 85 - state.ballSpot) * 0.012)
  if (draw.value < chance) {
    let next = addScore(draw.state, teamId, 3)
    next = addEvent(next, 'field-goal-good', 'Field goal convertido.', { teamId, scoreDelta: 3 })
    return switchPossession(next)
  }
  const missed = addEvent(draw.state, 'field-goal-missed', 'Field goal não convertido.', { teamId })
  return switchPossession(missed, Math.max(8, Math.min(92, 100 - state.ballSpot)))
}

export function createGame(setup: GameSetup): GameState {
  const opening = setup.homeTeamId
  const receiving = setup.awayTeamId
  const strategy = normalizeStrategy(setup.strategy)
  const state: GameState = {
    gameId: setup.gameId,
    engineVersion: hasCustomStrategy(strategy) ? 'lot-09-strategy-v1' : 'lot-04-neutral-v1',
    seed: setup.seed,
    randomState: hashSeed(setup.seed),
    homeTeamId: setup.homeTeamId,
    awayTeamId: setup.awayTeamId,
    period: 1,
    gameClockMs: setup.quarterMs ?? GAME_QUARTER_MS,
    homeScore: 0,
    awayScore: 0,
    offenseId: receiving,
    defenseId: opening,
    direction: 'right',
    ballSpot: 25,
    down: 1,
    distance: 10,
    strategy,
    eventNumber: 0,
    status: 'in-progress',
    events: [],
  }
  const kickoff = addEvent(state, 'kickoff', 'Kickoff inicial · posse visitante.', { teamId: receiving })
  return hasCustomStrategy(strategy) ? addEvent(kickoff, 'kickoff', strategyText(strategy), { teamId: null }) : kickoff
}

export function resolvePlay(state: GameState, call: PlayCall): GameState {
  if (state.status === 'final') return state
  const before = state.eventNumber
  const next = call === 'short-pass' ? shortPass(state) : call === 'rush' ? rush(state) : call === 'punt' ? punt(state) : fieldGoal(state)
  const elapsed = 18_000 + ((next.randomState >>> 8) % 20) * 1_000
  const timed = finishClock(next, elapsed)
  return timed.eventNumber === before ? state : timed
}

function chooseAiPlay(state: GameState): PlayCall {
  if (state.down === 4 && state.ballSpot >= 58 && state.distance <= 5) return 'field-goal'
  if (state.down === 4 && state.ballSpot < 58) return 'punt'
  const next = random(state)
  const passThreshold = state.strategy.offensiveIdentity === 'air-raid' ? 0.38 : state.strategy.offensiveIdentity === 'ground-control' ? 0.67 : 0.52
  return next.value > passThreshold ? 'short-pass' : 'rush'
}

export function simulateToEnd(state: GameState): GameState {
  let next = state
  let safety = 0
  while (next.status === 'in-progress' && safety < 420) {
    next = resolvePlay(next, chooseAiPlay(next))
    safety += 1
  }
  return next.status === 'final' ? next : addEvent({ ...next, status: 'final', gameClockMs: 0 }, 'end-game', 'Fim de jogo por limite de segurança do protótipo.', { teamId: null })
}
