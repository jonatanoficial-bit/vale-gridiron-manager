import { useEffect, useMemo, useState } from 'react'
import { CONTENT_COVERAGE } from './data/content-status'
import {
  CALENDAR_MILESTONES_2026,
  CAREER_SCENARIOS_2026,
  COVERAGE_REPORTS_2026,
  findFranchise,
  LEAGUE_SNAPSHOTS_2026,
  NFL_2026_FRANCHISES,
  RULESETS_2026,
  SOURCES_2026,
  UFL_2026_FRANCHISES,
} from './data/catalog-2026'
import {
  BILLS_2026_ROSTER,
  BILLS_2026_ROSTER_IMPORT,
  BILLS_2026_STAFF,
  BILLS_2026_STAFF_CONTRACTS,
  LOTE_03_NFL_SNAPSHOT,
  ROSTER_COVERAGE_2026,
  positionGroups,
} from './data/roster-2026'
import type { CatalogSelection, CoachProfile, GameMode, Route } from './domain/contracts'
import { loadCatalogSelection, loadCoachProfile, saveCatalogSelection, saveCoachProfile } from './lib/persistence'
import './App.css'

const routes: Record<Route, string> = {
  inicio: '#/',
  carreira: '#/carreira',
  temporada: '#/temporada',
  elenco: '#/elenco',
  jogoUnico: '#/jogo-unico',
  banco: '#/banco-de-dados',
  configuracoes: '#/configuracoes',
}

const routeLabels: Record<Route, string> = {
  inicio: 'Início',
  carreira: 'Carreira',
  temporada: 'Temporada',
  elenco: 'Elenco',
  jogoUnico: 'Jogo único',
  banco: 'Banco de dados',
  configuracoes: 'Ajustes',
}

function getRouteFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/carreira') return 'carreira'
  if (hash === '#/temporada') return 'temporada'
  if (hash === '#/elenco') return 'elenco'
  if (hash === '#/jogo-unico') return 'jogoUnico'
  if (hash === '#/banco-de-dados') return 'banco'
  if (hash === '#/configuracoes') return 'configuracoes'
  return 'inicio'
}

function navigate(route: Route) {
  window.location.hash = routes[route]
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromHash)
  const [profile, setProfile] = useState<CoachProfile>(loadCoachProfile)
  const [catalogSelection, setCatalogSelection] = useState<CatalogSelection>(loadCatalogSelection)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const coverageLabel = useMemo(
    () => `${CONTENT_COVERAGE.completedFields}/${CONTENT_COVERAGE.totalFields} campos verificados`,
    [],
  )

  function persistProfile() {
    saveCoachProfile(profile)
    setLastSaved('Perfil salvo neste navegador')
  }

  function persistCatalogSelection(nextSelection: CatalogSelection) {
    setCatalogSelection(nextSelection)
    saveCatalogSelection(nextSelection)
    setLastSaved('Cenário do catálogo salvo neste navegador')
  }

  function handleNavigation(nextRoute: Route) {
    navigate(nextRoute)
    setRoute(nextRoute)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <TopBar route={route} onNavigate={handleNavigation} lastSaved={lastSaved} />

      <main id="conteudo" className="app-content">
        {route === 'inicio' && <Lobby onNavigate={handleNavigation} coverageLabel={coverageLabel} />}
        {route === 'carreira' && (
          <Career profile={profile} onChange={setProfile} onSave={persistProfile} onNavigate={handleNavigation} />
        )}
        {route === 'temporada' && <Sandbox selection={catalogSelection} onSave={persistCatalogSelection} onNavigate={handleNavigation} />}
        {route === 'elenco' && <RosterDatabase />}
        {route === 'jogoUnico' && <SingleGame selectedFranchiseId={catalogSelection.franchiseId} />}
        {route === 'banco' && <ContentDatabase />}
        {route === 'configuracoes' && <Settings profile={profile} onChange={setProfile} onSave={persistProfile} />}
      </main>

      <footer className="app-footer">
        <span>LOTES 01–03 · FUNDAÇÃO, CATÁLOGO E ELENCO</span>
        <span>VALE GRIDIRON MANAGER · protótipo independente</span>
        <span>{CONTENT_COVERAGE.catalogLabel}</span>
      </footer>
    </div>
  )
}

function TopBar({
  route,
  onNavigate,
  lastSaved,
}: {
  route: Route
  onNavigate: (route: Route) => void
  lastSaved: string | null
}) {
  const primaryNav: Array<{ route: Route; icon: string }> = [
    { route: 'inicio', icon: '⌂' },
    { route: 'carreira', icon: '♟' },
    { route: 'temporada', icon: '▦' },
    { route: 'elenco', icon: '♙' },
    { route: 'jogoUnico', icon: '◉' },
    { route: 'banco', icon: '▤' },
  ]

  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={() => onNavigate('inicio')} aria-label="Ir para o início">
        <img src="/brand/vale-gridiron-manager.png" alt="VALE GridIron Manager" />
      </button>
      <nav className="primary-nav" aria-label="Navegação principal">
        {primaryNav.map((item) => (
          <button
            className={`nav-item ${route === item.route ? 'is-active' : ''}`}
            key={item.route}
            onClick={() => onNavigate(item.route)}
            aria-current={route === item.route ? 'page' : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{routeLabels[item.route]}</span>
          </button>
        ))}
      </nav>
      <div className="topbar-status" aria-live="polite">
        <span className="save-dot" aria-hidden="true" />
        <span>{lastSaved ?? 'Save local disponível'}</span>
        <button className="settings-button" onClick={() => onNavigate('configuracoes')} aria-label="Abrir ajustes">⚙</button>
      </div>
    </header>
  )
}

function Lobby({ onNavigate, coverageLabel }: { onNavigate: (route: Route) => void; coverageLabel: string }) {
  return (
    <section className="lobby-page">
      <div className="hero-grid" aria-labelledby="lobby-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse-dot" /> TEMPORADA DE ESTREIA · LOTE 03</p>
          <h1 id="lobby-title">CONSTRUA<br /><em>O SEU LEGADO.</em></h1>
          <p className="hero-lead">Uma fundação real para o manager de futebol americano: decisões, saves e modos de jogo começam aqui.</p>
          <div className="hero-actions">
            <button className="action-button primary" onClick={() => onNavigate('carreira')}>COMEÇAR CARREIRA <span>›</span></button>
            <button className="action-button secondary" onClick={() => onNavigate('banco')}>VER CATÁLOGO <span>↗</span></button>
          </div>
          <div className="integrity-note">
            <span className="integrity-icon" aria-hidden="true">✓</span>
            <span>Integridade de conteúdo: {coverageLabel}. Toda lacuna continua identificada como pendência.</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="stadium-lights light-left" />
          <div className="stadium-lights light-right" />
          <img className="hero-crest" src="/brand/vale-gridiron-manager.png" alt="" />
          <div className="field-lines" />
          <div className="hero-number">01</div>
        </div>
      </div>

      <div className="mode-strip" aria-label="Selecione um modo de jogo">
        <ModeCard number="01" title="Modo Carreira" text="Crie o perfil do técnico e acompanhe a evolução da sua trajetória." action="CRIAR TÉCNICO" mode="career" onClick={() => onNavigate('carreira')} />
        <ModeCard number="02" title="Temporada Sandbox" text="Explore snapshots e equipes reais que tenham identificação registrada." action="ABRIR SANDBOX" mode="season" onClick={() => onNavigate('temporada')} />
        <ModeCard number="03" title="Jogo Único" text="Monte o pré-jogo com clubes reais; o motor chega no Lote 04." action="CONFIGURAR JOGO" mode="game" onClick={() => onNavigate('jogoUnico')} />
      </div>

      <section className="foundation-grid" aria-label="Status da fundação">
        <FoundationPanel kicker="ROTAS" title="3 MODOS, 3 FLUXOS" value="ONLINE" description="Carreira, temporada sandbox e jogo único já possuem telas próprias e navegáveis." />
        <FoundationPanel kicker="SAVE LOCAL" title="PERFIL DO TÉCNICO" value="ATIVO" description="Rascunho persistente no navegador, pronto para evoluir para IndexedDB no Lote 11." />
        <FoundationPanel kicker="DADOS" title="ELENCO 2026" value="IMPORTANDO" description="O roster do Buffalo Bills foi auditado; os demais clubes preservam a pendência até sua própria fonte." warn />
      </section>
    </section>
  )
}

function ModeCard({ number, title, text, action, mode, onClick }: { number: string; title: string; text: string; action: string; mode: GameMode; onClick: () => void }) {
  return (
    <article className={`mode-card mode-${mode}`}>
      <div className="mode-card-head"><span>{number}</span><span className="mode-glyph" aria-hidden="true">{mode === 'career' ? '♟' : mode === 'season' ? '▦' : '◉'}</span></div>
      <h2>{title}</h2>
      <p>{text}</p>
      <button onClick={onClick}>{action} <span>›</span></button>
    </article>
  )
}

function FoundationPanel({ kicker, title, value, description, warn = false }: { kicker: string; title: string; value: string; description: string; warn?: boolean }) {
  return <article className="foundation-panel"><p>{kicker}</p><h2>{title}</h2><strong className={warn ? 'warning' : ''}>{value}</strong><span>{description}</span></article>
}

function Career({ profile, onChange, onSave, onNavigate }: { profile: CoachProfile; onChange: (profile: CoachProfile) => void; onSave: () => void; onNavigate: (route: Route) => void }) {
  return (
    <section className="route-page" aria-labelledby="career-title">
      <PageHeading eyebrow="MODO CARREIRA" title="SUA JORNADA COMEÇA AQUI" copy="Defina o perfil do técnico. A trilha FCS → FBS → UFL → NFL está registrada, e vagas reais só serão abertas quando cada snapshot tiver staff e elenco validados." />
      <div className="career-layout">
        <article className="profile-card panel">
          <div className="profile-avatar" aria-hidden="true">♟</div>
          <div><p className="eyebrow">PERFIL DO TÉCNICO</p><h2>{profile.name || 'Novo técnico'}</h2><span>Nível inicial · {profile.difficulty}</span></div>
          <div className="profile-progress"><span>PROGRESSO DA CARREIRA</span><div><i /></div><strong>0 XP</strong></div>
        </article>
        <form className="coach-form panel" onSubmit={(event) => { event.preventDefault(); onSave() }}>
          <div className="panel-heading"><span className="panel-icon">✦</span><div><p>CONFIGURAÇÃO</p><h2>CRIE SEU TÉCNICO</h2></div></div>
          <label>Nome do técnico<input value={profile.name} maxLength={40} onChange={(event) => onChange({ ...profile, name: event.target.value })} placeholder="Digite seu nome" /></label>
          <div className="form-row">
            <label>Nacionalidade<select value={profile.nationality} onChange={(event) => onChange({ ...profile, nationality: event.target.value })}><option>Brasil</option><option>Estados Unidos</option><option>Outro</option></select></label>
            <label>Dificuldade<select value={profile.difficulty} onChange={(event) => onChange({ ...profile, difficulty: event.target.value as CoachProfile['difficulty'] })}><option>Equilibrada</option><option>Desafiadora</option><option>Lenda</option></select></label>
          </div>
          <label>Filosofia inicial<select value={profile.philosophy} onChange={(event) => onChange({ ...profile, philosophy: event.target.value as CoachProfile['philosophy'] })}><option>Ataque equilibrado</option><option>Defesa agressiva</option><option>Controle de jogo</option></select></label>
          <button className="action-button primary full" type="submit">SALVAR PERFIL <span>✓</span></button>
        </form>
        <aside className="career-sidebar panel">
          <p className="eyebrow">PRÓXIMA ETAPA</p><h2>TRILHA DE CARREIRA</h2>
          <div className="pending-state"><span>!</span><div><strong>Vagas dependem de dados reais</strong><p>FBS/FCS aguardam importação. NFL e UFL já têm estrutura, mas coaches e rosters seguem no Lote 03.</p></div></div>
          <button className="text-button" onClick={() => onNavigate('banco')}>CONSULTAR COBERTURA DO CATÁLOGO <span>›</span></button>
        </aside>
      </div>
      <section className="timeline panel"><div className="panel-heading"><span className="panel-icon">◌</span><div><p>FLUXO PLANEJADO</p><h2>CICLO DA SEMANA</h2></div></div><ol>{['Caixa de entrada', 'Treino', 'Plano de jogo', 'Partida', 'Relatórios'].map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><p className="muted">Os itens acima definem a estrutura de navegação do Lote 01; o motor esportivo será desenvolvido no Lote 04.</p></section>
    </section>
  )
}

function Sandbox({ selection, onSave, onNavigate }: { selection: CatalogSelection; onSave: (selection: CatalogSelection) => void; onNavigate: (route: Route) => void }) {
  const selectableSnapshots = LEAGUE_SNAPSHOTS_2026.filter((snapshot) => snapshot.leagueId === 'nfl' || snapshot.leagueId === 'ufl')
  const activeSnapshot = selectableSnapshots.find((snapshot) => snapshot.seasonId === selection.seasonId) ?? selectableSnapshots[0]
  const clubs = activeSnapshot.leagueId === 'nfl' ? NFL_2026_FRANCHISES : UFL_2026_FRANCHISES
  const activeClub = findFranchise(selection.franchiseId)
  const snapshotStatus = activeSnapshot.coverageStatus === 'partial' ? 'PARCIAL' : 'PRONTO'

  function selectSnapshot(seasonId: string) {
    onSave({ seasonId, franchiseId: null })
  }

  return <section className="route-page" aria-labelledby="sandbox-title"><PageHeading eyebrow="TEMPORADA SANDBOX" title="CONFIGURE O SEU CENÁRIO" copy="Escolha uma competição e uma equipe real com identificação confirmada. O catálogo preserva o snapshot, a fonte e as lacunas sem fingir que roster, mídia ou fixtures já estão completos." /><div className="setup-layout"><article className="setup-steps panel"><p className="eyebrow">CONFIGURAÇÃO 01/03</p><h2>SELEÇÃO DE CATÁLOGO</h2><label>Competição<select value={activeSnapshot.seasonId} onChange={(event) => selectSnapshot(event.target.value)}>{selectableSnapshots.map((snapshot) => <option key={snapshot.seasonId} value={snapshot.seasonId}>{snapshot.leagueName} · {snapshot.seasonYear}</option>)}</select></label><label>Snapshot da temporada<select value={activeSnapshot.seasonId} onChange={(event) => selectSnapshot(event.target.value)}>{selectableSnapshots.map((snapshot) => <option key={snapshot.seasonId} value={snapshot.seasonId}>{snapshot.seasonId}</option>)}</select></label><label>Equipe real<select value={activeClub?.leagueId === activeSnapshot.leagueId ? selection.franchiseId ?? '' : ''} onChange={(event) => onSave({ seasonId: activeSnapshot.seasonId, franchiseId: event.target.value || null })}><option value="">Selecione uma equipe</option>{clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}</select></label><div className="inline-notice"><span>i</span><div><strong>{activeClub ? `${activeClub.name} selecionado` : 'Seleção ainda não concluída'}</strong><br />Roster, staff, uniforme e agenda completa continuam bloqueados até o snapshot correspondente ser importado.</div></div></article><aside className="setup-status panel"><p className="eyebrow">INTEGRIDADE DO SNAPSHOT</p><h2>{snapshotStatus}</h2><div className="status-meter"><span>Identificação de equipes</span><strong>100%</strong><div><i className="meter-full" /></div></div><div className="status-meter"><span>Regras estruturais</span><strong>{activeSnapshot.leagueId === 'ufl' ? '100%' : 'PARCIAL'}</strong><div><i className={activeSnapshot.leagueId === 'ufl' ? 'meter-full' : 'meter-partial'} /></div></div><div className="status-meter"><span>Fixtures e rosters</span><strong>PENDENTE</strong><div><i className="meter-empty" /></div></div><button className="action-button secondary full" onClick={() => onNavigate('banco')}>VER RELATÓRIO DE COBERTURA <span>↗</span></button></aside></div></section>
}

function SingleGame({ selectedFranchiseId }: { selectedFranchiseId: string | null }) {
  const clubs = [...NFL_2026_FRANCHISES, ...UFL_2026_FRANCHISES]
  const initialHome = findFranchise(selectedFranchiseId)?.id ?? clubs[0].id
  const initialAway = clubs.find((club) => club.id !== initialHome)?.id ?? clubs[1].id
  const [homeId, setHomeId] = useState(initialHome)
  const [awayId, setAwayId] = useState(initialAway)
  const home = findFranchise(homeId) ?? clubs[0]
  const away = findFranchise(awayId) ?? clubs[1]

  return <section className="route-page" aria-labelledby="single-title"><PageHeading eyebrow="JOGO ÚNICO" title="PREPARE A PARTIDA" copy="A seleção usa somente as equipes reais identificadas pelo Lote 02. O início da partida permanece bloqueado até que o SimEngine e os rosters sejam entregues, sem mostrar uma simulação de fachada." /><div className="single-game-board panel"><div className="matchup-row"><MatchSlot side="MANDANTE" franchise={home} value={homeId} onChange={setHomeId} clubs={clubs} /><div className="versus">VS<small>PRÉ-JOGO · LOTE 02</small></div><MatchSlot side="VISITANTE" franchise={away} value={awayId} onChange={setAwayId} clubs={clubs} /></div><div className="field-preview" aria-hidden="true"><div className="yard-lines" /><span>CAMPO DE JOGO</span><small>RENDER 2D · LOTE 05</small></div><div className="game-options"><div><span>REGRAS</span><strong>{home.leagueId === away.leagueId ? home.leagueId.toUpperCase() + ' 2026' : 'LIGAS DIFERENTES'}</strong></div><div><span>ESTÁDIO</span><strong>Catálogo de mídia pendente</strong></div><div><span>DURAÇÃO</span><strong>RuleSet ainda não executável</strong></div><button className="action-button primary" disabled>INICIAR NO LOTE 04 <span>›</span></button></div></div><div className="content-callout"><span>▤</span><div><strong>Pré-jogo funcional; simulação ainda não existe.</strong><p>Escolha equipes reais agora. A partida só será habilitada quando o motor determinístico e os elencos forem integrados.</p></div></div></section>
}

function TeamMark({ franchise }: { franchise: NonNullable<ReturnType<typeof findFranchise>> }) {
  const logo = franchise.officialLogo
  const fallback = franchise.name.split(' ').map((part) => part[0]).join('').slice(0, 3)

  if (!logo) {
    return <span className="team-mark team-mark-fallback" aria-label={`${franchise.name} · escudo pendente`}>{fallback}</span>
  }

  if (logo.spritePosition) {
    return <span className="team-mark team-mark-sprite" role="img" aria-label={`${franchise.name} · escudo publicado`} style={{ backgroundImage: `url(${logo.path})`, backgroundPosition: logo.spritePosition, backgroundSize: logo.spriteSize }} />
  }

  return <span className="team-mark"><img src={logo.path} alt={`${franchise.name} · escudo publicado`} /></span>
}

function MatchSlot({ side, franchise, value, onChange, clubs }: { side: string; franchise: NonNullable<ReturnType<typeof findFranchise>>; value: string; onChange: (id: string) => void; clubs: NonNullable<ReturnType<typeof findFranchise>>[] }) {
  return <div className="match-slot"><span>{side}</span><TeamMark franchise={franchise} /><strong>{franchise.name}</strong><small>{franchise.leagueId.toUpperCase()} · identidade verificada</small><label className="match-select"><span className="sr-only">Equipe {side.toLowerCase()}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}</select></label></div>
}

function ContentDatabase() {
  const [leagueFilter, setLeagueFilter] = useState<'all' | 'nfl' | 'ufl'>('all')
  const sourceById = new Map(SOURCES_2026.map((source) => [source.id, source]))
  const franchises = leagueFilter === 'nfl' ? NFL_2026_FRANCHISES : leagueFilter === 'ufl' ? UFL_2026_FRANCHISES : [...NFL_2026_FRANCHISES, ...UFL_2026_FRANCHISES]
  const reports = leagueFilter === 'all' ? COVERAGE_REPORTS_2026 : COVERAGE_REPORTS_2026.filter((report) => report.leagueId === leagueFilter)

  return <section className="route-page" aria-labelledby="database-title"><PageHeading eyebrow="BANCO DE DADOS · LOTE 02" title="INVENTÁRIO REAL 2026" copy="Cada registro mostra fonte, data de corte e cobertura por campo. O catálogo não preenche nenhuma ausência com universidades, atletas, técnicos, escudos ou uniformes fictícios." /><div className="coverage-hero panel"><div><p className="eyebrow">SNAPSHOTS REGISTRADOS</p><h2>{CONTENT_COVERAGE.catalogLabel}</h2><p>{CONTENT_COVERAGE.sourceMessage}</p><div className="snapshot-chips">{LEAGUE_SNAPSHOTS_2026.map((snapshot) => <span className={`status-chip ${snapshot.coverageStatus}`} key={snapshot.seasonId}>{snapshot.leagueName} · {snapshot.coverageStatus}</span>)}</div></div><div className="coverage-score"><strong>{CONTENT_COVERAGE.completedFields}<small>/{CONTENT_COVERAGE.totalFields}</small></strong><span>frentes estruturais</span></div></div><div className="coverage-table panel"><div className="table-head"><span>CAMADA</span><span>STATUS</span><span>PRÓXIMA AÇÃO</span></div>{CONTENT_COVERAGE.layers.map((layer) => <div className="table-row" key={layer.name}><strong>{layer.name}</strong><span className={`status-pill ${layer.status}`}>{layer.status === 'pending' ? 'PENDENTE' : layer.status === 'partial' ? 'PARCIAL' : 'PRONTO'}</span><span>{layer.nextAction}</span></div>)}</div><section className="catalog-section panel" aria-labelledby="franchises-title"><div className="section-heading"><div><p className="eyebrow">IDENTIFICAÇÃO VERIFICADA</p><h2 id="franchises-title">FRANQUIAS REGISTRADAS</h2></div><div className="catalog-filter" role="group" aria-label="Filtrar franquias"><button className={leagueFilter === 'all' ? 'is-selected' : ''} onClick={() => setLeagueFilter('all')}>TODAS ({NFL_2026_FRANCHISES.length + UFL_2026_FRANCHISES.length})</button><button className={leagueFilter === 'nfl' ? 'is-selected' : ''} onClick={() => setLeagueFilter('nfl')}>NFL (32)</button><button className={leagueFilter === 'ufl' ? 'is-selected' : ''} onClick={() => setLeagueFilter('ufl')}>UFL (8)</button></div></div><div className="franchise-grid">{franchises.map((franchise) => <article className="franchise-row" key={franchise.id}><div className="franchise-mark">{franchise.name.split(' ').map((part) => part[0]).join('').slice(0, 3)}</div><div><strong>{franchise.name}</strong><span>{franchise.leagueId.toUpperCase()} {franchise.conference ? `· ${franchise.conference} ${franchise.division}` : '· liga única 2026'}</span></div><span className="status-pill ready">ID</span><span className="franchise-source">{franchise.sourceIds.map((sourceId) => sourceById.get(sourceId)?.label.split(' · ')[0]).filter(Boolean).join(' · ')}</span></article>)}</div><p className="catalog-note">Identificação é a única camada completa neste painel. Escudos, uniformes, fotos, atletas, coaches e contratos não foram incluídos.</p></section><section className="rules-grid" aria-label="Regras por competição">{RULESETS_2026.map((ruleset) => <article className="ruleset-card panel" key={ruleset.id}><div className="ruleset-top"><span className={`status-pill ${ruleset.coverageStatus}`}>{ruleset.coverageStatus === 'ready' ? 'PRONTO' : ruleset.coverageStatus === 'partial' ? 'PARCIAL' : 'PENDENTE'}</span><small>{ruleset.seasonId}</small></div><h2>{ruleset.displayName}</h2><ul>{ruleset.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul><div className="source-links">{ruleset.sourceIds.map((sourceId) => { const source = sourceById.get(sourceId); return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer">FONTE ↗</a> : null })}</div></article>)}</section><section className="coverage-report panel" aria-labelledby="report-title"><div className="section-heading"><div><p className="eyebrow">RELATÓRIO POR CAMPO</p><h2 id="report-title">COBERTURA DO SNAPSHOT</h2></div><span className="cutoff-label">CORTE · 11 OUT 2026</span></div>{reports.map((report) => <article className="report-row" key={report.leagueId}><header><div><strong>{report.label}</strong><span>{report.snapshotId}</span></div><div className="report-sources">{report.sourceIds.map((sourceId) => { const source = sourceById.get(sourceId); return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.label}</a> : null })}</div></header><div className="metric-grid">{report.metrics.map((metric) => { const percent = metric.expected ? Math.round((metric.completed / metric.expected) * 100) : 0; return <div className="metric" key={metric.field}><div><span>{metric.field}</span><strong>{metric.expected ? `${metric.completed}/${metric.expected}` : 'aguardando'}</strong></div><div className="metric-track"><i className={metric.status} style={{ width: `${percent}%` }} /></div></div> })}</div></article>)}</section><section className="catalog-bottom-grid"><article className="calendar-card panel"><p className="eyebrow">CALENDÁRIO IMPORTADO</p><h2>UFL · MARCOS 2026</h2>{CALENDAR_MILESTONES_2026.map((milestone) => <div className="milestone" key={milestone.id}><strong>{milestone.dateLabel}</strong><div><span>{milestone.label}</span><small>{milestone.detail}</small></div></div>)}<p className="muted">A tabela completa de 43 jogos ainda não foi adicionada ao bundle; o relatório mantém essa diferença visível.</p></article><article className="career-card panel"><p className="eyebrow">CENÁRIOS DE CARREIRA</p><h2>CAMINHO SEM ATALHOS</h2>{CAREER_SCENARIOS_2026.map((scenario) => <div className="career-scenario" key={scenario.id}><span className={`status-pill ${scenario.status}`}>{scenario.status === 'partial' ? 'PARCIAL' : 'PENDENTE'}</span><div><strong>{scenario.label}</strong><p>{scenario.requirement}</p></div></div>)}</article></section><div className="data-principles"><article><span>01</span><h2>SEM IDENTIDADES FICTÍCIAS</h2><p>Times, atletas, técnicos, uniformes e logos só entram após o registro correspondente.</p></article><article><span>02</span><h2>SNAPSHOT VERSIONADO</h2><p>Cada entrada fixa liga, temporada, fonte, data de corte e o status de cobertura.</p></article><article><span>03</span><h2>MODELO ≠ DADO OFICIAL</h2><p>Ratings futuros serão parâmetros de simulação, jamais estatística oficial declarada.</p></article></div></section>
}

function Settings({ profile, onChange, onSave }: { profile: CoachProfile; onChange: (profile: CoachProfile) => void; onSave: () => void }) {
  return <section className="route-page" aria-labelledby="settings-title"><PageHeading eyebrow="AJUSTES" title="PREFERÊNCIAS LOCAIS" copy="As configurações abaixo pertencem ao protótipo do Lote 01 e ficam armazenadas apenas neste navegador." /><div className="settings-grid"><article className="panel"><p className="eyebrow">ACESSIBILIDADE</p><h2>EXPERIÊNCIA VISUAL</h2><label className="toggle-row"><span>Reduzir animações</span><input type="checkbox" checked={profile.reduceMotion} onChange={(event) => onChange({ ...profile, reduceMotion: event.target.checked })} /></label><p className="muted">A preferência será aplicada aos efeitos de transição quando a camada de movimento for adicionada.</p></article><article className="panel"><p className="eyebrow">PERSISTÊNCIA</p><h2>SAVE LOCAL</h2><p className="muted">O perfil usa localStorage neste lote. A migração para slots em IndexedDB está planejada para o Lote 11.</p><button className="action-button primary full" onClick={onSave}>SALVAR AGORA <span>✓</span></button></article></div></section>
}

function RosterDatabase() {
  const [positionFilter, setPositionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const coverage = ROSTER_COVERAGE_2026[0]
  const sourceById = new Map(SOURCES_2026.map((source) => [source.id, source]))
  const filteredPlayers = BILLS_2026_ROSTER.filter((player) => (positionFilter === 'all' || player.position === positionFilter) && (statusFilter === 'all' || player.rosterStatus === statusFilter))
  const rosterStatuses = [...new Set(BILLS_2026_ROSTER.map((player) => player.rosterStatus))].sort()

  function sourceLabel(sourceId: string) {
    return sourceById.get(sourceId)?.label ?? sourceId
  }

  function sourceUrl(sourceId: string) {
    return sourceById.get(sourceId)?.url ?? '#'
  }

  function heightLabel(heightIn: number) {
    return `${Math.floor(heightIn / 12)}'${heightIn % 12}"`
  }

  return (
    <section className="route-page roster-page" aria-labelledby="roster-title">
      <PageHeading eyebrow="ELENCO · LOTE 03" title="DADOS REAIS, SEM ATALHOS" copy="O primeiro import auditável cobre o Buffalo Bills no snapshot de 13 OUT 2026. A tela não sugere completude: contratos de atletas, retratos, uniformes, estádio e ratings continuam pendentes até existir fonte e autorização por campo." />

      <section className="roster-hero panel" aria-label="Resumo do snapshot importado">
        <img className="roster-team-logo" src="/assets-real/nfl/buf.png" alt="Buffalo Bills — escudo publicado" />
        <div>
          <p className="eyebrow">SNAPSHOT IMPORTADO</p>
          <h2>BUFFALO BILLS · NFL 2026</h2>
          <p>{LOTE_03_NFL_SNAPSHOT.id} · fonte consultada em {LOTE_03_NFL_SNAPSHOT.sourceAsOfDate}</p>
        </div>
        <div className="roster-hero-stat"><strong>{BILLS_2026_ROSTER_IMPORT.rowCount}</strong><span>LINHAS DE ROSTER</span></div>
        <div className="roster-hero-stat"><strong>{BILLS_2026_STAFF.length}</strong><span>CARGOS DE STAFF</span></div>
        <a className="action-button secondary roster-source-link" href={BILLS_2026_ROSTER_IMPORT.sourceUrl} target="_blank" rel="noreferrer">FONTE NFL ↗</a>
      </section>

      <section className="roster-integrity-grid" aria-label="Integridade do import">
        <article className="panel import-ledger">
          <p className="eyebrow">RASTREABILIDADE</p>
          <h2>IMPORTAÇÃO AUDITÁVEL</h2>
          <dl>
            <div><dt>Fonte</dt><dd><a href={BILLS_2026_ROSTER_IMPORT.sourceUrl} target="_blank" rel="noreferrer">{sourceLabel(BILLS_2026_ROSTER_IMPORT.sourceId)} ↗</a></dd></div>
            <div><dt>Checksum da fonte</dt><dd className="checksum">{BILLS_2026_ROSTER_IMPORT.sourceChecksum}</dd></div>
            <div><dt>Duplicatas</dt><dd>{BILLS_2026_ROSTER_IMPORT.duplicateCount} detectadas</dd></div>
            <div><dt>Estado</dt><dd><span className="status-pill ready">IMPORTADO</span></dd></div>
          </dl>
          <p className="muted">{BILLS_2026_ROSTER_IMPORT.notes}</p>
        </article>
        <article className="panel import-coverage">
          <p className="eyebrow">COBERTURA DO LOTE 03</p>
          <h2>O QUE EXISTE AGORA</h2>
          <div className="roster-metric-list">
            <div><span>Franquias NFL com roster importado</span><strong>1/32</strong></div>
            <div><span>Linhas de atletas do Bills</span><strong>{coverage.rosterRows}</strong></div>
            <div><span>Contratos de atletas / perfis de simulação</span><strong>{coverage.athleteContracts} / {coverage.simulationProfiles}</strong></div>
            <div><span>Retratos, uniformes e estádio</span><strong>{coverage.portraitAssets} / {coverage.uniformAssets} / {coverage.stadiumAssets}</strong></div>
          </div>
          <p className="muted">{coverage.notes}</p>
        </article>
      </section>

      <section className="roster-table-panel panel" aria-labelledby="roster-table-title">
        <div className="section-heading roster-section-heading">
          <div><p className="eyebrow">ELENCO PUBLICADO</p><h2 id="roster-table-title">ROSTER DO BUFFALO BILLS</h2></div>
          <div className="roster-filters">
            <label>Posição<select aria-label="Filtrar por posição" value={positionFilter} onChange={(event) => setPositionFilter(event.target.value)}><option value="all">TODAS</option>{positionGroups().map((position) => <option key={position} value={position}>{position}</option>)}</select></label>
            <label>Status<select aria-label="Filtrar por status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">TODOS</option>{rosterStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          </div>
        </div>
        <p className="table-summary" aria-live="polite">{filteredPlayers.length} de {BILLS_2026_ROSTER.length} linhas publicadas</p>
        <div className="roster-table-wrap">
          <table>
            <thead><tr><th>#</th><th>ATLETA</th><th>POS</th><th>STATUS</th><th>ALT</th><th>PESO</th><th>EXP</th><th>COLLEGE</th></tr></thead>
            <tbody>{filteredPlayers.map((player) => <tr key={player.id}><td>{player.jerseyNumber ?? '—'}</td><td><a href={player.playerUrl} target="_blank" rel="noreferrer">{player.name}</a></td><td>{player.position}</td><td><span className="roster-code">{player.rosterStatus}</span></td><td>{heightLabel(player.heightIn)}</td><td>{player.weightLbs} lb</td><td>{player.experienceLabel}</td><td>{player.college ?? '—'}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="staff-contract-grid">
        <article className="panel staff-panel">
          <p className="eyebrow">COMISSÃO TÉCNICA PUBLICADA</p>
          <h2>HEAD COACH E COORDENADORES</h2>
          {BILLS_2026_STAFF.map((staff) => <div className="staff-row" key={staff.id}><div><strong>{staff.name}</strong><span>{staff.role}</span></div><a href={sourceUrl(staff.sourceId)} target="_blank" rel="noreferrer">FONTE ↗</a></div>)}
          <p className="muted">Dados de identidade e cargo; retratos e contratos individuais seguem sem asset ou valor não publicado.</p>
        </article>
        <article className="panel contract-panel">
          <p className="eyebrow">CONTRATO COM FONTE</p>
          <h2>ACORDO DE JOE BRADY</h2>
          {BILLS_2026_STAFF_CONTRACTS.map((contract) => <div className="contract-record" key={contract.id}><strong>{contract.durationYears} ANOS</strong><span>Head Coach · salário não divulgado</span><p>{contract.notes}</p><a href={sourceUrl(contract.sourceId)} target="_blank" rel="noreferrer">VER FONTE ↗</a></div>)}
          <div className="pending-state compact-pending"><span>!</span><div><strong>Contratos de atletas pendentes</strong><p>O jogo não deduz salário, cap hit, bônus ou prazo quando a fonte não publica esses dados.</p></div></div>
        </article>
      </section>

      <section className="roster-honesty panel">
        <span>!</span>
        <div><strong>Não há fotos, uniformes, estádio ou ratings simulados nesta tela.</strong><p>Esses campos exigem direitos, fornecedor e metodologia antes de entrar no produto. As 31 franquias NFL restantes, UFL e NCAA também continuam pendentes de importação individual.</p></div>
      </section>
    </section>
  )
}

function PageHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></header> }

export default App
