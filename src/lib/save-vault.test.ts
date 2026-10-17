import { describe, expect, it } from 'vitest'
import { createCareerProgress } from '../career/progress'
import { createOperationsPlan } from '../operations/plan'
import { makeSaveBundle, NAMED_SAVE_SLOTS, parseSaveBundle, summarizeSaveSlot } from './save-vault'

const profile = { name: 'Alex', avatarId: 'sideline-command' as const, nationality: 'Brasil', difficulty: 'Equilibrada' as const, philosophy: 'Ataque equilibrado' as const, reduceMotion: false }

describe('cofre de save', () => {
  it('aceita um bundle completo e rejeita arquivos sem o contrato mínimo', () => {
    const bundle = makeSaveBundle(profile, { seasonId: 'NFL_2026_2026-10-11', franchiseId: null }, createCareerProgress(profile), createOperationsPlan())

    expect(parseSaveBundle(JSON.stringify(bundle))).toEqual(bundle)
    expect(parseSaveBundle('{"schemaVersion":1}')).toBeNull()
    expect(parseSaveBundle('arquivo inválido')).toBeNull()
  })

  it('resume um slot nomeado sem expor dados esportivos adicionais', () => {
    const career = createCareerProgress(profile)
    const bundle = makeSaveBundle(profile, { seasonId: 'NFL_2026_2026-10-11', franchiseId: null }, { ...career, xp: 415, developmentWeek: { number: 3, completedCheckpoints: ['training'] } }, createOperationsPlan())
    const saved = summarizeSaveSlot(NAMED_SAVE_SLOTS[0], bundle)
    const empty = summarizeSaveSlot(NAMED_SAVE_SLOTS[1], null)

    expect(saved).toMatchObject({ id: 'slot-1', hasSave: true, coachName: 'Alex', level: 3, developmentWeek: 3 })
    expect(empty).toMatchObject({ id: 'slot-2', hasSave: false, exportedAt: null })
  })
})
