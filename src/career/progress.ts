import type { CareerCheckpointId, CareerInboxMessage, CareerObjective, CareerProgress, CoachProfile } from '../domain/contracts'

export const CAREER_PROGRESS_KEY = 'vale-gridiron-manager:career-progress:v1'

const CHECKPOINTS: CareerCheckpointId[] = ['training', 'scouting', 'match']

function initialDevelopmentWeek() {
  return { number: 1, completedCheckpoints: [] as CareerCheckpointId[] }
}

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
      id: 'football-plan',
      label: 'Montar o primeiro plano de jogo',
      detail: 'Defina identidade, carga de treino e foco de scouting no Centro de Futebol antes de buscar oportunidades.',
      rewardXp: 50,
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
    gameSessions: 0,
    developmentWeek: initialDevelopmentWeek(),
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
    return normalizeCareerProgress(parsed as CareerProgress)
  } catch {
    return null
  }
}

export function normalizeCareerProgress(progress: CareerProgress): CareerProgress {
  const withSessions = { ...progress, gameSessions: typeof progress.gameSessions === 'number' ? progress.gameSessions : 0 }
  const completedCheckpoints = Array.isArray(progress.developmentWeek?.completedCheckpoints)
    ? progress.developmentWeek.completedCheckpoints.filter((checkpoint): checkpoint is CareerCheckpointId => CHECKPOINTS.includes(checkpoint as CareerCheckpointId))
    : []
  const withWeek = {
    ...withSessions,
    developmentWeek: {
      number: typeof progress.developmentWeek?.number === 'number' && progress.developmentWeek.number > 0 ? progress.developmentWeek.number : 1,
      completedCheckpoints,
    },
  }
  if (withWeek.objectives.some((objective) => objective.id === 'football-plan')) return withWeek
  return { ...withWeek, objectives: [...withWeek.objectives, initialObjectives().find((objective) => objective.id === 'football-plan')!] }
}

export function saveCareerProgress(progress: CareerProgress) {
  window.localStorage.setItem(CAREER_PROGRESS_KEY, JSON.stringify(progress))
}

export function clearCareerProgress() {
  window.localStorage.removeItem(CAREER_PROGRESS_KEY)
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
    'football-plan': {
      category: 'career',
      title: 'Plano de jogo validado',
      body: 'Seu plano local foi registrado como uma etapa de desenvolvimento. A conquista não gera vaga ou proposta sem fonte verificada.',
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

export function registerCareerGameSession(progress: CareerProgress): CareerProgress {
  const nextSessions = progress.gameSessions + 1
  const bonusXp = 25
  const milestone = nextSessions % 5 === 0
  return {
    ...progress,
    gameSessions: nextSessions,
    xp: progress.xp + bonusXp,
    reputation: progress.reputation + (milestone ? 1 : 0),
    inbox: [{
      id: `career-game-session-${nextSessions}`,
      category: 'career',
      title: milestone ? 'Marco de preparação atingido' : 'Sessão tática concluída',
      body: milestone
        ? `${nextSessions} sessões táticas registradas. Você ganhou ${bonusXp} XP e 1 ponto de reputação no perfil do usuário.`
        : `A transmissão foi concluída e registrada no seu dossiê local. Você ganhou ${bonusXp} XP de desenvolvimento.`,
      read: false,
    }, ...progress.inbox],
  }
}

const checkpointCopy: Record<CareerCheckpointId, Omit<CareerInboxMessage, 'id' | 'read'>> = {
  training: {
    category: 'career',
    title: 'Treino registrado no ciclo',
    body: 'A sessão do plano local foi marcada na semana de desenvolvimento. Isso não cria atletas, clube ou calendário oficial.',
  },
  scouting: {
    category: 'career',
    title: 'Scouting registrado no ciclo',
    body: 'A leitura do mercado foi marcada na semana de desenvolvimento. O insight segue sem gerar prospects ou propostas.',
  },
  match: {
    category: 'career',
    title: 'Partida tática registrada no ciclo',
    body: 'A transmissão concluída foi marcada na semana de desenvolvimento. O placar não é anexado a uma competição real.',
  },
}

export function registerCareerCheckpoint(progress: CareerProgress, checkpoint: CareerCheckpointId): CareerProgress {
  if (progress.developmentWeek.completedCheckpoints.includes(checkpoint)) return progress
  return {
    ...progress,
    developmentWeek: {
      ...progress.developmentWeek,
      completedCheckpoints: [...progress.developmentWeek.completedCheckpoints, checkpoint],
    },
    inbox: [{ id: `career-week-${progress.developmentWeek.number}-${checkpoint}`, ...checkpointCopy[checkpoint], read: false }, ...progress.inbox],
  }
}

export function completeCareerDevelopmentWeek(progress: CareerProgress): CareerProgress {
  if (!CHECKPOINTS.every((checkpoint) => progress.developmentWeek.completedCheckpoints.includes(checkpoint))) return progress
  const completedWeek = progress.developmentWeek.number
  return {
    ...progress,
    xp: progress.xp + 60,
    reputation: progress.reputation + 1,
    developmentWeek: { number: completedWeek + 1, completedCheckpoints: [] },
    inbox: [{
      id: `career-week-${completedWeek}-complete`,
      category: 'career',
      title: `Semana de desenvolvimento ${completedWeek} concluída`,
      body: 'Você ganhou 60 XP e 1 ponto de reputação pelo ciclo local completo. A recompensa não representa uma temporada, ranking ou emprego real.',
      read: false,
    }, ...progress.inbox],
  }
}

export function unreadCareerMessages(progress: CareerProgress) {
  return progress.inbox.filter((message) => !message.read).length
}
