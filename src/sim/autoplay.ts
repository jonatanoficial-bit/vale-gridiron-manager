import type { GameState, PlayCall } from './types'

export interface TacticalDecision {
  key: string
  title: string
  detail: string
  recommended: PlayCall
  alternatives: readonly PlayCall[]
}

export function playLabel(call: PlayCall) {
  const labels: Record<PlayCall, string> = {
    'short-pass': 'PASSE CURTO',
    rush: 'CORRIDA',
    punt: 'PUNT',
    'field-goal': 'FIELD GOAL',
  }
  return labels[call]
}

export function recommendAutoPlay(state: GameState): PlayCall {
  if (state.down === 4 && state.ballSpot >= 58 && state.distance <= 5) return 'field-goal'
  if (state.down === 4) return 'punt'
  if (state.distance <= 3) return state.strategy.offensiveIdentity === 'ground-control' ? 'rush' : 'short-pass'
  if (state.strategy.offensiveIdentity === 'air-raid') return 'short-pass'
  if (state.strategy.offensiveIdentity === 'ground-control') return 'rush'
  return state.distance >= 8 ? 'short-pass' : 'rush'
}

export function tacticalDecision(state: GameState): TacticalDecision | null {
  if (state.status === 'final') return null

  if (state.down === 4 && state.ballSpot >= 58) {
    return {
      key: `fourth-${state.period}-${state.gameClockMs}-${state.ballSpot}-${state.distance}`,
      title: 'QUARTA DESCIDA · DECISÃO DE PONTUAÇÃO',
      detail: 'O piloto pausou. Você pode garantir três pontos ou manter a campanha sob seu risco.',
      recommended: 'field-goal',
      alternatives: ['short-pass', 'rush'],
    }
  }

  if (state.down === 4) {
    return {
      key: `fourth-${state.period}-${state.gameClockMs}-${state.ballSpot}-${state.distance}`,
      title: 'QUARTA DESCIDA · GESTÃO DE CAMPO',
      detail: 'O piloto pausou. A chamada segura é devolver a posse; arriscar exige conversão.',
      recommended: 'punt',
      alternatives: ['short-pass', 'rush'],
    }
  }

  if (state.ballSpot >= 78 && state.down >= 3) {
    return {
      key: `red-zone-${state.period}-${state.gameClockMs}-${state.ballSpot}-${state.down}`,
      title: 'RED ZONE · CHAMADA CRÍTICA',
      detail: 'A defesa encurtou o campo. Escolha uma chamada ou deixe o assistente executar a leitura recomendada.',
      recommended: recommendAutoPlay(state),
      alternatives: ['short-pass', 'rush'],
    }
  }

  return null
}
