import type { ContentCoverage } from '../domain/contracts'

export const CONTENT_COVERAGE: ContentCoverage = {
  catalogLabel: 'LOTE 02 · CATÁLOGO 2026 EM ANDAMENTO',
  completedFields: 2,
  totalFields: 4,
  sourceMessage: 'NFL e UFL têm identificação estrutural registrada por snapshot. FBS/FCS, rosters, técnicos, fixtures completos e mídia permanecem explicitamente pendentes de importação e conferência por campo.',
  layers: [
    { name: 'NFL · 32 franquias e divisões', status: 'ready', nextAction: 'Identificação por fonte e snapshot registrada' },
    { name: 'UFL · 8 equipes e marcos 2026', status: 'partial', nextAction: 'Completar 43 fixtures e dados de staff' },
    { name: 'NCAA FBS/FCS · universidades e conferências', status: 'pending', nextAction: 'Importar diretórios por temporada, sem criar instituições' },
    { name: 'RuleSets separados por competição', status: 'partial', nextAction: 'Detalhar regulamentos versionados antes do motor' },
    { name: 'Elencos, técnicos e atributos de simulação', status: 'pending', nextAction: 'Catálogo real no Lote 03' },
    { name: 'Assets visuais e manifesto de direitos', status: 'pending', nextAction: 'Registrar ativos autorizados' },
  ],
}
