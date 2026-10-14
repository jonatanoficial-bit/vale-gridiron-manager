import { describe, expect, it } from 'vitest'
import { completeCareerObjective, createCareerProgress } from './progress'

const profile = { name: 'Alex', avatarId: 'sideline-command' as const, nationality: 'Brasil', difficulty: 'Equilibrada' as const, philosophy: 'Ataque equilibrado' as const, reduceMotion: false }

describe('progresso de carreira do Lote 06', () => {
  it('cria apenas o treinador do usuário, sem clube, vaga ou contrato inventado', () => {
    const progress = createCareerProgress(profile)
    expect(progress).toMatchObject({ userCoachId: 'user-coach-alex-v1', currentClubId: null, xp: 100, reputation: 0 })
    expect(progress.inbox.some((message) => /vagas verificadas: nenhuma/i.test(message.title))).toBe(true)
  })

  it('recompensa uma meta uma única vez e mantém um registro no inbox', () => {
    const progress = createCareerProgress(profile)
    const completed = completeCareerObjective(progress, 'catalog-review')
    expect(completed.xp).toBe(135)
    expect(completed.reputation).toBe(2)
    expect(completed.objectives.find((item) => item.id === 'catalog-review')?.state).toBe('complete')
    expect(completeCareerObjective(completed, 'catalog-review')).toEqual(completed)
  })
})
