import { useCallback, useEffect, useMemo, useState } from 'react'
import type * as React from 'react'
import { CONTENT_COVERAGE } from './data/content-status'
import { COACH_AVATARS, findCoachAvatar } from './data/coach-avatars'
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
import type { CareerCheckpointId, CareerObjective, CareerProgress, CatalogSelection, CoachProfile, GameMode, OperationsPlan, Route } from './domain/contracts'
import { clearCareerProgress, completeCareerDevelopmentWeek, completeCareerObjective, createCareerProgress, loadCareerProgress, normalizeCareerProgress, registerCareerCheckpoint, registerCareerGameSession, saveCareerProgress, unreadCareerMessages } from './career/progress'
import { loadCatalogSelection, loadCoachProfile, saveCatalogSelection, saveCoachProfile } from './lib/persistence'
import { listNamedSaveSlots, loadMirroredSaveBundle, loadSaveBundleFromSlot, makeSaveBundle, mirrorSaveBundle, parseSaveBundle, saveBundleToSlot, type NamedSaveSlotId, type SaveBundle, type SaveSlotSummary } from './lib/save-vault'
import {
  defensiveIdentityLabel,
  loadOperationsPlan,
  offensiveIdentityLabel,
  runScoutingCycle,
  runTrainingSession,
  saveOperationsPlan,
  scoutingFocusLabel,
  setCollegePhase,
  setFacilityPriority,
  setOperatingReserve,
  setProPhase,
  setScoutingFocus,
  setTacticalPlan,
  setTrainingPlan,
  trainingFocusLabel,
} from './operations/plan'
import { FieldCanvas } from './broadcast/FieldCanvas'
import { ASSIST_MODE_OPTIONS, assistModeLabel, playLabel, recommendAutoPlay, tacticalDecision, type AssistMode } from './sim/autoplay'
import { createMatchDebrief } from './sim/debrief'
import { createGame, resolvePlay, simulateToEnd } from './sim/engine'
import { projectStats } from './sim/stats'
import type { GameState, PlayCall } from './sim/types'
import './App.css'

const routes: Record<Route, string> = {
  inicio: '#/',
  carreira: '#/carreira',
  temporada: '#/temporada',
  elenco: '#/elenco',
  jogoUnico: '#/jogo-unico',
  gestao: '#/gestao',
  banco: '#/banco-de-dados',
  configuracoes: '#/configuracoes',
}

const routeLabels: Record<Route, string> = {
  inicio: 'Início',
  carreira: 'Carreira',
  temporada: 'Temporada',
  elenco: 'Elenco',
  jogoUnico: 'Jogo único',
  gestao: 'Gestão',
  banco: 'Banco de dados',
  configuracoes: 'Ajustes',
}

function getRouteFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/carreira') return 'carreira'
  if (hash === '#/temporada') return 'temporada'
  if (hash === '#/elenco') return 'elenco'
  if (hash === '#/jogo-unico') return 'jogoUnico'
  if (hash === '#/gestao') return 'gestao'
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
  const [careerProgress, setCareerProgress] = useState<CareerProgress | null>(loadCareerProgress)
  const [operationsPlan, setOperationsPlan] = useState<OperationsPlan>(loadOperationsPlan)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    void mirrorSaveBundle(makeSaveBundle(profile, catalogSelection, careerProgress, operationsPlan))
  }, [catalogSelection, careerProgress, operationsPlan, profile])

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

  function beginCareerDossier() {
    if (!profile.name.trim()) return false
    saveCoachProfile(profile)
    const nextProgress = careerProgress ?? createCareerProgress(profile)
    saveCareerProgress(nextProgress)
    setCareerProgress(nextProgress)
    setLastSaved('Dossiê de carreira salvo neste navegador')
    return true
  }

  function advanceCareerObjective(objectiveId: CareerObjective['id']) {
    if (!careerProgress) return
    const nextProgress = completeCareerObjective(careerProgress, objectiveId)
    if (nextProgress === careerProgress) return
    saveCareerProgress(nextProgress)
    setCareerProgress(nextProgress)
    setLastSaved('Progresso da carreira salvo neste navegador')
  }

  function registerCareerGame() {
    if (!careerProgress) return
    const objectiveProgress = completeCareerObjective(careerProgress, 'match-review')
    const sessionProgress = registerCareerGameSession(objectiveProgress)
    const nextProgress = registerCareerCheckpoint(sessionProgress, 'match')
    saveCareerProgress(nextProgress)
    setCareerProgress(nextProgress)
    setLastSaved('Partida e recompensa de carreira salvas neste navegador')
  }

  function recordCareerCheckpoint(checkpoint: CareerCheckpointId) {
    if (!careerProgress) return
    const nextProgress = registerCareerCheckpoint(careerProgress, checkpoint)
    if (nextProgress === careerProgress) return
    saveCareerProgress(nextProgress)
    setCareerProgress(nextProgress)
    setLastSaved('Etapa do ciclo de desenvolvimento salva neste navegador')
  }

  function completeDevelopmentWeek() {
    if (!careerProgress) return
    const nextProgress = completeCareerDevelopmentWeek(careerProgress)
    if (nextProgress === careerProgress) return
    saveCareerProgress(nextProgress)
    setCareerProgress(nextProgress)
    setLastSaved('Semana de desenvolvimento concluída e salva neste navegador')
  }

  function persistOperations(nextPlan: OperationsPlan, message = 'Plano de futebol salvo neste navegador') {
    setOperationsPlan(nextPlan)
    saveOperationsPlan(nextPlan)
    setLastSaved(message)
  }

  function exportSave() {
    const bundle = makeSaveBundle(profile, catalogSelection, careerProgress, operationsPlan)
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'vale-gridiron-manager-save.json'
    link.click()
    URL.revokeObjectURL(url)
    setLastSaved('Arquivo de save exportado')
  }

  function applySaveBundle(bundle: SaveBundle) {
    const restoredProgress = bundle.careerProgress ? normalizeCareerProgress(bundle.careerProgress) : null
    const normalizedBundle = { ...bundle, careerProgress: restoredProgress }
    setProfile(bundle.profile)
    setCatalogSelection(bundle.catalogSelection)
    setCareerProgress(restoredProgress)
    setOperationsPlan(bundle.operationsPlan)
    saveCoachProfile(bundle.profile)
    saveCatalogSelection(bundle.catalogSelection)
    if (restoredProgress) saveCareerProgress(restoredProgress)
    else clearCareerProgress()
    saveOperationsPlan(bundle.operationsPlan)
    return normalizedBundle
  }

  function importSave(file: File) {
    void file.text().then((content) => {
      const bundle = parseSaveBundle(content)
      if (!bundle) {
        setLastSaved('Arquivo de save incompatível')
        return
      }
      void mirrorSaveBundle(applySaveBundle(bundle))
      setLastSaved('Save importado e espelhado neste navegador')
    })
  }

  function restoreMirroredSave() {
    void loadMirroredSaveBundle().then((bundle) => {
      if (!bundle) {
        setLastSaved('Nenhum espelho de save compatível foi encontrado neste navegador')
        return
      }
      void mirrorSaveBundle(applySaveBundle(bundle))
      setLastSaved('Espelho de save recuperado neste navegador')
    })
  }

  async function saveNamedSlot(slot: NamedSaveSlotId) {
    const saved = await saveBundleToSlot(makeSaveBundle(profile, catalogSelection, careerProgress, operationsPlan), slot)
    setLastSaved(saved ? `Save registrado em ${slot.toUpperCase()}` : 'Não foi possível registrar o slot neste navegador')
    return saved
  }

  async function restoreNamedSlot(slot: NamedSaveSlotId) {
    const bundle = await loadSaveBundleFromSlot(slot)
    if (!bundle) {
      setLastSaved('O slot selecionado não possui um save compatível')
      return false
    }
    void mirrorSaveBundle(applySaveBundle(bundle))
    setLastSaved(`Save de ${slot.toUpperCase()} recuperado neste navegador`)
    return true
  }

  const getNamedSaveSlots = useCallback((): Promise<SaveSlotSummary[]> => listNamedSaveSlots(), [])

  function handleNavigation(nextRoute: Route) {
    navigate(nextRoute)
    setRoute(nextRoute)
  }

  return (
    <div className={`app-shell ${profile.reduceMotion ? 'is-reduced-motion' : ''}`}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <TopBar route={route} onNavigate={handleNavigation} lastSaved={lastSaved} />

      <main id="conteudo" className="app-content">
        {route === 'inicio' && <Lobby onNavigate={handleNavigation} coverageLabel={coverageLabel} />}
        {route === 'carreira' && (
          <Career profile={profile} progress={careerProgress} onChange={setProfile} onSave={persistProfile} onCreateDossier={beginCareerDossier} onAdvanceObjective={advanceCareerObjective} onCompleteDevelopmentWeek={completeDevelopmentWeek} onNavigate={handleNavigation} />
        )}
        {route === 'temporada' && <Sandbox selection={catalogSelection} onSave={persistCatalogSelection} onNavigate={handleNavigation} />}
        {route === 'elenco' && <RosterDatabase />}
        {route === 'jogoUnico' && <SingleGame selectedFranchiseId={catalogSelection.franchiseId} operationsPlan={operationsPlan} onGameFinalized={registerCareerGame} />}
        {route === 'gestao' && <OperationsCenter plan={operationsPlan} onChange={persistOperations} onCareerCheckpoint={recordCareerCheckpoint} onNavigate={handleNavigation} />}
        {route === 'banco' && <ContentDatabase />}
        {route === 'configuracoes' && <Settings profile={profile} onChange={setProfile} onSave={persistProfile} onExport={exportSave} onImport={importSave} onRestore={restoreMirroredSave} onSaveSlot={saveNamedSlot} onRestoreSlot={restoreNamedSlot} onListSlots={getNamedSaveSlots} />}
      </main>

      <footer className="app-footer">
        <span>LOTES 01–16 · INTEGRAÇÃO EM PROGRESSO</span>
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
    { route: 'gestao', icon: '⌘' },
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
          <p className="eyebrow"><span className="pulse-dot" /> TEMPORADA DE ESTREIA · LOTES 01–12</p>
          <h1 id="lobby-title">CONSTRUA<br /><em>O SEU LEGADO.</em></h1>
          <p className="hero-lead">Uma fundação real para o manager de futebol americano: decisões, saves e modos de jogo começam aqui.</p>
          <div className="hero-actions">
            <button className="action-button primary" onClick={() => onNavigate('carreira')}>COMEÇAR CARREIRA <span>›</span></button>
            <button className="action-button secondary" onClick={() => onNavigate('gestao')}>CENTRO DE FUTEBOL <span>⌘</span></button>
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
        <ModeCard number="02" title="Temporada" text="Escolha qualquer clube com escudo registrado em uma competição já importada." action="ABRIR TEMPORADA" mode="season" onClick={() => onNavigate('temporada')} />
        <ModeCard number="03" title="Jogo Único" text="Monte a partida com clubes reais, motor determinístico e transmissão 2D tática." action="CONFIGURAR JOGO" mode="game" onClick={() => onNavigate('jogoUnico')} />
      </div>

      <section className="foundation-grid" aria-label="Status da fundação">
        <FoundationPanel kicker="ROTAS" title="3 MODOS, 3 FLUXOS" value="ONLINE" description="Carreira, temporada sandbox e jogo único já possuem telas próprias e navegáveis." />
        <FoundationPanel kicker="SAVE LOCAL" title="PERFIL DO TÉCNICO" value="ATIVO" description="Auto-save local, espelho IndexedDB e exportação de arquivo disponíveis." />
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

function Career({ profile, progress, onChange, onSave, onCreateDossier, onAdvanceObjective, onCompleteDevelopmentWeek, onNavigate }: { profile: CoachProfile; progress: CareerProgress | null; onChange: (profile: CoachProfile) => void; onSave: () => void; onCreateDossier: () => boolean; onAdvanceObjective: (objectiveId: CareerObjective['id']) => void; onCompleteDevelopmentWeek: () => void; onNavigate: (route: Route) => void }) {
  const selectedAvatar = findCoachAvatar(profile.avatarId)
  const [profileSaved, setProfileSaved] = useState(false)
  const [dossierError, setDossierError] = useState(false)

  function updateProfile(nextProfile: CoachProfile) {
    setProfileSaved(false)
    setDossierError(false)
    onChange(nextProfile)
  }

  function startDossier() {
    setDossierError(!onCreateDossier())
  }

  return (
    <section className="route-page career-page" aria-labelledby="career-title">
      <PageHeading eyebrow="MODO CARREIRA · PROGRESSÃO ASSISTIDA" title="SUA JORNADA COMEÇA AQUI" copy="Crie e salve o dossiê do técnico do usuário, desenvolva XP e reputação por planos e sessões táticas, e prepare a progressão FCS → FBS → UFL → NFL. Propostas continuam vinculadas exclusivamente a vagas reais verificadas por snapshot." />
      <div className="career-layout">
        <article className="profile-card panel">
          <div className="profile-avatar"><img src={selectedAvatar.path} alt={`Avatar fictício: ${selectedAvatar.label}`} /></div>
          <div><p className="eyebrow">PERFIL DO TÉCNICO</p><h2>{profile.name || 'Novo técnico'}</h2><span>Nível inicial · {profile.difficulty}</span></div>
          <div className="profile-progress"><span>PROGRESSO DA CARREIRA</span><div><i style={{ width: `${Math.min(100, ((progress?.xp ?? 0) / 300) * 100)}%` }} /></div><strong>{progress?.xp ?? 0} XP</strong></div>
        </article>
        <form className="coach-form panel" onSubmit={(event) => { event.preventDefault(); onSave(); setProfileSaved(true) }}>
          <div className="panel-heading"><span className="panel-icon">✦</span><div><p>CONFIGURAÇÃO</p><h2>CRIE SEU TÉCNICO</h2></div></div>
          <label>Nome do técnico<input value={profile.name} maxLength={40} onChange={(event) => updateProfile({ ...profile, name: event.target.value })} placeholder="Digite seu nome" /></label>
          <div className="form-row">
            <label>Nacionalidade<select value={profile.nationality} onChange={(event) => updateProfile({ ...profile, nationality: event.target.value })}><option>Brasil</option><option>Estados Unidos</option><option>México</option><option>Argentina</option><option>Japão</option><option>Coreia do Sul</option><option>Índia</option><option>Nigéria</option><option>França</option><option>Outro</option></select></label>
            <label>Dificuldade<select value={profile.difficulty} onChange={(event) => updateProfile({ ...profile, difficulty: event.target.value as CoachProfile['difficulty'] })}><option>Equilibrada</option><option>Desafiadora</option><option>Lenda</option></select></label>
          </div>
          <label>Filosofia inicial<select value={profile.philosophy} onChange={(event) => updateProfile({ ...profile, philosophy: event.target.value as CoachProfile['philosophy'] })}><option>Ataque equilibrado</option><option>Defesa agressiva</option><option>Controle de jogo</option></select></label>
          <fieldset className="avatar-picker"><legend>AVATAR CINEMATOGRÁFICO</legend><p>Retratos fictícios para o seu técnico. Não representam jogadores, técnicos ou pessoas reais.</p><div className="avatar-grid">{COACH_AVATARS.map((avatar) => <button type="button" key={avatar.id} className={`avatar-choice ${profile.avatarId === avatar.id ? 'is-selected' : ''}`} aria-pressed={profile.avatarId === avatar.id} onClick={() => updateProfile({ ...profile, avatarId: avatar.id })}><img src={avatar.path} alt="" /><span><strong>{avatar.label}</strong><small>{avatar.description}</small></span></button>)}</div></fieldset>
          <button className="action-button primary full" type="submit">SALVAR PERFIL <span>✓</span></button>
          {profileSaved && <div className="profile-saved" role="status"><div><strong>PERFIL SALVO</strong><span>{profile.name || 'Técnico'} pode abrir o modo Temporada ou estruturar o primeiro plano de jogo.</span></div><button type="button" className="action-button secondary" onClick={() => onNavigate('temporada')}>TEMPORADA <span>›</span></button></div>}
        </form>
        <aside className="career-sidebar panel">
          <p className="eyebrow">PRÓXIMA ETAPA</p><h2>TRILHA DE CARREIRA</h2>
          <div className="pending-state"><span>!</span><div><strong>Vagas dependem de dados reais</strong><p>FBS/FCS aguardam importação. NFL e UFL já têm estrutura, mas coaches e rosters continuam parciais.</p></div></div>
          <div className="career-gate-list" aria-label="Marcos de XP da carreira"><div className={(progress?.xp ?? 0) >= 250 ? 'is-ready' : ''}><span>250 XP</span><strong>FCS</strong><small>primeira candidatura, quando houver vaga real</small></div><div className={(progress?.xp ?? 0) >= 450 ? 'is-ready' : ''}><span>450 XP</span><strong>FBS</strong><small>progressão universitária com staff verificado</small></div><div className={(progress?.xp ?? 0) >= 700 ? 'is-ready' : ''}><span>700 XP</span><strong>UFL</strong><small>entrevista somente após snapshot de vaga</small></div><div className={(progress?.xp ?? 0) >= 1000 ? 'is-ready' : ''}><span>1000 XP</span><strong>NFL</strong><small>destino final condicionado à cobertura real</small></div></div>
          <button className="text-button" onClick={() => onNavigate('banco')}>CONSULTAR COBERTURA DO CATÁLOGO <span>›</span></button>
        </aside>
      </div>
      {progress ? <CareerDossier progress={progress} onAdvanceObjective={onAdvanceObjective} onCompleteDevelopmentWeek={onCompleteDevelopmentWeek} onNavigate={onNavigate} /> : <section className="career-start panel" aria-labelledby="career-start-title"><div><p className="eyebrow">DOSSIÊ DE CARREIRA</p><h2 id="career-start-title">PRONTO PARA SER REGISTRADO</h2><p>O dossiê cria um save local para o técnico do usuário. Ele começa sem clube, sem contrato e sem oferta: nenhuma vaga real foi verificada nos snapshots atuais.</p>{dossierError && <strong className="form-error" role="alert">Informe o nome do técnico antes de iniciar o dossiê.</strong>}</div><button className="action-button primary" onClick={startDossier}>INICIAR DOSSIÊ <span>›</span></button></section>}
      <section className="timeline panel"><div className="panel-heading"><span className="panel-icon">◌</span><div><p>FLUXO PLANEJADO</p><h2>CICLO DA SEMANA</h2></div></div><ol>{['Caixa de entrada', 'Treino', 'Plano de jogo', 'Partida', 'Relatórios'].map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><p className="muted">O Centro de Futebol dos Lotes 07–09 já controla treino, scouting e plano de jogo; os dados de vagas e elencos reais continuam dependentes de snapshots importados.</p></section>
    </section>
  )
}

function CareerDossier({ progress, onAdvanceObjective, onCompleteDevelopmentWeek, onNavigate }: { progress: CareerProgress; onAdvanceObjective: (objectiveId: CareerObjective['id']) => void; onCompleteDevelopmentWeek: () => void; onNavigate: (route: Route) => void }) {
  const unread = unreadCareerMessages(progress)

  function objectiveAction(objective: CareerObjective) {
    if (objective.state !== 'active') return <span className="objective-state">{objective.state === 'complete' ? 'CONCLUÍDO' : 'BLOQUEADO'}</span>
    if (objective.id === 'catalog-review') return <button className="text-button" onClick={() => onAdvanceObjective('catalog-review')}>REGISTRAR LEITURA</button>
    if (objective.id === 'football-plan') return <button className="text-button" onClick={() => { onAdvanceObjective('football-plan'); onNavigate('gestao') }}>REGISTRAR PLANO</button>
    if (objective.id === 'match-review') return <button className="text-button" onClick={() => onNavigate('jogoUnico')}>ABRIR PARTIDA</button>
    return <span className="objective-state">EM PROGRESSO</span>
  }

  return <section className="career-dossier" aria-labelledby="career-dossier-title">
    <article className="career-command panel"><div className="panel-heading"><span className="panel-icon">⌁</span><div><p>DOSSIÊ ATIVO · SAVE LOCAL</p><h2 id="career-dossier-title">CENTRAL DA CARREIRA</h2></div></div><div className="career-metrics"><div><span>NÍVEL</span><strong>{1 + Math.floor(progress.xp / 200)}</strong></div><div><span>XP</span><strong>{progress.xp}</strong></div><div><span>REPUTAÇÃO</span><strong>{progress.reputation}<small>/100</small></strong></div><div><span>SESSÕES</span><strong>{progress.gameSessions}</strong></div><div><span>CLUBE ATUAL</span><strong>—</strong></div></div><CareerRewardTrack xp={progress.xp} /><p className="career-disclaimer">XP e reputação são um modelo interno de progresso do usuário, sem compras ou bônus aleatórios. Sem vaga confirmada, o save não atribui clube, contrato, salário ou entrevista a uma organização real.</p></article>
    <CareerDevelopmentWeekPanel progress={progress} onComplete={onCompleteDevelopmentWeek} onNavigate={onNavigate} />
    <article className="career-objectives panel"><div className="panel-heading"><span className="panel-icon">◎</span><div><p>PLANO DE DESENVOLVIMENTO</p><h2>OBJETIVOS ATIVOS</h2></div></div>{progress.objectives.map((objective) => <div className={`career-objective ${objective.state}`} key={objective.id}><span>{objective.state === 'complete' ? '✓' : objective.state === 'blocked' ? '!' : '○'}</span><div><strong>{objective.label}</strong><p>{objective.detail}</p><small>+{objective.rewardXp} XP · +{objective.rewardReputation} REP</small></div>{objectiveAction(objective)}</div>)}</article>
    <article className="career-inbox panel"><div className="panel-heading"><span className="panel-icon">✉</span><div><p>INBOX · {unread} NOVAS</p><h2>MENSAGENS</h2></div></div><div className="inbox-list">{progress.inbox.slice(0, 4).map((message) => <article key={message.id} className={`inbox-message ${message.category}`}><span>{message.category === 'coverage' ? '▣' : message.category === 'career' ? '★' : 'i'}</span><div><strong>{message.title}</strong><p>{message.body}</p></div></article>)}</div></article>
    <article className="career-vacancies panel"><div className="panel-heading"><span className="panel-icon">⌂</span><div><p>MERCADO DE TRABALHO</p><h2>VAGAS REAIS</h2></div></div><strong className="vacancy-zero">0 VAGAS VERIFICADAS</strong><p>O catálogo atual não comprova uma vaga de comissão, entrevista, salário ou contrato. Nenhuma proposta é gerada como enfeite.</p><div className="vacancy-grid"><span>FBS/FCS <b>PENDENTE</b></span><span>UFL <b>PENDENTE</b></span><span>NFL <b>PENDENTE</b></span></div><button className="action-button secondary full" disabled>OFERTAS BLOQUEADAS POR COBERTURA</button></article>
  </section>
}

function CareerDevelopmentWeekPanel({ progress, onComplete, onNavigate }: { progress: CareerProgress; onComplete: () => void; onNavigate: (route: Route) => void }) {
  const checkpoints: Array<{ id: CareerCheckpointId; label: string; detail: string; route: Route }> = [
    { id: 'training', label: 'Treino', detail: 'Conclua uma sessão no Centro de Futebol.', route: 'gestao' },
    { id: 'scouting', label: 'Scouting', detail: 'Rode uma leitura de scouting no Centro de Futebol.', route: 'gestao' },
    { id: 'match', label: 'Partida tática', detail: 'Finalize uma transmissão no Jogo Único.', route: 'jogoUnico' },
  ]
  const completed = progress.developmentWeek.completedCheckpoints
  const ready = checkpoints.every((checkpoint) => completed.includes(checkpoint.id))

  return <article className="career-week panel"><div className="career-week-head"><div><p className="eyebrow">LOTE 13 · CICLO LOCAL</p><h2>SEMANA DE DESENVOLVIMENTO {String(progress.developmentWeek.number).padStart(2, '0')}</h2><p>Um ciclo de preparo do perfil do usuário. Não representa uma semana oficial, rodada, agenda ou resultado de qualquer competição.</p></div><div className="career-week-score"><strong>{completed.length}/3</strong><span>CHECKPOINTS</span></div></div><div className="career-week-checkpoints">{checkpoints.map((checkpoint, index) => { const isComplete = completed.includes(checkpoint.id); return <div className={isComplete ? 'is-complete' : ''} key={checkpoint.id}><span>{isComplete ? '✓' : String(index + 1).padStart(2, '0')}</span><div><strong>{checkpoint.label}</strong><small>{checkpoint.detail}</small></div>{isComplete ? <b>REGISTRADO</b> : <button className="text-button" onClick={() => onNavigate(checkpoint.route)}>ABRIR <span>›</span></button>}</div> })}</div><div className="career-week-footer"><span>{ready ? 'Ciclo completo. A recompensa é fixa e transparente.' : 'Complete treino, scouting e partida para encerrar o ciclo.'}</span><button className="action-button primary" disabled={!ready} onClick={onComplete}>ENCERRAR SEMANA · +60 XP <span>✓</span></button></div></article>
}

function CareerRewardTrack({ xp }: { xp: number }) {
  const rewards = [
    { xp: 150, label: 'ROTINA DE FILME', detail: 'leitura guiada de jogo' },
    { xp: 300, label: 'CHAMADOR CERTIFICADO', detail: 'ritmo rápido liberado' },
    { xp: 600, label: 'ESTRATEGISTA', detail: 'marco de credencial' },
    { xp: 1000, label: 'CANDIDATURA NFL', detail: 'sujeita a vaga verificada' },
  ]
  const next = rewards.find((reward) => xp < reward.xp)
  return <section className="career-reward-track" aria-label="Trilha de recompensas do perfil"><div><p>TRILHA DE CREDENCIAIS</p><strong>{next ? `${next.xp - xp} XP PARA ${next.label}` : 'TODAS AS CREDENCIAIS DE PROTÓTIPO CONCLUÍDAS'}</strong></div><ol>{rewards.map((reward) => <li className={xp >= reward.xp ? 'is-unlocked' : ''} key={reward.label}><span>{xp >= reward.xp ? '✓' : reward.xp}</span><div><strong>{reward.label}</strong><small>{reward.detail}</small></div></li>)}</ol></section>
}

function Sandbox({ selection, onSave, onNavigate }: { selection: CatalogSelection; onSave: (selection: CatalogSelection) => void; onNavigate: (route: Route) => void }) {
  const selectableSnapshots = LEAGUE_SNAPSHOTS_2026.filter((snapshot) => snapshot.leagueId === 'nfl' || snapshot.leagueId === 'ufl')
  const activeSnapshot = selectableSnapshots.find((snapshot) => snapshot.seasonId === selection.seasonId) ?? selectableSnapshots[0]
  const clubs = activeSnapshot.leagueId === 'nfl' ? NFL_2026_FRANCHISES : UFL_2026_FRANCHISES
  const activeClub = findFranchise(selection.franchiseId)
  const selectedClubId = activeClub?.leagueId === activeSnapshot.leagueId ? selection.franchiseId : null
  const snapshotStatus = activeSnapshot.coverageStatus === 'partial' ? 'PARCIAL' : 'PRONTO'

  function selectSnapshot(seasonId: string) {
    onSave({ seasonId, franchiseId: null })
  }

  return <section className="route-page season-page" aria-labelledby="sandbox-title">
    <PageHeading eyebrow="MODO TEMPORADA · ESCOLHA DE CLUBE" title="MONTE A SUA TEMPORADA" copy="Escolha qualquer equipe com identidade e escudo registrados na competição importada. A seleção mantém a fonte e nunca preenche elenco, agenda ou tabela oficial que ainda não exista no snapshot." />
    <section className="competition-ribbon panel" aria-label="Competições disponíveis no catálogo"><div><p className="eyebrow">COMPETIÇÕES & SÍMBOLOS DE CATÁLOGO</p><h2>ESCOLHA COM COBERTURA VISÍVEL</h2><p>Os selos abaixo identificam a competição no jogo. Eles não substituem nem alegam ser logos oficiais de ligas.</p></div><div className="competition-mark-grid">{LEAGUE_SNAPSHOTS_2026.map((snapshot) => <button key={snapshot.seasonId} type="button" disabled={snapshot.leagueId !== 'nfl' && snapshot.leagueId !== 'ufl'} className={snapshot.seasonId === activeSnapshot.seasonId ? 'is-selected' : ''} onClick={() => selectSnapshot(snapshot.seasonId)}><LeagueBadge leagueId={snapshot.leagueId as 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs'} label={`${snapshot.leagueName} ${snapshot.seasonYear}`} /><small>{snapshot.leagueId === 'nfl' || snapshot.leagueId === 'ufl' ? 'SELECIONAR' : 'AGUARDA CLUBES REAIS'}</small></button>)}</div></section>
    <div className="setup-layout"><article className="setup-steps panel"><p className="eyebrow">CONFIGURAÇÃO 01/03</p><h2>SELEÇÃO DE CATÁLOGO</h2><label>Competição<select value={activeSnapshot.seasonId} onChange={(event) => selectSnapshot(event.target.value)}>{selectableSnapshots.map((snapshot) => <option key={snapshot.seasonId} value={snapshot.seasonId}>{snapshot.leagueName} · {snapshot.seasonYear}</option>)}</select></label><label>Snapshot da temporada<select value={activeSnapshot.seasonId} onChange={(event) => selectSnapshot(event.target.value)}>{selectableSnapshots.map((snapshot) => <option key={snapshot.seasonId} value={snapshot.seasonId}>{snapshot.seasonId}</option>)}</select></label><label>Equipe real<select aria-label="Equipe real" value={selectedClubId ?? ''} onChange={(event) => onSave({ seasonId: activeSnapshot.seasonId, franchiseId: event.target.value || null })}><option value="">Selecione uma equipe</option>{clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}</select></label><FranchiseSelectGrid clubs={clubs} selectedId={selectedClubId} onSelect={(franchiseId) => onSave({ seasonId: activeSnapshot.seasonId, franchiseId })} /><div className="inline-notice"><span>i</span><div><strong>{activeClub && selectedClubId ? `${activeClub.name} selecionado` : 'Seleção ainda não concluída'}</strong><br />Roster, staff, uniforme e agenda completa continuam bloqueados até o snapshot correspondente ser importado.</div></div></article><aside className="setup-status panel"><p className="eyebrow">INTEGRIDADE DO SNAPSHOT</p><h2>{snapshotStatus}</h2><LeagueBadge leagueId={activeSnapshot.leagueId as 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs'} label={activeSnapshot.leagueName} /><div className="status-meter"><span>Identificação de equipes</span><strong>100%</strong><div><i className="meter-full" /></div></div><div className="status-meter"><span>Regras estruturais</span><strong>{activeSnapshot.leagueId === 'ufl' ? '100%' : 'PARCIAL'}</strong><div><i className={activeSnapshot.leagueId === 'ufl' ? 'meter-full' : 'meter-partial'} /></div></div><div className="status-meter"><span>Fixtures e rosters</span><strong>PENDENTE</strong><div><i className="meter-empty" /></div></div><button className="action-button secondary full" onClick={() => onNavigate('banco')}>VER RELATÓRIO DE COBERTURA <span>↗</span></button></aside></div>
    <section className="season-command-grid"><article className="season-table-preview panel"><p className="eyebrow">TABELA DA TEMPORADA</p><h2>CLASSIFICAÇÃO VINCULADA À AGENDA</h2><div><span>JOGOS OFICIAIS</span><strong>0</strong><span>RESULTADOS IMPORTADOS</span><strong>0</strong></div><p>Uma tabela só será calculada quando fixtures e resultados do snapshot forem importados. Partidas táticas livres não alteram uma classificação real.</p></article><article className="season-journey panel"><p className="eyebrow">PRÓXIMO PASSO</p><h2>COMECE PELO CAMPO</h2><p>{selectedClubId ? `${activeClub?.name} está pronto para o jogo tático com o escudo registrado.` : 'Selecione um clube acima para levar seu escudo ao pré-jogo.'}</p><button className="action-button primary full" disabled={!selectedClubId} onClick={() => onNavigate('jogoUnico')}>PREPARAR PARTIDA <span>›</span></button></article></section>
  </section>
}

function OperationsCenter({ plan, onChange, onCareerCheckpoint, onNavigate }: { plan: OperationsPlan; onChange: (plan: OperationsPlan, message?: string) => void; onCareerCheckpoint: (checkpoint: CareerCheckpointId) => void; onNavigate: (route: Route) => void }) {
  const [desk, setDesk] = useState<'college' | 'pro' | 'performance'>('performance')
  const performanceIndex = Math.max(0, Math.min(100, Math.round(plan.readiness * 0.38 + plan.chemistry * 0.23 + plan.scoutingInsight * 0.16 + plan.operatingReserve * 0.1 - plan.fatigueRisk * 0.13)))
  const sessions = plan.entries.slice(0, 5)

  return <section className="route-page operations-page" aria-labelledby="operations-title">
    <div className="operations-banner panel">
      <div className="operations-banner-copy"><p className="eyebrow">CENTRO DE FUTEBOL · LOTES 07–09</p><h1 id="operations-title">COMANDO DE PERFORMANCE</h1><p>Planeje a evolução, a preparação e a operação da equipe. As escolhas abaixo são parâmetros locais do simulador; atletas, universidades, vagas e contratos só aparecem depois de importados por fonte.</p></div>
      <div className="operations-index" aria-label="Índice de prontidão do plano"><span>ÍNDICE DE PRONTIDÃO</span><strong>{performanceIndex}</strong><small>/100</small><i style={{ width: `${performanceIndex}%` }} /></div>
      <div className="operations-banner-mark" aria-hidden="true"><span>09</span><b>▲</b></div>
    </div>

    <div className="operations-overview" aria-label="Indicadores de gestão">
      <MetricCard label="PRONTIDÃO" value={plan.readiness} tone="green" note="impacta o modelo de jogo" />
      <MetricCard label="RISCO DE FADIGA" value={plan.fatigueRisk} tone="red" note="equilibre carga e recuperação" />
      <MetricCard label="QUÍMICA" value={plan.chemistry} tone="blue" note="efeito de treinamento" />
      <MetricCard label="SCOUTING" value={plan.scoutingInsight} tone="gold" note="fila sem prospects pendentes" />
      <MetricCard label="RESERVA OPERACIONAL" value={plan.operatingReserve} tone="silver" note="unidades internas, não USD" />
    </div>

    <div className="operations-tabs" role="tablist" aria-label="Áreas de gestão">
      <button role="tab" aria-selected={desk === 'college'} className={desk === 'college' ? 'is-active' : ''} onClick={() => setDesk('college')}><span>07</span> UNIVERSIDADE</button>
      <button role="tab" aria-selected={desk === 'pro'} className={desk === 'pro' ? 'is-active' : ''} onClick={() => setDesk('pro')}><span>08</span> PROFISSIONAL</button>
      <button role="tab" aria-selected={desk === 'performance'} className={desk === 'performance' ? 'is-active' : ''} onClick={() => setDesk('performance')}><span>09</span> TÁTICA & PERFORMANCE</button>
    </div>

    {desk === 'college' && <CollegeDesk plan={plan} onChange={onChange} onNavigate={onNavigate} />}
    {desk === 'pro' && <ProDesk plan={plan} onChange={onChange} onNavigate={onNavigate} />}
    {desk === 'performance' && <PerformanceDesk plan={plan} onChange={onChange} onCareerCheckpoint={onCareerCheckpoint} onNavigate={onNavigate} />}

    <section className="operations-log panel" aria-labelledby="operations-log-title">
      <div className="panel-heading"><span className="panel-icon">◫</span><div><p>HISTÓRICO DO PLANO</p><h2 id="operations-log-title">DECISÕES REGISTRADAS</h2></div></div>
      <div className="operations-log-grid">{sessions.map((item) => <article key={item.id}><span className={`log-kind ${item.kind}`}>{item.kind}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div>
    </section>
  </section>
}

function MetricCard({ label, value, tone, note }: { label: string; value: number; tone: string; note: string }) {
  return <article className={`operations-metric ${tone}`}><span>{label}</span><strong>{value}<small>/100</small></strong><i><b style={{ width: `${value}%` }} /></i><p>{note}</p></article>
}

function CollegeDesk({ plan, onChange, onNavigate }: { plan: OperationsPlan; onChange: (plan: OperationsPlan, message?: string) => void; onNavigate: (route: Route) => void }) {
  const phases: Array<{ id: OperationsPlan['collegePhase']; label: string; description: string }> = [
    { id: 'recruiting', label: 'Recrutamento', description: 'Defina a prioridade de avaliação antes de candidatos reais serem importados.' },
    { id: 'portal', label: 'Portal', description: 'Organize a triagem; nenhum atleta é gerado enquanto o snapshot não existir.' },
    { id: 'eligibility', label: 'Elegibilidade', description: 'Audite elegibilidade e redshirt quando os dados por atleta estiverem disponíveis.' },
    { id: 'postseason', label: 'Bowls / CFP', description: 'Acompanhe a etapa pós-temporada depois que calendário e critérios forem importados.' },
  ]

  return <section className="operations-desk college-desk" aria-labelledby="college-title">
    <div className="desk-heading"><div><p className="eyebrow">LOTE 07 · OFFSEASON UNIVERSITÁRIA</p><h2 id="college-title">PIPELINE UNIVERSITÁRIO</h2><p>Fluxo completo de decisões estruturado, sem declarar uma universidade, atleta, scholarship, ranking ou transferência que ainda não esteja no catálogo.</p></div><span className="status-pill pending">DADOS NCAA PENDENTES</span></div>
    <div className="college-phase-grid">{phases.map((phase, index) => <button key={phase.id} className={`college-phase ${plan.collegePhase === phase.id ? 'is-active' : ''}`} onClick={() => onChange(setCollegePhase(plan, phase.id), `Ciclo universitário salvo: ${phase.label}`)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{phase.label}</strong><small>{phase.description}</small><b>{plan.collegePhase === phase.id ? 'EM FOCO' : 'SELECIONAR'}</b></button>)}</div>
    <div className="college-command-grid">
      <article className="panel college-board"><p className="eyebrow">QUADRO DE RECRUTAMENTO</p><h2>FILA DE DADOS</h2><div className="empty-roster-visual"><span>0</span><div><strong>PROSPECTS VERIFICADOS</strong><p>Não há atletas universitários importados. O jogo não preenche o board com nomes ou ratings fictícios.</p></div></div><div className="slot-row"><span>QB</span><i /><b>aguarda fonte</b></div><div className="slot-row"><span>LINHAS</span><i /><b>aguarda fonte</b></div><div className="slot-row"><span>SECUNDÁRIA</span><i /><b>aguarda fonte</b></div><button className="action-button secondary full" onClick={() => onNavigate('banco')}>VER COBERTURA NCAA <span>↗</span></button></article>
      <article className="panel eligibility-board"><p className="eyebrow">ELEGIBILIDADE & PORTAL</p><h2>REGRAS ANTES DO ELENCO</h2><div className="rule-check"><span>✓</span><div><strong>Estados separados</strong><p>Recrutamento, portal, redshirt e elegibilidade não serão tratados como contrato profissional.</p></div></div><div className="rule-check muted-check"><span>○</span><div><strong>Importação necessária</strong><p>Instituições, conferências, calendário, atletas e histórico precisam de fonte versão 2026.</p></div></div><button className="action-button secondary full" disabled>AVANÇAR OFFSEASON BLOQUEADO</button></article>
    </div>
  </section>
}

function ProDesk({ plan, onChange, onNavigate }: { plan: OperationsPlan; onChange: (plan: OperationsPlan, message?: string) => void; onNavigate: (route: Route) => void }) {
  const phases: Array<{ id: OperationsPlan['proPhase']; label: string; number: string }> = [
    { id: 'evaluation', label: 'Avaliação', number: '01' },
    { id: 'free-agency', label: 'Free agency', number: '02' },
    { id: 'draft', label: 'Draft', number: '03' },
    { id: 'camp', label: 'Training camp', number: '04' },
  ]
  const buffalo = findFranchise('nfl-buffalo-bills')

  return <section className="operations-desk pro-desk" aria-labelledby="pro-title">
    <div className="desk-heading"><div><p className="eyebrow">LOTE 08 · OPERAÇÃO PROFISSIONAL</p><h2 id="pro-title">PAINEL DE FRONT OFFICE</h2><p>Planejamento de ciclo profissional separado do college. O único roster de atletas importado é o Buffalo Bills 2026; salários, cap hits, trades, waivers e contratos de atletas permanecem bloqueados sem fonte.</p></div><span className="status-pill partial">BASE PROFISSIONAL PARCIAL</span></div>
    <div className="pro-cycle">{phases.map((phase) => <button key={phase.id} className={plan.proPhase === phase.id ? 'is-active' : ''} onClick={() => onChange(setProPhase(plan, phase.id), `Etapa profissional salva: ${phase.label}`)}><span>{phase.number}</span><strong>{phase.label}</strong><small>{plan.proPhase === phase.id ? 'ETAPA ATIVA' : 'ABRIR ETAPA'}</small></button>)}</div>
    <div className="pro-command-grid">
      <article className="panel staff-console"><div className="staff-console-head">{buffalo && <TeamMark franchise={buffalo} />}<div><p className="eyebrow">COMISSÃO TÉCNICA IMPORTADA</p><h2>BUFFALO · 4 FUNÇÕES VERIFICADAS</h2><p>Identidades publicadas do único staff profissional importado. Isso não cria vagas, contratos ou auxiliares para os demais clubes.</p></div></div><div className="staff-mini-list">{BILLS_2026_STAFF.map((staff) => <div key={staff.id}><strong>{staff.name}</strong><span>{staff.role}</span><small>{staff.contractStatus === 'partial' ? 'CONTRATO PARCIAL' : 'CONTRATO PENDENTE'}</small></div>)}</div></article>
      <article className="panel cap-ledger"><p className="eyebrow">LIVRO DE CAP & CONTRATOS</p><h2>INTEGRIDADE FINANCEIRA</h2><div className="ledger-stat"><strong>0</strong><span>contratos de atletas<br />com valores importados</span></div><div className="ledger-line"><span>Contrato de staff publicado</span><b>1 parcial</b></div><div className="ledger-line"><span>Cap hit, bônus e dead cap</span><b>PENDENTES</b></div><div className="ledger-line"><span>Waivers e practice squad</span><b>PENDENTES</b></div><p className="muted">A reserva operacional é um recurso interno do protótipo, não um valor financeiro de uma franquia real.</p><label className="range-label">Reserva operacional <output>{plan.operatingReserve}/100</output><input aria-label="Reserva operacional" type="range" min="10" max="95" value={plan.operatingReserve} onChange={(event) => onChange(setOperatingReserve(plan, Number(event.target.value)), 'Reserva operacional salva neste navegador')} /></label></article>
      <article className="panel pro-actions"><p className="eyebrow">MERCADO E TRANSAÇÕES</p><h2>AÇÕES CONDICIONAIS</h2><div className="pro-action-row"><span>⇄</span><div><strong>Trades</strong><p>Requer contratos e rosters dos dois clubes envolvidos.</p></div><button disabled>BLOQUEADO</button></div><div className="pro-action-row"><span>◇</span><div><strong>Draft</strong><p>Requer prospects, ordem e regras da temporada importados.</p></div><button disabled>BLOQUEADO</button></div><div className="pro-action-row"><span>⊘</span><div><strong>Waivers</strong><p>Requer status de atleta e transações verificadas.</p></div><button disabled>BLOQUEADO</button></div><button className="action-button secondary full" onClick={() => onNavigate('elenco')}>ABRIR ROSTER AUDITADO <span>↗</span></button></article>
    </div>
  </section>
}

function PerformanceDesk({ plan, onChange, onCareerCheckpoint, onNavigate }: { plan: OperationsPlan; onChange: (plan: OperationsPlan, message?: string) => void; onCareerCheckpoint: (checkpoint: CareerCheckpointId) => void; onNavigate: (route: Route) => void }) {
  return <section className="operations-desk performance-desk" aria-labelledby="performance-title">
    <div className="desk-heading"><div><p className="eyebrow">LOTE 09 · IA, TÁTICA, TREINO E GESTÃO</p><h2 id="performance-title">PLANO DE JOGO DA SEMANA</h2><p>As decisões alteram o comportamento determinístico da simulação e os indicadores locais de preparo. Elas não representam ratings, contratos ou resultados oficiais de atletas reais.</p></div><span className="status-pill partial">SIMENGINE CONECTADO</span></div>
    <div className="performance-grid">
      <article className="panel strategy-console"><div className="panel-heading"><span className="panel-icon">⌘</span><div><p>CHAMADA E CONTRACHAMADA</p><h2>IDENTIDADE TÁTICA</h2></div></div><div className="strategy-selects"><label>Ataque<select aria-label="Identidade ofensiva" value={plan.offensiveIdentity} onChange={(event) => onChange(setTacticalPlan(plan, { offensiveIdentity: event.target.value as OperationsPlan['offensiveIdentity'], defensiveIdentity: plan.defensiveIdentity, aggression: plan.aggression }), 'Identidade ofensiva salva')}><option value="balanced">Equilíbrio situacional</option><option value="air-raid">Ataque aéreo</option><option value="ground-control">Controle terrestre</option></select></label><label>Defesa<select aria-label="Identidade defensiva" value={plan.defensiveIdentity} onChange={(event) => onChange(setTacticalPlan(plan, { offensiveIdentity: plan.offensiveIdentity, defensiveIdentity: event.target.value as OperationsPlan['defensiveIdentity'], aggression: plan.aggression }), 'Identidade defensiva salva')}><option value="contain">Contenção</option><option value="pressure">Pressão</option><option value="coverage">Cobertura</option></select></label></div><label className="range-label">Agressividade <output>{plan.aggression}%</output><input aria-label="Agressividade" type="range" min="25" max="85" value={plan.aggression} onChange={(event) => onChange(setTacticalPlan(plan, { offensiveIdentity: plan.offensiveIdentity, defensiveIdentity: plan.defensiveIdentity, aggression: Number(event.target.value) }), 'Agressividade tática salva')} /></label><div className="strategy-readout"><div><span>ATAQUE</span><strong>{offensiveIdentityLabel(plan.offensiveIdentity)}</strong></div><div><span>DEFESA</span><strong>{defensiveIdentityLabel(plan.defensiveIdentity)}</strong></div><div><span>EFEITO</span><strong>SIMULAÇÃO</strong></div></div><button className="action-button primary full" onClick={() => onNavigate('jogoUnico')}>TESTAR NO JOGO ÚNICO <span>›</span></button></article>
      <article className="panel training-console"><div className="panel-heading"><span className="panel-icon">↯</span><div><p>MICROCICLO SEMANAL</p><h2>TREINAMENTO</h2></div></div><label>Foco da sessão<select aria-label="Foco de treinamento" value={plan.trainingFocus} onChange={(event) => onChange(setTrainingPlan(plan, { trainingFocus: event.target.value as OperationsPlan['trainingFocus'], practiceIntensity: plan.practiceIntensity }), 'Foco de treinamento salvo')}><option value="recovery">Recuperação</option><option value="execution">Execução</option><option value="conditioning">Condicionamento</option><option value="cohesion">Química</option></select></label><label className="range-label">Intensidade <output>{plan.practiceIntensity}%</output><input aria-label="Intensidade de treino" type="range" min="20" max="90" value={plan.practiceIntensity} onChange={(event) => onChange(setTrainingPlan(plan, { trainingFocus: plan.trainingFocus, practiceIntensity: Number(event.target.value) }), 'Intensidade de treino salva')} /></label><div className="training-impact"><span><b className="green-dot" />Prontidão <strong>{plan.readiness}</strong></span><span><b className="red-dot" />Fadiga <strong>{plan.fatigueRisk}</strong></span><span><b className="blue-dot" />Química <strong>{plan.chemistry}</strong></span></div><p className="muted">Foco atual: {trainingFocusLabel(plan.trainingFocus)}. A sessão muda indicadores e o próximo jogo usa o plano salvo.</p><button className="action-button primary full" onClick={() => { onChange(runTrainingSession(plan), 'Sessão de treino concluída e salva'); onCareerCheckpoint('training') }}>EXECUTAR SESSÃO <span>✓</span></button></article>
      <article className="panel scouting-console"><div className="panel-heading"><span className="panel-icon">⌁</span><div><p>INTELIGÊNCIA DE ELENCO</p><h2>SCOUTING</h2></div></div><label>Prioridade<select aria-label="Prioridade de scouting" value={plan.scoutingFocus} onChange={(event) => onChange(setScoutingFocus(plan, event.target.value as OperationsPlan['scoutingFocus']), 'Prioridade de scouting salva')}><option value="quarterback">Quarterback</option><option value="line">Linhas</option><option value="secondary">Secundária</option><option value="best-available">Melhor disponível</option></select></label><div className="scouting-radar"><div><span>INSIGHT</span><strong>{plan.scoutingInsight}</strong><small>/100</small></div><i style={{ '--radar-level': `${plan.scoutingInsight}%` } as React.CSSProperties} /></div><p className="muted">Alvo: {scoutingFocusLabel(plan.scoutingFocus)}. O ciclo só gera insight, não prospects ou relatórios fictícios.</p><button className="action-button secondary full" onClick={() => { onChange(runScoutingCycle(plan), 'Ciclo de scouting concluído e salvo'); onCareerCheckpoint('scouting') }}>RODAR CICLO DE SCOUTING <span>›</span></button></article>
      <article className="panel club-console"><div className="panel-heading"><span className="panel-icon">▦</span><div><p>DIRETORIA E INSTALAÇÕES</p><h2>GESTÃO DO CLUBE</h2></div></div><div className="facility-choices" role="group" aria-label="Prioridade de instalações"><button className={plan.facilityPriority === 'medical' ? 'is-active' : ''} onClick={() => onChange(setFacilityPriority(plan, 'medical'), 'Prioridade médica salva')}>MÉDICO</button><button className={plan.facilityPriority === 'performance' ? 'is-active' : ''} onClick={() => onChange(setFacilityPriority(plan, 'performance'), 'Prioridade de performance salva')}>PERFORMANCE</button><button className={plan.facilityPriority === 'analysis' ? 'is-active' : ''} onClick={() => onChange(setFacilityPriority(plan, 'analysis'), 'Prioridade analítica salva')}>ANÁLISE</button></div><div className="club-model"><div><span>PRIORIDADE</span><strong>{plan.facilityPriority.toUpperCase()}</strong></div><div><span>RESERVA</span><strong>{plan.operatingReserve}<small>/100</small></strong></div></div><p className="muted">Receitas, estádio e patrocínios reais exigem fontes por clube. Este painel usa apenas alocação interna do modelo.</p></article>
    </div>
    <article className="plan-impact panel"><span>✓</span><div><strong>Decisões com efeito mensurável</strong><p>O SimEngine recebe identidade ofensiva, defensiva, agressividade, prontidão, fadiga e química. A mesma seed com o mesmo plano permanece reproduzível; mudar o plano altera o EventLog e as estatísticas projetadas.</p></div></article>
  </section>
}

function SingleGame({ selectedFranchiseId, operationsPlan, onGameFinalized }: { selectedFranchiseId: string | null; operationsPlan: OperationsPlan; onGameFinalized: () => void }) {
  const clubs = [...NFL_2026_FRANCHISES, ...UFL_2026_FRANCHISES]
  const initialHome = findFranchise(selectedFranchiseId)?.id ?? clubs[0].id
  const initialAway = clubs.find((club) => club.id !== initialHome)?.id ?? clubs[1].id
  const [homeId, setHomeId] = useState(initialHome)
  const [awayId, setAwayId] = useState(initialAway)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [finalReported, setFinalReported] = useState(false)
  const [assistMode, setAssistMode] = useState<AssistMode>('strategic')
  const home = findFranchise(homeId) ?? clubs[0]
  const away = findFranchise(awayId) ?? clubs[1]

  function selectHome(nextHomeId: string) {
    setHomeId(nextHomeId)
    if (nextHomeId === awayId) setAwayId(clubs.find((club) => club.id !== nextHomeId)?.id ?? awayId)
  }

  function selectAway(nextAwayId: string) {
    setAwayId(nextAwayId)
    if (nextAwayId === homeId) setHomeId(clubs.find((club) => club.id !== nextAwayId)?.id ?? homeId)
  }

  function startGame() {
    setFinalReported(false)
    setGameState(createGame({
      gameId: `${home.id}-vs-${away.id}`,
      seed: `${home.id}:${away.id}:lot-04-09`,
      homeTeamId: home.id,
      awayTeamId: away.id,
      strategy: {
        offensiveIdentity: operationsPlan.offensiveIdentity,
        defensiveIdentity: operationsPlan.defensiveIdentity,
        aggression: operationsPlan.aggression,
        readiness: operationsPlan.readiness,
        fatigueRisk: operationsPlan.fatigueRisk,
        chemistry: operationsPlan.chemistry,
      },
    }))
  }

  function commitGame(nextGameState: GameState) {
    setGameState(nextGameState)
    if (nextGameState.status === 'final' && !finalReported) {
      setFinalReported(true)
      onGameFinalized()
    }
  }

  if (gameState) {
    return <LiveGame state={gameState} home={home} away={away} assistMode={assistMode} onAssistModeChange={setAssistMode} onPlay={(call) => commitGame(resolvePlay(gameState, call))} onSimulate={() => commitGame(simulateToEnd(gameState))} onNewGame={() => { setGameState(null); setFinalReported(false) }} />
  }

  return <section className="route-page game-setup-page" aria-labelledby="single-title"><PageHeading eyebrow="JOGO ÚNICO · TRANSMISSÃO ASSISTIDA" title="PREPARE A PARTIDA" copy="O motor determinístico executa posses, relógio, placar e EventLog. Escolha quanto apoio deseja receber: explicações para aprender, pausas apenas nas decisões de risco ou piloto totalmente automático. As equipes e escudos são os registros reais do catálogo; sem rosters e ratings completos, os marcadores em campo seguem neutros." /><div className="single-game-board panel"><div className="matchup-row"><MatchSlot side="MANDANTE" franchise={home} value={homeId} onChange={selectHome} clubs={clubs} /><div className="versus">VS<small>PRÉ-JOGO · LOTE 15</small></div><MatchSlot side="VISITANTE" franchise={away} value={awayId} onChange={selectAway} clubs={clubs} /></div><div className="field-preview field-preview-cinematic" aria-hidden="true"><div className="yard-lines" /><span>CAMPO NEUTRO DE TRANSMISSÃO</span><small>ESTÁDIO ORIGINAL · ESCUDOS SOBREPOSTOS PELO HUD</small></div><div className="game-options"><div><span>REGRAS</span><strong>{home.leagueId === away.leagueId ? home.leagueId.toUpperCase() + ' 2026' : 'PROTOCOLO NEUTRO'}</strong></div><div><span>TRANSMISSÃO</span><strong>Auto + decisões táticas</strong></div><div><span>DURAÇÃO</span><strong>4 × 15 minutos</strong></div><button className="action-button primary" onClick={startGame}>INICIAR PARTIDA <span>›</span></button></div><section className="assist-mode-selector" aria-labelledby="assist-mode-title"><div><p className="eyebrow">LOTE 15 · CONTROLE DO TÉCNICO</p><h2 id="assist-mode-title">NÍVEL DE ASSISTÊNCIA</h2><p>O modo altera apenas quando a transmissão pausa; o SimEngine e a seed permanecem reproduzíveis.</p></div><div className="assist-mode-options" role="group" aria-label="Nível de assistência tática">{ASSIST_MODE_OPTIONS.map((option) => <button key={option.id} type="button" className={assistMode === option.id ? 'is-active' : ''} aria-pressed={assistMode === option.id} onClick={() => setAssistMode(option.id)}><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div></section></div><div className="content-callout"><span>✓</span><div><strong>Campo cinematográfico e transmissão assistida ativos.</strong><p>A imagem é uma arte original neutra. O Canvas usa o estado imutável do SimEngine, e os escudos publicados aparecem somente no HUD dos clubes escolhidos.</p></div></div></section>
}

function formatClock(clockMs: number) {
  const totalSeconds = Math.ceil(clockMs / 1000)
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

function LiveGame({ state, home, away, assistMode, onAssistModeChange, onPlay, onSimulate, onNewGame }: { state: GameState; home: NonNullable<ReturnType<typeof findFranchise>>; away: NonNullable<ReturnType<typeof findFranchise>>; assistMode: AssistMode; onAssistModeChange: (mode: AssistMode) => void; onPlay: (call: PlayCall) => void; onSimulate: () => void; onNewGame: () => void }) {
  const stats = projectStats(state)
  const visibleEvents = [...state.events].slice(-8).reverse()
  const offense = findFranchise(state.offenseId)
  const [autoplay, setAutoplay] = useState(true)
  const [pace, setPace] = useState<'broadcast' | 'quick'>('broadcast')
  const decision = tacticalDecision(state, assistMode)
  const debrief = state.status === 'final' ? createMatchDebrief(state) : null

  useEffect(() => {
    if (!autoplay || state.status === 'final' || decision) return undefined
    const timer = window.setTimeout(() => onPlay(recommendAutoPlay(state)), pace === 'quick' ? 550 : 1250)
    return () => window.clearTimeout(timer)
  }, [autoplay, decision, onPlay, pace, state])

  return <section className="route-page live-game-page" aria-labelledby="live-game-title">
    <div className="live-scorebug panel">
      <div className="score-team"><TeamMark franchise={away} /><strong>{away.name}</strong><b>{state.awayScore}</b></div>
      <div className="score-core"><span>{state.status === 'final' ? 'FINAL' : `${state.period}º QUARTO · ${formatClock(state.gameClockMs)}`}</span><strong>{state.status === 'final' ? 'PARTIDA ENCERRADA' : `${state.down}ª & ${state.distance} · JARDA ${state.ballSpot}`}</strong><small>POSSE · {offense?.name ?? '—'}</small></div>
      <div className="score-team score-team-home"><b>{state.homeScore}</b><strong>{home.name}</strong><TeamMark franchise={home} /></div>
    </div>
    <PageHeading eyebrow="TRANSMISSÃO TÁTICA · LOTES 10–12 + CICLOS 13–16" title={state.status === 'final' ? 'BOX SCORE FINAL' : 'JOGO AO VIVO'} copy="O SimEngine move a transmissão por conta própria e pede sua decisão em cenários de alto impacto. Campo, placar e EventLog vêm de um estado auditável; marcadores seguem neutros até rosters, ratings e uniformes terem cobertura autorizada." />
    <div className="live-game-grid">
      <article className="live-field-panel panel">
        <div className="field-labels"><span>LINHA DE SCRIMMAGE</span><span>PRIMEIRA DESCIDA</span><strong>{autoplay ? 'PILOTO TÁTICO ATIVO' : 'TRANSMISSÃO PAUSADA'}</strong></div>
        <div className="broadcast-field-stage">
          <div className="field-club-overlay field-club-away"><TeamMark franchise={away} /><span>VISITANTE</span><strong>{away.name}</strong></div>
          <div className="field-club-overlay field-club-home"><strong>{home.name}</strong><span>MANDANTE</span><TeamMark franchise={home} /></div>
          <FieldCanvas state={state} />
          <div className="broadcast-atmosphere" aria-hidden="true"><span>LIVE</span><i /></div>
        </div>
        <BroadcastControl state={state} autoplay={autoplay} pace={pace} assistMode={assistMode} decision={decision} onToggle={() => setAutoplay((current) => !current)} onPace={() => setPace((current) => current === 'broadcast' ? 'quick' : 'broadcast')} onAssistModeChange={() => onAssistModeChange(ASSIST_MODE_OPTIONS[(ASSIST_MODE_OPTIONS.findIndex((option) => option.id === assistMode) + 1) % ASSIST_MODE_OPTIONS.length].id)} onPlay={onPlay} />
        <CoachAssist state={state} assistMode={assistMode} onPlay={onPlay} />
        <div className="live-controls">
          <button className="action-button secondary" onClick={() => onPlay('short-pass')} disabled={state.status === 'final'}>PASSE CURTO</button>
          <button className="action-button secondary" onClick={() => onPlay('rush')} disabled={state.status === 'final'}>CORRIDA</button>
          <button className="action-button secondary" onClick={() => onPlay('punt')} disabled={state.status === 'final'}>PUNT</button>
          <button className="action-button secondary" onClick={() => onPlay('field-goal')} disabled={state.status === 'final'}>FIELD GOAL</button>
          <button className="action-button primary" onClick={onSimulate} disabled={state.status === 'final'}>SIMULAR ATÉ O FIM <span>›</span></button>
        </div>
      </article>
      <aside className="play-by-play panel"><div className="panel-heading"><span className="panel-icon">≋</span><div><p>EVENTLOG</p><h2>PLAY-BY-PLAY</h2></div></div><ol>{visibleEvents.map((event) => <li key={event.id}><span>{event.period}Q · {formatClock(event.clockMs)}</span><strong>{event.text}</strong></li>)}</ol></aside>
    </div>
    {debrief && <PostGameDebrief debrief={debrief} home={home} away={away} />}
    <section className="box-score panel" aria-label="Projeção de estatísticas derivada do EventLog"><div className="box-score-head"><p className="eyebrow">ESTATÍSTICAS PROJETADAS</p><strong>{away.name} <span>vs</span> {home.name}</strong></div>{[['Primeiras descidas', stats.away.firstDowns, stats.home.firstDowns], ['Jardas aéreas', stats.away.passingYards, stats.home.passingYards], ['Jardas terrestres', stats.away.rushingYards, stats.home.rushingYards], ['Turnovers', stats.away.turnovers, stats.home.turnovers], ['Touchdowns', stats.away.touchdowns, stats.home.touchdowns], ['Field goals', stats.away.fieldGoals, stats.home.fieldGoals]].map(([label, awayValue, homeValue]) => <div className="box-score-row" key={String(label)}><strong>{String(awayValue)}</strong><span>{String(label)}</span><strong>{String(homeValue)}</strong></div>)}<p className="engine-note">Seed: <code>{state.seed}</code> · versão: {state.engineVersion} · cada placar acima é consequência de eventos registrados.</p>{state.status === 'final' && <button className="action-button primary" onClick={onNewGame}>NOVA PARTIDA <span>↻</span></button>}</section>
  </section>
}

function PostGameDebrief({ debrief, home, away }: { debrief: ReturnType<typeof createMatchDebrief>; home: NonNullable<ReturnType<typeof findFranchise>>; away: NonNullable<ReturnType<typeof findFranchise>> }) {
  const teamName = (teamId: string | null) => teamId === home.id ? home.name : teamId === away.id ? away.name : 'SISTEMA'

  return <section className="postgame-debrief panel" aria-labelledby="debrief-title"><header><div><p className="eyebrow">LOTE 16 · SALA DE FILME</p><h2 id="debrief-title">RELATÓRIO DO TÉCNICO</h2></div><strong>{debrief.outcome}</strong></header><div className="debrief-grid"><article className="debrief-focus"><span>◈</span><div><p>PRÓXIMO FOCO</p><strong>{debrief.focus.label}</strong><small>{debrief.focus.detail}</small></div></article><article className="debrief-moments"><p>PONTOS DE VIRADA</p>{debrief.moments.length > 0 ? <ol>{debrief.moments.map((event) => <li key={event.id}><span>{event.period}Q · {teamName(event.teamId)}</span><strong>{event.text}</strong></li>)}</ol> : <div className="debrief-empty">Nenhum evento de virada foi registrado nesta execução.</div>}</article></div><footer>{debrief.context}</footer></section>
}

function BroadcastControl({ state, autoplay, pace, assistMode, decision, onToggle, onPace, onAssistModeChange, onPlay }: { state: GameState; autoplay: boolean; pace: 'broadcast' | 'quick'; assistMode: AssistMode; decision: ReturnType<typeof tacticalDecision>; onToggle: () => void; onPace: () => void; onAssistModeChange: () => void; onPlay: (call: PlayCall) => void }) {
  if (state.status === 'final') return <section className="broadcast-control is-final"><span>✓</span><div><strong>TRANSMISSÃO CONCLUÍDA</strong><small>O relatório final preserva a seed e todos os eventos gerados.</small></div></section>

  if (decision) return <section className="broadcast-decision" aria-live="assertive"><div className="decision-title"><span>!</span><div><p>{assistModeLabel(assistMode)} · PAUSA TÁTICA</p><strong>{decision.title}</strong><small>{decision.detail}</small></div></div><div className="decision-actions"><button className="action-button primary" onClick={() => onPlay(decision.recommended)}>SEGUIR AJUDA · {playLabel(decision.recommended)}</button>{decision.alternatives.filter((call, index, calls) => call !== decision.recommended && calls.indexOf(call) === index).map((call) => <button key={call} className="action-button secondary" onClick={() => onPlay(call)}>{playLabel(call)}</button>)}</div></section>

  return <section className="broadcast-control"><span className="broadcast-pulse" /><div><strong>{autoplay ? 'PILOTO TÁTICO EM CAMPO' : 'TRANSMISSÃO PAUSADA'}</strong><small>{autoplay ? `${assistModeLabel(assistMode)} · próxima chamada em ${pace === 'quick' ? 'ritmo rápido' : 'ritmo de transmissão'}.` : 'Use as chamadas abaixo ou retome o piloto.'}</small></div><button className="action-button secondary" onClick={onAssistModeChange}>AJUDA: {assistModeLabel(assistMode)}</button><button className="action-button secondary" onClick={onPace}>RITMO: {pace === 'broadcast' ? 'TV' : 'RÁPIDO'}</button><button className="action-button primary" onClick={onToggle}>{autoplay ? 'PAUSAR PILOTO' : 'RETOMAR PILOTO'}</button></section>
}

function CoachAssist({ state, assistMode, onPlay }: { state: GameState; assistMode: AssistMode; onPlay: (call: PlayCall) => void }) {
  const recommendation = state.status === 'final'
    ? { call: 'rush' as PlayCall, label: 'PARTIDA ENCERRADA', reason: 'Revise o box score e inicie uma nova partida quando quiser testar outro plano.' }
    : state.down === 4 && state.ballSpot >= 70
      ? { call: 'field-goal' as PlayCall, label: 'CHUTE PARA 3 PONTOS', reason: 'Quarta descida já em zona de pontuação: conserve a posse futura e some pontos.' }
      : state.down === 4
        ? { call: 'punt' as PlayCall, label: 'PUNT SEGURO', reason: 'Quarta descida fora de zona de chute: entregue a bola mais longe para reduzir o risco.' }
        : state.distance <= 3
          ? { call: 'short-pass' as PlayCall, label: 'PASSE CURTO', reason: 'Poucas jardas: uma chamada curta prioriza manter a campanha viva.' }
          : { call: 'rush' as PlayCall, label: 'CORRIDA CONTROLADA', reason: 'Leia a defesa primeiro. A corrida dá uma referência simples antes de arriscar uma jogada longa.' }

  const learningNote = assistMode === 'guided'
    ? 'Modo guiado: as pausas também explicam o contexto da descida.'
    : assistMode === 'strategic'
      ? 'Modo estratégico: a transmissão chama você só em pontos de risco.'
      : 'Modo automático: aplique esta leitura manualmente se quiser intervir.'

  return <section className="coach-assist" aria-label="Ajuda tática para a jogada atual"><span>✦</span><div><p>ASSISTENTE DO TÉCNICO · {assistModeLabel(assistMode)}</p><strong>{recommendation.label}</strong><small>{recommendation.reason}</small><em>{learningNote}</em></div><button className="action-button secondary" disabled={state.status === 'final'} onClick={() => onPlay(recommendation.call)}>APLICAR AJUDA <span>›</span></button></section>
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

function LeagueBadge({ leagueId, label }: { leagueId: 'nfl' | 'ufl' | 'ncaa-fbs' | 'ncaa-fcs'; label: string }) {
  const marks: Record<typeof leagueId, string> = { nfl: 'NFL', ufl: 'UFL', 'ncaa-fbs': 'FBS', 'ncaa-fcs': 'FCS' }
  return <span className={`league-badge ${leagueId}`}><b>{marks[leagueId]}</b><span>{label}</span></span>
}

function FranchiseSelectGrid({ clubs, selectedId, onSelect }: { clubs: NonNullable<ReturnType<typeof findFranchise>>[]; selectedId: string | null; onSelect: (franchiseId: string) => void }) {
  return <div className="franchise-select-grid" role="group" aria-label="Escolha visual de equipe">{clubs.map((club) => <button key={club.id} type="button" className={selectedId === club.id ? 'is-selected' : ''} aria-pressed={selectedId === club.id} onClick={() => onSelect(club.id)}><TeamMark franchise={club} /><span><strong>{club.name}</strong><small>{club.leagueId.toUpperCase()} · escudo registrado</small></span></button>)}</div>
}

function MatchSlot({ side, franchise, value, onChange, clubs }: { side: string; franchise: NonNullable<ReturnType<typeof findFranchise>>; value: string; onChange: (id: string) => void; clubs: NonNullable<ReturnType<typeof findFranchise>>[] }) {
  return <div className="match-slot"><span>{side}</span><TeamMark franchise={franchise} /><strong>{franchise.name}</strong><small>{franchise.leagueId.toUpperCase()} · identidade verificada</small><label className="match-select"><span className="sr-only">Equipe {side.toLowerCase()}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}</select></label></div>
}

function ContentDatabase() {
  const [leagueFilter, setLeagueFilter] = useState<'all' | 'nfl' | 'ufl'>('all')
  const sourceById = new Map(SOURCES_2026.map((source) => [source.id, source]))
  const franchises = leagueFilter === 'nfl' ? NFL_2026_FRANCHISES : leagueFilter === 'ufl' ? UFL_2026_FRANCHISES : [...NFL_2026_FRANCHISES, ...UFL_2026_FRANCHISES]
  const reports = leagueFilter === 'all' ? COVERAGE_REPORTS_2026 : COVERAGE_REPORTS_2026.filter((report) => report.leagueId === leagueFilter)

  return <section className="route-page" aria-labelledby="database-title"><PageHeading eyebrow="BANCO DE DADOS · LOTES 02–05" title="INVENTÁRIO REAL 2026" copy="Cada registro mostra fonte, data de corte e cobertura por campo. O catálogo não preenche nenhuma ausência com universidades, atletas, técnicos, escudos ou uniformes fictícios." /><div className="coverage-hero panel"><div><p className="eyebrow">SNAPSHOTS REGISTRADOS</p><h2>{CONTENT_COVERAGE.catalogLabel}</h2><p>{CONTENT_COVERAGE.sourceMessage}</p><div className="snapshot-chips">{LEAGUE_SNAPSHOTS_2026.map((snapshot) => <span className={`status-chip ${snapshot.coverageStatus}`} key={snapshot.seasonId}>{snapshot.leagueName} · {snapshot.coverageStatus}</span>)}</div></div><div className="coverage-score"><strong>{CONTENT_COVERAGE.completedFields}<small>/{CONTENT_COVERAGE.totalFields}</small></strong><span>frentes estruturais</span></div></div><div className="coverage-table panel"><div className="table-head"><span>CAMADA</span><span>STATUS</span><span>PRÓXIMA AÇÃO</span></div>{CONTENT_COVERAGE.layers.map((layer) => <div className="table-row" key={layer.name}><strong>{layer.name}</strong><span className={`status-pill ${layer.status}`}>{layer.status === 'pending' ? 'PENDENTE' : layer.status === 'partial' ? 'PARCIAL' : 'PRONTO'}</span><span>{layer.nextAction}</span></div>)}</div><section className="catalog-section panel" aria-labelledby="franchises-title"><div className="section-heading"><div><p className="eyebrow">IDENTIFICAÇÃO VERIFICADA</p><h2 id="franchises-title">FRANQUIAS REGISTRADAS</h2></div><div className="catalog-filter" role="group" aria-label="Filtrar franquias"><button className={leagueFilter === 'all' ? 'is-selected' : ''} onClick={() => setLeagueFilter('all')}>TODAS ({NFL_2026_FRANCHISES.length + UFL_2026_FRANCHISES.length})</button><button className={leagueFilter === 'nfl' ? 'is-selected' : ''} onClick={() => setLeagueFilter('nfl')}>NFL (32)</button><button className={leagueFilter === 'ufl' ? 'is-selected' : ''} onClick={() => setLeagueFilter('ufl')}>UFL (8)</button></div></div><div className="franchise-grid">{franchises.map((franchise) => <article className="franchise-row" key={franchise.id}><div className="franchise-mark">{franchise.name.split(' ').map((part) => part[0]).join('').slice(0, 3)}</div><div><strong>{franchise.name}</strong><span>{franchise.leagueId.toUpperCase()} {franchise.conference ? `· ${franchise.conference} ${franchise.division}` : '· liga única 2026'}</span></div><span className="status-pill ready">ID</span><span className="franchise-source">{franchise.sourceIds.map((sourceId) => sourceById.get(sourceId)?.label.split(' · ')[0]).filter(Boolean).join(' · ')}</span></article>)}</div><p className="catalog-note">Identidades e os escudos registrados dos catálogos NFL/UFL estão disponíveis. Uniformes, fotos, atletas, coaches e contratos continuam cobertos apenas quando cada fonte for importada.</p></section><section className="rules-grid" aria-label="Regras por competição">{RULESETS_2026.map((ruleset) => <article className="ruleset-card panel" key={ruleset.id}><div className="ruleset-top"><span className={`status-pill ${ruleset.coverageStatus}`}>{ruleset.coverageStatus === 'ready' ? 'PRONTO' : ruleset.coverageStatus === 'partial' ? 'PARCIAL' : 'PENDENTE'}</span><small>{ruleset.seasonId}</small></div><h2>{ruleset.displayName}</h2><ul>{ruleset.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul><div className="source-links">{ruleset.sourceIds.map((sourceId) => { const source = sourceById.get(sourceId); return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer">FONTE ↗</a> : null })}</div></article>)}</section><section className="coverage-report panel" aria-labelledby="report-title"><div className="section-heading"><div><p className="eyebrow">RELATÓRIO POR CAMPO</p><h2 id="report-title">COBERTURA DO SNAPSHOT</h2></div><span className="cutoff-label">CORTE · 11 OUT 2026</span></div>{reports.map((report) => <article className="report-row" key={report.leagueId}><header><div><strong>{report.label}</strong><span>{report.snapshotId}</span></div><div className="report-sources">{report.sourceIds.map((sourceId) => { const source = sourceById.get(sourceId); return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.label}</a> : null })}</div></header><div className="metric-grid">{report.metrics.map((metric) => { const percent = metric.expected ? Math.round((metric.completed / metric.expected) * 100) : 0; return <div className="metric" key={metric.field}><div><span>{metric.field}</span><strong>{metric.expected ? `${metric.completed}/${metric.expected}` : 'aguardando'}</strong></div><div className="metric-track"><i className={metric.status} style={{ width: `${percent}%` }} /></div></div> })}</div></article>)}</section><section className="catalog-bottom-grid"><article className="calendar-card panel"><p className="eyebrow">CALENDÁRIO IMPORTADO</p><h2>UFL · MARCOS 2026</h2>{CALENDAR_MILESTONES_2026.map((milestone) => <div className="milestone" key={milestone.id}><strong>{milestone.dateLabel}</strong><div><span>{milestone.label}</span><small>{milestone.detail}</small></div></div>)}<p className="muted">A tabela completa de 43 jogos ainda não foi adicionada ao bundle; o relatório mantém essa diferença visível.</p></article><article className="career-card panel"><p className="eyebrow">CENÁRIOS DE CARREIRA</p><h2>CAMINHO SEM ATALHOS</h2>{CAREER_SCENARIOS_2026.map((scenario) => <div className="career-scenario" key={scenario.id}><span className={`status-pill ${scenario.status}`}>{scenario.status === 'partial' ? 'PARCIAL' : 'PENDENTE'}</span><div><strong>{scenario.label}</strong><p>{scenario.requirement}</p></div></div>)}</article></section><div className="data-principles"><article><span>01</span><h2>SEM IDENTIDADES FICTÍCIAS</h2><p>Times, atletas, técnicos, uniformes e logos só entram após o registro correspondente.</p></article><article><span>02</span><h2>SNAPSHOT VERSIONADO</h2><p>Cada entrada fixa liga, temporada, fonte, data de corte e o status de cobertura.</p></article><article><span>03</span><h2>MODELO ≠ DADO OFICIAL</h2><p>Ratings futuros serão parâmetros de simulação, jamais estatística oficial declarada.</p></article></div></section>
}

function Settings({ profile, onChange, onSave, onExport, onImport, onRestore, onSaveSlot, onRestoreSlot, onListSlots }: { profile: CoachProfile; onChange: (profile: CoachProfile) => void; onSave: () => void; onExport: () => void; onImport: (file: File) => void; onRestore: () => void; onSaveSlot: (slot: NamedSaveSlotId) => Promise<boolean>; onRestoreSlot: (slot: NamedSaveSlotId) => Promise<boolean>; onListSlots: () => Promise<SaveSlotSummary[]> }) {
  const [slots, setSlots] = useState<SaveSlotSummary[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)

  async function refreshSlots() {
    setIsLoadingSlots(true)
    setSlots(await onListSlots())
    setIsLoadingSlots(false)
  }

  useEffect(() => {
    let isCurrent = true
    void onListSlots().then((nextSlots) => {
      if (!isCurrent) return
      setSlots(nextSlots)
      setIsLoadingSlots(false)
    })
    return () => { isCurrent = false }
  }, [onListSlots])

  async function handleSaveSlot(slot: NamedSaveSlotId) {
    if (await onSaveSlot(slot)) await refreshSlots()
  }

  async function handleRestoreSlot(slot: NamedSaveSlotId) {
    if (await onRestoreSlot(slot)) await refreshSlots()
  }

  return <section className="route-page settings-page" aria-labelledby="settings-title"><PageHeading eyebrow="AJUSTES · LOTE 14" title="PREFERÊNCIAS E SAVE" copy="Perfil, temporada, operações e carreira ficam salvos localmente. Além do espelho automático, você pode manter três arquivos manuais neste navegador." /><div className="settings-grid"><article className="panel"><p className="eyebrow">ACESSIBILIDADE</p><h2>EXPERIÊNCIA VISUAL</h2><label className="toggle-row"><span>Reduzir animações</span><input type="checkbox" checked={profile.reduceMotion} onChange={(event) => onChange({ ...profile, reduceMotion: event.target.checked })} /></label><p className="muted">A preferência respeita o controle do usuário. O sistema também segue as configurações de movimento reduzido do dispositivo.</p></article><article className="panel save-vault-panel"><p className="eyebrow">PERSISTÊNCIA</p><h2>COFRE DE SAVE</h2><p className="muted">Auto-save em localStorage com espelho no IndexedDB. Recupere o último espelho apenas neste navegador; ele substitui as escolhas locais atuais. O arquivo exportado contém somente escolhas e progresso local, sem dados ocultos de atletas ou clubes.</p><div className="save-actions"><button className="action-button primary" onClick={onSave}>SALVAR AGORA <span>✓</span></button><button className="action-button secondary" onClick={onRestore}>RECUPERAR ESPELHO <span>↻</span></button><button className="action-button secondary" onClick={onExport}>EXPORTAR SAVE <span>↓</span></button><label className="action-button secondary import-save-button">IMPORTAR SAVE <span>↑</span><input type="file" accept="application/json" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) onImport(file); event.currentTarget.value = '' }} /></label></div></article><article className="panel save-slots-panel"><div className="save-slots-heading"><div><p className="eyebrow">LOTE 14 · ARQUIVOS LOCAIS</p><h2>TRÊS SLOTS MANUAIS</h2><p>Salvar atualiza somente o arquivo escolhido. Restaurar substitui o perfil, a carreira, a seleção de catálogo e o plano local em uso.</p></div><button className="text-button" onClick={() => void refreshSlots()} disabled={isLoadingSlots}>{isLoadingSlots ? 'LENDO SLOTS…' : 'ATUALIZAR LISTA ↻'}</button></div><div className="save-slot-grid">{slots.map((slot) => <article className={`save-slot ${slot.hasSave ? 'has-save' : 'is-empty'}`} key={slot.id}><div className="save-slot-label"><span>{slot.id.slice(-1)}</span><strong>{slot.label}</strong></div>{slot.hasSave ? <div className="save-slot-details"><b>{slot.coachName}</b><small>NÍVEL {slot.level ?? '—'} · SEMANA {slot.developmentWeek ?? '—'}</small><small>{formatSaveTimestamp(slot.exportedAt)}</small></div> : <div className="save-slot-details"><b>ARQUIVO VAZIO</b><small>Disponível para a sua próxima cópia.</small></div>}<div className="save-slot-actions"><button className="action-button secondary" onClick={() => void handleSaveSlot(slot.id)}>SALVAR AQUI <span>↓</span></button><button className="action-button primary" disabled={!slot.hasSave} onClick={() => void handleRestoreSlot(slot.id)}>RESTAURAR <span>↻</span></button></div></article>)}</div><p className="muted save-slot-note">Os slots ficam apenas neste dispositivo/navegador. Exporte um arquivo JSON para manter uma cópia fora dele.</p></article></div></section>
}

function formatSaveTimestamp(value: string | null) {
  if (!value) return 'Data indisponível'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data indisponível'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date)
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
