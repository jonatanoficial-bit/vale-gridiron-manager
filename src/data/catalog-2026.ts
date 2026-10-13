import type {
  CalendarMilestone,
  CareerScenario,
  CompetitionCoverageReport,
  FranchiseCatalogEntry,
  LeagueSnapshot,
  RightsAssetManifestEntry,
  RuleSetContract,
  SourceReference,
} from '../domain/contracts'

export const CATALOG_CUTOFF = '2026-10-11'

export const SOURCES_2026: SourceReference[] = [
  {
    id: 'nfl-teams',
    label: 'NFL · franquias oficiais',
    url: 'https://www.nfl.com/teams/',
    scope: 'Identidade e agrupamento das 32 franquias NFL.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'nfl-rosters-2026',
    label: 'NFL · rosters 2026',
    url: 'https://www.nfl.com/sitemap/html/rosters/2026/',
    scope: 'Entrada registrada para importação de roster por temporada.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'nfl-roster-buffalo-2026',
    label: 'NFL · roster 2026 do Buffalo Bills',
    url: 'https://www.nfl.com/teams/buffalo-bills/roster',
    scope: 'Roster publicado do Buffalo Bills, importado em snapshot separado do Lote 03.',
    sourceAsOfDate: '2026-10-13',
  },
  {
    id: 'bills-coaching-staff-2026',
    label: 'Buffalo Bills · comissão técnica 2026',
    url: 'https://www.buffalobills.com/team/coaches-roster/',
    scope: 'Head coach e coordenadores publicados pelo clube para 2026.',
    sourceAsOfDate: '2026-10-13',
  },
  {
    id: 'bills-joe-brady-contract-2026',
    label: 'Buffalo Bills · acordo de Joe Brady',
    url: 'https://www.buffalobills.com/news/joe-brady-agrees-to-terms-to-be-the-next-buffalo-bills-head-coach',
    scope: 'Duração publicada do acordo do head coach em 2026; salário não divulgado.',
    sourceAsOfDate: '2026-10-13',
  },
  {
    id: 'nfl-schedule-2026',
    label: 'NFL · agenda regular',
    url: 'https://www.nfl.com/schedules?seasonType=REG',
    scope: 'Entrada registrada para importação de fixtures por temporada.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'nfl-schedule-rules',
    label: 'NFL Football Operations · formato de agenda',
    url: 'https://operations.nfl.com/calendar-events/nfl-schedule/making-the-schedule',
    scope: 'Regras estruturais de temporada, agenda e playoffs.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'nfl-standings',
    label: 'NFL · classificação',
    url: 'https://www.nfl.com/standings/',
    scope: 'Conferências, divisões e classificação oficial.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'ncaa-membership',
    label: 'NCAA · diretório de membros',
    url: 'https://www.ncaa.org/about-us/membership-directory/',
    scope: 'Fonte registrada para instituições FBS/FCS e conferências por temporada.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'ncaa-football-sponsorship',
    label: 'NCAA · patrocínio esportivo',
    url: 'https://www.ncaa.org/about-us/membership-directory/membership-composition-and-sport-sponsorship/',
    scope: 'Validação de programa universitário que efetivamente disputa football.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'ncaa-fbs-stats',
    label: 'NCAA · estatísticas FBS',
    url: 'https://www.ncaa.com/stats/football/fbs',
    scope: 'Fonte registrada para a etapa posterior de conferência de dados FBS.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'cfp-2026',
    label: 'College Football Playoff',
    url: 'https://collegefootballplayoff.com/',
    scope: 'Formato do College Football Playoff 2026–27.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'ufl-vision-2026',
    label: 'UFL · visão e mercados 2026',
    url: 'https://www.theufl.com/news/united-football-league-announces-new-vision-2026',
    scope: 'Identidades, mercados, estádios e formato da UFL 2026.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'ufl-schedule-2026',
    label: 'UFL · agenda completa 2026',
    url: 'https://www.theufl.com/news/ufl-announces-2026-full-season-schedule',
    scope: 'Agenda, temporada regular e pós-temporada UFL 2026.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
  {
    id: 'ufl-on-fox-lineup-2026',
    label: 'UFL on FOX · lineup de escudos 2026',
    url: 'https://pbs.twimg.com/media/G2qra3UbIAMIk9w.jpg',
    scope: 'Arte publicada com os oito escudos do lineup UFL 2026, preservada sem alteração.',
    sourceAsOfDate: CATALOG_CUTOFF,
  },
]

export const LEAGUE_SNAPSHOTS_2026: LeagueSnapshot[] = [
  {
    leagueId: 'nfl',
    leagueName: 'National Football League',
    seasonId: 'NFL_2026_2026-10-11',
    seasonYear: 2026,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    providerSourceIds: ['nfl-teams', 'nfl-rosters-2026', 'nfl-schedule-2026', 'nfl-schedule-rules', 'nfl-standings'],
    rulesetId: 'ruleset-nfl-2026',
    coverageStatus: 'partial',
  },
  {
    leagueId: 'ncaa-fbs',
    leagueName: 'NCAA Division I FBS',
    seasonId: 'NCAA_FBS_2026_2026-10-11',
    seasonYear: 2026,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    providerSourceIds: ['ncaa-membership', 'ncaa-football-sponsorship', 'ncaa-fbs-stats', 'cfp-2026'],
    rulesetId: 'ruleset-ncaa-fbs-2026',
    coverageStatus: 'pending',
  },
  {
    leagueId: 'ncaa-fcs',
    leagueName: 'NCAA Division I FCS',
    seasonId: 'NCAA_FCS_2026_2026-10-11',
    seasonYear: 2026,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    providerSourceIds: ['ncaa-membership', 'ncaa-football-sponsorship'],
    rulesetId: 'ruleset-ncaa-fcs-2026',
    coverageStatus: 'pending',
  },
  {
    leagueId: 'ufl',
    leagueName: 'United Football League',
    seasonId: 'UFL_2026_2026-10-11',
    seasonYear: 2026,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    providerSourceIds: ['ufl-vision-2026', 'ufl-schedule-2026'],
    rulesetId: 'ruleset-ufl-2026',
    coverageStatus: 'partial',
  },
]

type NflDivisionMap = Record<'East' | 'North' | 'South' | 'West', readonly string[]>

const nflDivisions: Record<'AFC' | 'NFC', NflDivisionMap> = {
  AFC: {
    East: ['Buffalo Bills', 'Miami Dolphins', 'New England Patriots', 'New York Jets'],
    North: ['Baltimore Ravens', 'Cincinnati Bengals', 'Cleveland Browns', 'Pittsburgh Steelers'],
    South: ['Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Tennessee Titans'],
    West: ['Denver Broncos', 'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers'],
  },
  NFC: {
    East: ['Dallas Cowboys', 'New York Giants', 'Philadelphia Eagles', 'Washington Commanders'],
    North: ['Chicago Bears', 'Detroit Lions', 'Green Bay Packers', 'Minnesota Vikings'],
    South: ['Atlanta Falcons', 'Carolina Panthers', 'New Orleans Saints', 'Tampa Bay Buccaneers'],
    West: ['Arizona Cardinals', 'Los Angeles Rams', 'San Francisco 49ers', 'Seattle Seahawks'],
  },
}

function createId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const nflLogoCodes: Record<string, string> = {
  'Arizona Cardinals': 'ari', 'Atlanta Falcons': 'atl', 'Carolina Panthers': 'car', 'Chicago Bears': 'chi',
  'Dallas Cowboys': 'dal', 'Detroit Lions': 'det', 'Green Bay Packers': 'gb', 'Los Angeles Rams': 'lar',
  'Minnesota Vikings': 'min', 'New Orleans Saints': 'no', 'New York Giants': 'nyg', 'Philadelphia Eagles': 'phi',
  'San Francisco 49ers': 'sf', 'Seattle Seahawks': 'sea', 'Tampa Bay Buccaneers': 'tb', 'Washington Commanders': 'was',
  'Baltimore Ravens': 'bal', 'Buffalo Bills': 'buf', 'Cincinnati Bengals': 'cin', 'Cleveland Browns': 'cle',
  'Denver Broncos': 'den', 'Houston Texans': 'hou', 'Indianapolis Colts': 'ind', 'Jacksonville Jaguars': 'jax',
  'Kansas City Chiefs': 'kc', 'Las Vegas Raiders': 'lv', 'Los Angeles Chargers': 'lac', 'Miami Dolphins': 'mia',
  'New England Patriots': 'ne', 'New York Jets': 'nyj', 'Pittsburgh Steelers': 'pit', 'Tennessee Titans': 'ten',
}

const uflLogoSpritePositions: Record<string, string> = {
  'Birmingham Stallions': '-14px -67px', 'Columbus Aviators': '-80px -67px', 'Dallas Renegades': '-145px -67px',
  'Houston Gamblers': '-14px -133px', 'Louisville Kings': '-80px -133px', 'DC Defenders': '-145px -133px',
  'Orlando Storm': '-49px -199px', 'St. Louis Battlehawks': '-114px -199px',
}

const snapshot = (leagueId: 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs') => LEAGUE_SNAPSHOTS_2026.find((item) => item.leagueId === leagueId)!

export const NFL_2026_FRANCHISES: FranchiseCatalogEntry[] = (Object.entries(nflDivisions) as Array<['AFC' | 'NFC', NflDivisionMap]>).flatMap(
  ([conference, conferenceDivisions]) => (Object.entries(conferenceDivisions) as Array<[FranchiseCatalogEntry['division'], readonly string[]]>).flatMap(
    ([division, franchises]) => franchises.map((name) => ({
      id: `nfl-${createId(name)}`,
      name,
      leagueId: 'nfl' as const,
      conference,
      division,
      seasonId: snapshot('nfl').seasonId,
      sourceAsOfDate: CATALOG_CUTOFF,
      contentRightsStatus: 'pending' as const,
      sourceIds: ['nfl-teams', 'nfl-standings'],
      identificationStatus: 'ready' as const,
      rosterStatus: 'pending' as const,
      staffStatus: 'pending' as const,
      scheduleStatus: 'pending' as const,
      mediaStatus: 'pending' as const,
      officialLogo: {
        assetId: `nfl-${nflLogoCodes[name]}-logo-2026`,
        path: `/assets-real/nfl/${nflLogoCodes[name]}.png`,
        sourceId: 'nfl-teams',
      },
    })),
  ),
)

const uflTeams = [
  'Birmingham Stallions',
  'Columbus Aviators',
  'Dallas Renegades',
  'DC Defenders',
  'Houston Gamblers',
  'Louisville Kings',
  'Orlando Storm',
  'St. Louis Battlehawks',
]

export const UFL_2026_FRANCHISES: FranchiseCatalogEntry[] = uflTeams.map((name) => ({
  id: `ufl-${createId(name)}`,
  name,
  leagueId: 'ufl',
  conference: null,
  division: null,
  seasonId: snapshot('ufl').seasonId,
  sourceAsOfDate: CATALOG_CUTOFF,
  contentRightsStatus: 'pending',
  sourceIds: ['ufl-vision-2026', 'ufl-schedule-2026'],
  identificationStatus: 'ready',
  rosterStatus: 'pending',
  staffStatus: 'pending',
  scheduleStatus: 'partial',
  mediaStatus: 'pending',
  officialLogo: {
    assetId: `ufl-${createId(name)}-logo-2026`,
    path: '/assets-real/ufl/lineup-2026.jpg',
    sourceId: 'ufl-on-fox-lineup-2026',
    spritePosition: uflLogoSpritePositions[name],
    spriteSize: '224px 280px',
  },
}))

export const RIGHTS_ASSET_MANIFEST_2026: RightsAssetManifestEntry[] = [...NFL_2026_FRANCHISES, ...UFL_2026_FRANCHISES].flatMap((team) => team.officialLogo ? [{
  assetId: team.officialLogo.assetId,
  assetType: 'team-logo' as const,
  subjectId: team.id,
  seasonId: team.seasonId,
  sourceId: team.officialLogo.sourceId,
  path: team.officialLogo.path,
  contentRightsStatus: team.contentRightsStatus,
  attribution: team.leagueId === 'nfl' ? 'Arquivo oficial publicado pela NFL.' : 'Lineup oficial UFL on FOX de 2026.',
}] : [])

export const CALENDAR_MILESTONES_2026: CalendarMilestone[] = [
  {
    id: 'ufl-opening-2026',
    leagueId: 'ufl',
    label: 'Abertura UFL',
    dateLabel: '27 MAR 2026',
    detail: 'Início da temporada regular de 10 semanas.',
    seasonId: snapshot('ufl').seasonId,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    sourceId: 'ufl-schedule-2026',
    importStatus: 'ready',
  },
  {
    id: 'ufl-playoffs-2026',
    leagueId: 'ufl',
    label: 'Playoffs UFL',
    dateLabel: '07 JUN 2026',
    detail: 'Duas partidas de playoffs após a temporada regular.',
    seasonId: snapshot('ufl').seasonId,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    sourceId: 'ufl-schedule-2026',
    importStatus: 'ready',
  },
  {
    id: 'ufl-championship-2026',
    leagueId: 'ufl',
    label: 'UFL Championship',
    dateLabel: '13 JUN 2026',
    detail: 'Decisão da temporada UFL 2026.',
    seasonId: snapshot('ufl').seasonId,
    sourceAsOfDate: CATALOG_CUTOFF,
    contentRightsStatus: 'pending',
    sourceId: 'ufl-schedule-2026',
    importStatus: 'ready',
  },
]

export const RULESETS_2026: RuleSetContract[] = [
  {
    id: 'ruleset-nfl-2026',
    leagueId: 'nfl',
    seasonId: snapshot('nfl').seasonId,
    displayName: 'NFL · 2026',
    facts: ['32 franquias em AFC e NFC', '4 divisões por conferência', '17 jogos por equipe em 18 semanas', '7 classificados por conferência para os playoffs'],
    sourceIds: ['nfl-schedule-rules', 'nfl-standings'],
    coverageStatus: 'partial',
  },
  {
    id: 'ruleset-ncaa-fbs-2026',
    leagueId: 'ncaa-fbs',
    seasonId: snapshot('ncaa-fbs').seasonId,
    displayName: 'NCAA FBS · 2026',
    facts: ['College Football Playoff 2026–27 com formato de 12 equipes', 'Conferências e calendários exigem importação por snapshot'],
    sourceIds: ['ncaa-membership', 'ncaa-football-sponsorship', 'cfp-2026'],
    coverageStatus: 'partial',
  },
  {
    id: 'ruleset-ncaa-fcs-2026',
    leagueId: 'ncaa-fcs',
    seasonId: snapshot('ncaa-fcs').seasonId,
    displayName: 'NCAA FCS · 2026',
    facts: ['Estrutura de conferências, agenda e playoffs próprios', 'Nenhuma instituição entra sem confirmar o programa de football'],
    sourceIds: ['ncaa-membership', 'ncaa-football-sponsorship'],
    coverageStatus: 'pending',
  },
  {
    id: 'ruleset-ufl-2026',
    leagueId: 'ufl',
    seasonId: snapshot('ufl').seasonId,
    displayName: 'UFL · 2026',
    facts: ['8 equipes em liga única', '10 semanas de temporada regular', '4 equipes avançam aos playoffs', '43 partidas: 40 regulares, 2 playoffs e 1 Championship'],
    sourceIds: ['ufl-vision-2026', 'ufl-schedule-2026'],
    coverageStatus: 'ready',
  },
]

export const CAREER_SCENARIOS_2026: CareerScenario[] = [
  {
    id: 'college-fcs-entry',
    label: 'Entrada universitária · FCS',
    leagueId: 'ncaa-fcs',
    status: 'pending',
    requirement: 'Aguardando o catálogo de instituições e vagas reais verificadas.',
  },
  {
    id: 'college-fbs-path',
    label: 'Progressão universitária · FBS',
    leagueId: 'ncaa-fbs',
    status: 'pending',
    requirement: 'Aguardando conferências, instituições e staff do snapshot.',
  },
  {
    id: 'ufl-bridge',
    label: 'Ponte profissional · UFL',
    leagueId: 'ufl',
    status: 'partial',
    requirement: 'Identidades e calendário-base prontos; vagas dependem de coaches reais.',
  },
  {
    id: 'nfl-destination',
    label: 'Destino profissional · NFL',
    leagueId: 'nfl',
    status: 'partial',
    requirement: 'Franquias e estrutura prontas; roster, staff e vagas serão importados no Lote 03.',
  },
]

export const COVERAGE_REPORTS_2026: CompetitionCoverageReport[] = [
  {
    leagueId: 'nfl',
    snapshotId: snapshot('nfl').seasonId,
    label: 'NFL · 32 franquias',
    sourceIds: ['nfl-teams', 'nfl-rosters-2026', 'nfl-schedule-2026', 'nfl-standings'],
    metrics: [
      { field: 'identificação', completed: 32, expected: 32, status: 'ready' },
      { field: 'rosters', completed: 0, expected: 32, status: 'pending' },
      { field: 'técnicos', completed: 0, expected: 32, status: 'pending' },
      { field: 'jogos', completed: 0, expected: 272, status: 'pending' },
      { field: 'uniformes', completed: 0, expected: 32, status: 'pending' },
      { field: 'faces', completed: 0, expected: 32, status: 'pending' },
      { field: 'contratos', completed: 0, expected: 32, status: 'pending' },
    ],
  },
  {
    leagueId: 'ncaa-fbs',
    snapshotId: snapshot('ncaa-fbs').seasonId,
    label: 'NCAA FBS · importação por temporada',
    sourceIds: ['ncaa-membership', 'ncaa-football-sponsorship', 'ncaa-fbs-stats', 'cfp-2026'],
    metrics: [
      { field: 'identificação', completed: 0, expected: 0, status: 'pending' },
      { field: 'rosters', completed: 0, expected: 0, status: 'pending' },
      { field: 'técnicos', completed: 0, expected: 0, status: 'pending' },
      { field: 'jogos', completed: 0, expected: 0, status: 'pending' },
      { field: 'uniformes', completed: 0, expected: 0, status: 'pending' },
      { field: 'faces', completed: 0, expected: 0, status: 'pending' },
      { field: 'contratos', completed: 0, expected: 0, status: 'pending' },
    ],
  },
  {
    leagueId: 'ncaa-fcs',
    snapshotId: snapshot('ncaa-fcs').seasonId,
    label: 'NCAA FCS · importação por temporada',
    sourceIds: ['ncaa-membership', 'ncaa-football-sponsorship'],
    metrics: [
      { field: 'identificação', completed: 0, expected: 0, status: 'pending' },
      { field: 'rosters', completed: 0, expected: 0, status: 'pending' },
      { field: 'técnicos', completed: 0, expected: 0, status: 'pending' },
      { field: 'jogos', completed: 0, expected: 0, status: 'pending' },
      { field: 'uniformes', completed: 0, expected: 0, status: 'pending' },
      { field: 'faces', completed: 0, expected: 0, status: 'pending' },
      { field: 'contratos', completed: 0, expected: 0, status: 'pending' },
    ],
  },
  {
    leagueId: 'ufl',
    snapshotId: snapshot('ufl').seasonId,
    label: 'UFL · 8 equipes',
    sourceIds: ['ufl-vision-2026', 'ufl-schedule-2026'],
    metrics: [
      { field: 'identificação', completed: 8, expected: 8, status: 'ready' },
      { field: 'rosters', completed: 0, expected: 8, status: 'pending' },
      { field: 'técnicos', completed: 0, expected: 8, status: 'pending' },
      { field: 'jogos', completed: 3, expected: 43, status: 'partial' },
      { field: 'uniformes', completed: 0, expected: 8, status: 'pending' },
      { field: 'faces', completed: 0, expected: 8, status: 'pending' },
      { field: 'contratos', completed: 0, expected: 8, status: 'pending' },
    ],
  },
]

export function getSource(sourceId: string) {
  return SOURCES_2026.find((source) => source.id === sourceId)
}

export function findFranchise(id: string | null) {
  return [...NFL_2026_FRANCHISES, ...UFL_2026_FRANCHISES].find((franchise) => franchise.id === id) ?? null
}
