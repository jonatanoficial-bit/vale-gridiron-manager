import { describe, expect, it } from 'vitest'
import { createOperationsPlan, runScoutingCycle, runTrainingSession, setTacticalPlan, setTrainingPlan } from './plan'

describe('centro de operações dos Lotes 07 a 09', () => {
  it('mantém um plano neutro, sem atleta, contrato ou vaga inventados', () => {
    const plan = createOperationsPlan()
    expect(plan.entries[0]?.detail).toMatch(/sem ratings ou identidades/i)
    expect(plan.scoutingInsight).toBe(8)
    expect(plan.operatingReserve).toBe(70)
  })

  it('faz treino e scouting produzirem diferenças mensuráveis no modelo local', () => {
    const base = setTrainingPlan(createOperationsPlan(), { trainingFocus: 'recovery', practiceIntensity: 40 })
    const trained = runTrainingSession(base)
    const scouted = runScoutingCycle(trained)
    expect(trained.readiness).toBeGreaterThan(base.readiness)
    expect(trained.fatigueRisk).toBeLessThan(base.fatigueRisk)
    expect(scouted.scoutingInsight).toBeGreaterThan(trained.scoutingInsight)
    expect(scouted.operatingReserve).toBeLessThan(trained.operatingReserve)
  })

  it('limita agressividade tática a uma faixa jogável', () => {
    const plan = setTacticalPlan(createOperationsPlan(), { offensiveIdentity: 'air-raid', defensiveIdentity: 'pressure', aggression: 100 })
    expect(plan.aggression).toBe(85)
  })
})
