import type {
  DefensiveIdentity,
  OffensiveIdentity,
  OperationsEntry,
  OperationsEntryKind,
  OperationsPlan,
  ScoutingFocus,
  TrainingFocus,
} from '../domain/contracts'

export const OPERATIONS_PLAN_KEY = 'vale-gridiron-manager:operations-plan:v1'

const limit = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value))

function entry(kind: OperationsEntryKind, title: string, detail: string): OperationsEntry {
  return { id: `${kind}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`, kind, title, detail }
}

export function createOperationsPlan(): OperationsPlan {
  return {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    offensiveIdentity: 'balanced',
    defensiveIdentity: 'contain',
    aggression: 55,
    trainingFocus: 'execution',
    practiceIntensity: 55,
    readiness: 54,
    fatigueRisk: 22,
    chemistry: 50,
    scoutingFocus: 'best-available',
    scoutingInsight: 8,
    facilityPriority: 'analysis',
    operatingReserve: 70,
    collegePhase: 'recruiting',
    proPhase: 'evaluation',
    entries: [entry('training', 'Plano inicial pronto', 'O plano do usuário usa parâmetros de simulação, sem ratings ou identidades de atletas não importados.')],
  }
}

export function loadOperationsPlan(): OperationsPlan {
  try {
    const saved = window.localStorage.getItem(OPERATIONS_PLAN_KEY)
    if (!saved) return createOperationsPlan()
    const parsed = JSON.parse(saved) as Partial<OperationsPlan>
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.entries)) return createOperationsPlan()
    return { ...createOperationsPlan(), ...parsed, entries: parsed.entries }
  } catch {
    return createOperationsPlan()
  }
}

export function saveOperationsPlan(plan: OperationsPlan) {
  window.localStorage.setItem(OPERATIONS_PLAN_KEY, JSON.stringify(plan))
}

function update(plan: OperationsPlan, changes: Partial<OperationsPlan>): OperationsPlan {
  return { ...plan, ...changes, updatedAt: new Date().toISOString() }
}

function withEntry(plan: OperationsPlan, nextEntry: OperationsEntry, changes: Partial<OperationsPlan> = {}): OperationsPlan {
  return update(plan, { ...changes, entries: [nextEntry, ...plan.entries].slice(0, 8) })
}

export function setTacticalPlan(
  plan: OperationsPlan,
  values: Pick<OperationsPlan, 'offensiveIdentity' | 'defensiveIdentity' | 'aggression'>,
): OperationsPlan {
  return update(plan, { ...values, aggression: limit(values.aggression, 25, 85) })
}

export function setTrainingPlan(
  plan: OperationsPlan,
  values: Pick<OperationsPlan, 'trainingFocus' | 'practiceIntensity'>,
): OperationsPlan {
  return update(plan, { ...values, practiceIntensity: limit(values.practiceIntensity, 20, 90) })
}

export function runTrainingSession(plan: OperationsPlan): OperationsPlan {
  const intensity = plan.practiceIntensity
  const focusChanges: Record<TrainingFocus, Pick<OperationsPlan, 'readiness' | 'fatigueRisk' | 'chemistry'>> = {
    recovery: { readiness: 8, fatigueRisk: -10, chemistry: 1 },
    execution: { readiness: 6, fatigueRisk: 3, chemistry: 3 },
    conditioning: { readiness: 4, fatigueRisk: 8, chemistry: 2 },
    cohesion: { readiness: 3, fatigueRisk: 1, chemistry: 8 },
  }
  const effect = focusChanges[plan.trainingFocus]
  const intensityShift = Math.round((intensity - 55) / 9)
  const nextReadiness = limit(plan.readiness + effect.readiness + (plan.trainingFocus === 'recovery' ? -intensityShift : intensityShift))
  const nextFatigue = limit(plan.fatigueRisk + effect.fatigueRisk + Math.max(0, intensityShift))
  const nextChemistry = limit(plan.chemistry + effect.chemistry)
  return withEntry(
    plan,
    entry('training', `Sessão: ${trainingFocusLabel(plan.trainingFocus)}`, `Prontidão ${nextReadiness}, risco de fadiga ${nextFatigue} e química ${nextChemistry}. Modelo interno de simulação.`),
    { readiness: nextReadiness, fatigueRisk: nextFatigue, chemistry: nextChemistry },
  )
}

export function runScoutingCycle(plan: OperationsPlan): OperationsPlan {
  const insightGain = plan.scoutingFocus === 'best-available' ? 5 : 8
  const reserveCost = plan.scoutingFocus === 'best-available' ? 3 : 5
  const nextInsight = limit(plan.scoutingInsight + insightGain)
  const nextReserve = limit(plan.operatingReserve - reserveCost)
  return withEntry(
    plan,
    entry('scouting', `Scouting: ${scoutingFocusLabel(plan.scoutingFocus)}`, `Insight ${nextInsight}/100. Nenhum atleta foi criado; a fila espera fontes verificadas.`),
    { scoutingInsight: nextInsight, operatingReserve: nextReserve },
  )
}

export function setScoutingFocus(plan: OperationsPlan, scoutingFocus: ScoutingFocus): OperationsPlan {
  return update(plan, { scoutingFocus })
}

export function setFacilityPriority(plan: OperationsPlan, facilityPriority: OperationsPlan['facilityPriority']): OperationsPlan {
  const detailByPriority: Record<OperationsPlan['facilityPriority'], string> = {
    medical: 'Prioridade médica reduz o risco de fadiga no próximo planejamento.',
    performance: 'Prioridade de performance eleva a preparação, com custo de recuperação.',
    analysis: 'Prioridade analítica amplifica a leitura tática e de scouting.',
  }
  return withEntry(plan, entry('facility', `Instalações: ${facilityPriority}`, detailByPriority[facilityPriority]), { facilityPriority })
}

export function setOperatingReserve(plan: OperationsPlan, operatingReserve: number): OperationsPlan {
  return update(plan, { operatingReserve: limit(operatingReserve, 10, 95) })
}

export function setCollegePhase(plan: OperationsPlan, collegePhase: OperationsPlan['collegePhase']): OperationsPlan {
  return withEntry(plan, entry('college', `Ciclo universitário: ${collegePhase}`, 'A etapa é navegável, mas recruiting, portal e elegibilidade permanecem sem atletas/universidades até a importação de dados.'), { collegePhase })
}

export function setProPhase(plan: OperationsPlan, proPhase: OperationsPlan['proPhase']): OperationsPlan {
  return withEntry(plan, entry('pro', `Ciclo profissional: ${proPhase}`, 'A etapa organiza a operação. Free agency, trades, waivers e contratos de atletas ficam bloqueados sem contratos importados.'), { proPhase })
}

export function offensiveIdentityLabel(value: OffensiveIdentity) {
  return { balanced: 'Equilíbrio situacional', 'air-raid': 'Ataque aéreo', 'ground-control': 'Controle terrestre' }[value]
}

export function defensiveIdentityLabel(value: DefensiveIdentity) {
  return { contain: 'Contenção', pressure: 'Pressão', coverage: 'Cobertura' }[value]
}

export function trainingFocusLabel(value: TrainingFocus) {
  return { recovery: 'Recuperação', execution: 'Execução', conditioning: 'Condicionamento', cohesion: 'Química' }[value]
}

export function scoutingFocusLabel(value: ScoutingFocus) {
  return { quarterback: 'Quarterback', line: 'Linhas', secondary: 'Secundária', 'best-available': 'Melhor disponível' }[value]
}
