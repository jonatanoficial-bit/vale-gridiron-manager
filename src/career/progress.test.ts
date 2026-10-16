import { describe, expect, it } from 'vitest'
import { completeCareerDevelopmentWeek, completeCareerObjective, createCareerProgress, normalizeCareerProgress, registerCareerCheckpoint } from './progress'

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

  it('só fecha o ciclo local após treino, scouting e partida, sem criar uma rodada oficial', () => {
    const progress = createCareerProgress(profile)
    const training = registerCareerCheckpoint(progress, 'training')
    const duplicateTraining = registerCareerCheckpoint(training, 'training')
    const scouting = registerCareerCheckpoint(duplicateTraining, 'scouting')
    const incomplete = completeCareerDevelopmentWeek(scouting)
    const match = registerCareerCheckpoint(scouting, 'match')
    const completed = completeCareerDevelopmentWeek(match)

    expect(duplicateTraining).toEqual(training)
    expect(incomplete).toEqual(scouting)
    expect(completed).toMatchObject({ xp: 160, reputation: 1, developmentWeek: { number: 2, completedCheckpoints: [] } })
    expect(completed.inbox[0].body).toMatch(/não representa uma temporada/i)
  })

  it('migra um dossiê anterior sem apagar sessões ou objetivos', () => {
    const previous = createCareerProgress(profile)
    const legacy = { ...previous, gameSessions: 3 } as Omit<typeof previous, 'developmentWeek'>
    delete (legacy as Partial<typeof previous>).developmentWeek
    const migrated = normalizeCareerProgress(legacy as typeof previous)

    expect(migrated.gameSessions).toBe(3)
    expect(migrated.developmentWeek).toEqual({ number: 1, completedCheckpoints: [] })
    expect(migrated.objectives).toEqual(previous.objectives)
  })
})
