import type { ContentCoverage } from '../domain/contracts'

export const CONTENT_COVERAGE: ContentCoverage = {
  catalogLabel: 'CATÁLOGO 2026 · ESTRUTURA INICIAL',
  completedFields: 0,
  totalFields: 5,
  sourceMessage: 'Este repositório declara a estrutura de conteúdo, sem apresentar clubes, atletas, técnicos, logos ou calendários que ainda não tenham sido importados e verificados.',
  layers: [
    { name: 'Estrutura de ligas e competições', status: 'pending', nextAction: 'Inventário factual no Lote 02' },
    { name: 'Franquias, universidades e calendários', status: 'pending', nextAction: 'Importar por snapshot e fonte' },
    { name: 'Elencos, técnicos e atributos de simulação', status: 'pending', nextAction: 'Catálogo real no Lote 03' },
    { name: 'Assets visuais e manifesto de direitos', status: 'pending', nextAction: 'Registrar ativos autorizados' },
    { name: 'Contratos de dados versionados', status: 'ready', nextAction: 'Base criada neste Lote 01' },
  ],
}
