import type { ContentCoverage } from '../domain/contracts'

export const CONTENT_COVERAGE: ContentCoverage = {
  catalogLabel: 'LOTE 09 · CENTRO DE FUTEBOL ATIVO',
  completedFields: 6,
  totalFields: 13,
  sourceMessage: 'NFL e UFL têm identificação estrutural registrada. O Buffalo Bills ganhou um roster 2026 auditável e quatro cargos de comissão técnica; o motor, a transmissão 2D, o dossiê e o Centro de Futebol operam sem inventar vagas, contratos ou dados de atletas pendentes.',
  layers: [
    { name: 'NFL · 32 franquias e divisões', status: 'ready', nextAction: 'Identificação por fonte e snapshot registrada' },
    { name: 'UFL · 8 equipes e marcos 2026', status: 'partial', nextAction: 'Completar 43 fixtures e dados de staff' },
    { name: 'NCAA FBS/FCS · universidades e conferências', status: 'pending', nextAction: 'Importar diretórios por temporada, sem criar instituições' },
    { name: 'RuleSets separados por competição', status: 'partial', nextAction: 'Detalhar regulamentos versionados antes do motor' },
    { name: 'Elencos e técnicos · Buffalo Bills 2026', status: 'partial', nextAction: '77 linhas de roster e 4 cargos importados; replicar para as demais franquias' },
    { name: 'Contratos e atributos de simulação', status: 'partial', nextAction: 'Acordo de 5 anos do head coach registrado; valores, contratos de atletas e ratings permanecem pendentes' },
    { name: 'Assets visuais e manifesto de direitos', status: 'partial', nextAction: 'Escudos registrados; retratos, uniformes e estádios aguardam autorização e manifesto' },
    { name: 'SimEngine e EventLog', status: 'partial', nextAction: 'Baseline neutro determinístico pronto; integrar RuleSets completos e ratings verificáveis' },
    { name: 'Transmissão tática 2D', status: 'partial', nextAction: 'Canvas funcional com marcadores neutros; integrar escalações e assets autorizados' },
    { name: 'Carreira do técnico do usuário', status: 'partial', nextAction: 'Dossiê, XP, inbox e objetivos locais prontos; vagas, contratos e entrevistas exigem snapshots verificáveis' },
    { name: 'Universidade · recruiting, portal e elegibilidade', status: 'partial', nextAction: 'Pipeline e bloqueios implementados; importar instituições, prospects, atletas e regras por temporada' },
    { name: 'Profissional · cap, mercado e offseason', status: 'partial', nextAction: 'Ciclo operacional implementado; importar contratos, cap hits, fixtures e transações verificadas' },
    { name: 'Tática, treino, scouting e gestão', status: 'partial', nextAction: 'Plano local altera o SimEngine; conectar ratings, staff e economia apenas quando tiverem fonte' },
  ],
}
