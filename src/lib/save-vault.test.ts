import { describe, expect, it } from 'vitest'
import { createCareerProgress } from '../career/progress'
import { createOperationsPlan } from '../operations/plan'
import { makeSaveBundle, parseSaveBundle } from './save-vault'

const profile = { name: 'Alex', avatarId: 'sideline-command' as const, nationality: 'Brasil', difficulty: 'Equilibrada' as const, philosophy: 'Ataque equilibrado' as const, reduceMotion: false }

describe('cofre de save', () => {
  it('aceita um bundle completo e rejeita arquivos sem o contrato mínimo', () => {
    const bundle = makeSaveBundle(profile, { seasonId: 'NFL_2026_2026-10-11', franchiseId: null }, createCareerProgress(profile), createOperationsPlan())

    expect(parseSaveBundle(JSON.stringify(bundle))).toEqual(bundle)
    expect(parseSaveBundle('{"schemaVersion":1}')).toBeNull()
    expect(parseSaveBundle('arquivo inválido')).toBeNull()
  })
})
