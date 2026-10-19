import type { GameEvent, GameState } from './types'

export interface MatchDebriefFocus {
  label: string
  detail: string
}

export interface MatchDebrief {
  outcome: string
  context: string
  focus: MatchDebriefFocus
  moments: readonly GameEvent[]
}

function relevantMoments(events: readonly GameEvent[]) {
  const decisiveTypes = new Set<GameEvent['type']>(['touchdown', 'field-goal-good', 'interception', 'turnover-on-downs'])
  const moments = events.filter((event) => decisiveTypes.has(event.type))
  return moments.slice(-3).reverse()
}

function focusFor(state: GameState): MatchDebriefFocus {
  const turnovers = state.events.filter((event) => event.type === 'interception' || event.type === 'turnover-on-downs').length

  if (turnovers > 0) {
    return {
      label: 'PROTEÇÃO DA POSSE',
      detail: `${turnovers} virada${turnovers === 1 ? '' : 's'} de posse entrou no EventLog. Na próxima partida, use o modo Guiado para revisar descidas de risco antes de acelerar o piloto.`,
    }
  }

  if (Math.abs(state.homeScore - state.awayScore) <= 7) {
    return {
      label: 'MARGEM CONTROLADA',
      detail: 'A diferença final ficou dentro de uma posse. Revise as decisões de quarta descida no EventLog antes de alterar o plano tático.',
    }
  }

  if (state.strategy.offensiveIdentity === 'air-raid') {
    return {
      label: 'PLANO AÉREO TESTADO',
      detail: 'A partida usou a identidade aérea configurada no Centro de Futebol. Compare o EventLog com outra seed ou outro plano para avaliar a mudança.',
    }
  }

  if (state.strategy.offensiveIdentity === 'ground-control') {
    return {
      label: 'RITMO TERRESTRE TESTADO',
      detail: 'A partida usou a identidade de controle terrestre do plano local. O resultado continua sendo uma simulação neutra, sem ratings individuais.',
    }
  }

  return {
    label: 'PLANO EQUILIBRADO',
    detail: 'A identidade equilibrada foi mantida. Use o modo Estratégico para intervir apenas em red zone e quarta descida na próxima transmissão.',
  }
}

export function createMatchDebrief(state: GameState): MatchDebrief {
  const scoreDifference = Math.abs(state.homeScore - state.awayScore)
  const outcome = state.homeScore === state.awayScore
    ? 'PLACAR EMPATADO'
    : `MARGEM FINAL · ${scoreDifference} PONTO${scoreDifference === 1 ? '' : 'S'}`

  return {
    outcome,
    context: 'Relatório local derivado de eventos do SimEngine. Não representa estatísticas, desempenho ou resultado oficial de uma competição.',
    focus: focusFor(state),
    moments: relevantMoments(state.events),
  }
}
