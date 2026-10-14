import type { CareerInboxMessage, CareerObjective, CareerProgress, CoachProfile } from '../domain/contracts'

export const CAREER_PROGRESS_KEY = 'vale-gridiron-manager:career-progress:v1'

function initialInbox(): CareerInboxMessage[] {
  return [
    {
      id: 'system-career-file',
      category: 'system',
      title: 'Dossiê de carreira disponível',
      body: 'Seu perfil de técnico pode ser registrado localmente. A trajetória não atribui clube, vaga ou contrato sem um snapshot confirmado.',
      read: false,
    },
    {
      id: 'coverage-openings',
      category: 'coverage',
      title: 'Vagas verificadas: nenhuma',
      body: 'Os snapshots atuais identificam clubes, mas não comprovam vagas abertas, termos de contrato ou processos de entrevista. O painel mantém esses itens bloqueados.',
      read: false,
    },
  ]
}

function initialObjectives(): CareerObjective[] {
  return [
    {
      id: 'profile-file',
      label: 'Dossiê do técnico',
      detail: 'Perfil local registrado para o treinador criado pelo usuário.',
      rewardXp: 100,
      rewardReputation: 0,
      state: 'complete',
    },
    {
      id: 'catalog-review',
      label: 'Revisar cobertura de vagas',
      detail: 'Consulte o inventário para distinguir identidades verificadas de vagas e contratos pendentes.',
      rewardXp: 35,
      rewardReputation: 2,
      state: 'active',
    },
    {
      id: 'match-review',
      label: 'Concluir análise de partida',
      detail: 'Registre uma partida tática finalizada pelo SimEngine. O resultado não cria vínculo com um clube real.',
      rewardXp: 80,
      rewardReputation: 4,
      state: 'active',
    },
  ]
}

export function createCareerProgress(profile: CoachProfile): CareerProgress {
  const profileKey = profile.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'local'
  return {
    id: 'career-save-local-v1',
    schemaVersion: 1,
    userCoachId: `user-coach-${profileKey}-v1`,
    currentClubId: null,
    createdAt: new Date().toISOString(),
    xp: 100,
    reputation: 0,
    objectives: initialObjectives(),
    inbox: initialInbox(),
  }
}

export function loadCareerProgress(): CareerProgress | null {
  try {
    const saved = window.localStorage.getItem(CAREER_PROGRESS_KEY)
    if (!saved) return null
    const parsed = JSON.parse(saved) as Partial<CareerProgress>
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.objectives) || !Array.isArray(parsed.inbox)) return null
    return parsed as CareerProgress
  } catch {
    return null
  }
}

export function saveCareerProgress(progress: CareerProgress) {
  window.localStorage.setItem(CAREER_PROGRESS_KEY, JSON.stringify(progress))
}

function completionMessage(objective: CareerObjective): CareerInboxMessage {
  const messages: Record<CareerObjective['id'], Omit<CareerInboxMessage, 'id' | 'read'>> = {
    'profile-file': {
      category: 'career',
      title: 'Perfil registrado',
      body: 'O dossiê do técnico foi criado no save local.',
    },
    'catalog-review': {
      category: 'coverage',
      title: 'Cobertura revisada',
      body: 'A leitura foi registrada. Nenhuma vaga ou contrato foi criado a partir de dados pendentes.',
    },
    'match-review': {
      category: 'career',
      title: 'Análise de partida registrada',
      body: 'A sessão tática foi vinculada ao seu desenvolvimento como usuário, sem atribuir resultado a um clube, atleta ou vaga real.',
    },
  }
  return { id: `career-${objective.id}-complete`, ...messages[objective.id], read: false }
}

export function completeCareerObjective(progress: CareerProgress, objectiveId: CareerObjective['id']): CareerProgress {
  const objective = progress.objectives.find((item) => item.id === objectiveId)
  if (!objective || objective.state !== 'active') return progress
  const completedObjective = { ...objective, state: 'complete' as const }
  return {
    ...progress,
    xp: progress.xp + objective.rewardXp,
    reputation: progress.reputation + objective.rewardReputation,
    objectives: progress.objectives.map((item) => item.id === objectiveId ? completedObjective : item),
    inbox: [completionMessage(objective), ...progress.inbox],
  }
}

export function unreadCareerMessages(progress: CareerProgress) {
  return progress.inbox.filter((message) => !message.read).length
}
