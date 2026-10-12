import { useEffect, useMemo, useState } from 'react'
import { CONTENT_COVERAGE } from './data/content-status'
import type { CoachProfile, GameMode, Route } from './domain/contracts'
import { loadCoachProfile, saveCoachProfile } from './lib/persistence'
import './App.css'

const routes: Record<Route, string> = {
  inicio: '#/',
  carreira: '#/carreira',
  temporada: '#/temporada',
  jogoUnico: '#/jogo-unico',
  banco: '#/banco-de-dados',
  configuracoes: '#/configuracoes',
}

const routeLabels: Record<Route, string> = {
  inicio: 'Início',
  carreira: 'Carreira',
  temporada: 'Temporada',
  jogoUnico: 'Jogo único',
  banco: 'Banco de dados',
  configuracoes: 'Ajustes',
}

function getRouteFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/carreira') return 'carreira'
  if (hash === '#/temporada') return 'temporada'
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
        {route === 'temporada' && <Sandbox onNavigate={handleNavigation} />}
        {route === 'jogoUnico' && <SingleGame onNavigate={handleNavigation} />}
        {route === 'banco' && <ContentDatabase />}
        {route === 'configuracoes' && <Settings profile={profile} onChange={setProfile} onSave={persistProfile} />}
      </main>

      <footer className="app-footer">
        <span>LOTE 01 · FUNDAÇÃO TÉCNICA</span>
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
    { route: 'jogoUnico', icon: '◉' },
    { route: 'banco', icon: '▤' },
  ]

  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={() => onNavigate('inicio')} aria-label="Ir para o início">
        <span className="brand-overline">VALE</span>
        <span className="brand-name">GRIDIRON</span>
        <span className="brand-subtitle">MANAGER</span>
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
          <p className="eyebrow"><span className="pulse-dot" /> TEMPORADA DE ESTREIA · LOTE 01</p>
          <h1 id="lobby-title">CONSTRUA<br /><em>O SEU LEGADO.</em></h1>
          <p className="hero-lead">Uma fundação real para o manager de futebol americano: decisões, saves e modos de jogo começam aqui.</p>
          <div className="hero-actions">
            <button className="action-button primary" onClick={() => onNavigate('carreira')}>COMEÇAR CARREIRA <span>›</span></button>
            <button className="action-button secondary" onClick={() => onNavigate('banco')}>VER CATÁLOGO <span>↗</span></button>
          </div>
          <div className="integrity-note">
            <span className="integrity-icon" aria-hidden="true">✓</span>
            <span>Integridade de conteúdo: {coverageLabel}. Nenhuma identidade inventada é exibida.</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="stadium-lights light-left" />
          <div className="stadium-lights light-right" />
          <div className="hero-crest"><span>VGM</span><small>EST. 2026</small></div>
          <div className="field-lines" />
          <div className="hero-number">01</div>
        </div>
      </div>

      <div className="mode-strip" aria-label="Selecione um modo de jogo">
        <ModeCard number="01" title="Modo Carreira" text="Crie o perfil do técnico e acompanhe a evolução da sua trajetória." action="CRIAR TÉCNICO" mode="career" onClick={() => onNavigate('carreira')} />
        <ModeCard number="02" title="Temporada Sandbox" text="Configure uma temporada quando o catálogo real estiver validado." action="ABRIR SANDBOX" mode="season" onClick={() => onNavigate('temporada')} />
        <ModeCard number="03" title="Jogo Único" text="Prepare uma partida avulsa com dados que já tenham cobertura." action="CONFIGURAR JOGO" mode="game" onClick={() => onNavigate('jogoUnico')} />
      </div>

      <section className="foundation-grid" aria-label="Status da fundação">
        <FoundationPanel kicker="ROTAS" title="3 MODOS, 3 FLUXOS" value="ONLINE" description="Carreira, temporada sandbox e jogo único já possuem telas próprias e navegáveis." />
        <FoundationPanel kicker="SAVE LOCAL" title="PERFIL DO TÉCNICO" value="ATIVO" description="Rascunho persistente no navegador, pronto para evoluir para IndexedDB no Lote 11." />
        <FoundationPanel kicker="DADOS" title="CATÁLOGO REAL" value="PENDENTE" description="Estrutura e status declarados; a importação do inventário é trabalho do Lote 02." warn />
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
      <PageHeading eyebrow="MODO CARREIRA" title="SUA JORNADA COMEÇA AQUI" copy="Defina o perfil do técnico. As vagas reais serão liberadas somente depois da validação do catálogo no Lote 02." />
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
          <p className="eyebrow">PRÓXIMA ETAPA</p><h2>VAGAS REAIS</h2>
          <div className="pending-state"><span>!</span><div><strong>Catálogo ainda não importado</strong><p>Não há universidades fictícias para preencher este espaço.</p></div></div>
          <button className="text-button" onClick={() => onNavigate('banco')}>CONSULTAR COBERTURA DO CATÁLOGO <span>›</span></button>
        </aside>
      </div>
      <section className="timeline panel"><div className="panel-heading"><span className="panel-icon">◌</span><div><p>FLUXO PLANEJADO</p><h2>CICLO DA SEMANA</h2></div></div><ol>{['Caixa de entrada', 'Treino', 'Plano de jogo', 'Partida', 'Relatórios'].map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><p className="muted">Os itens acima definem a estrutura de navegação do Lote 01; o motor esportivo será desenvolvido no Lote 04.</p></section>
    </section>
  )
}

function Sandbox({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <section className="route-page" aria-labelledby="sandbox-title"><PageHeading eyebrow="TEMPORADA SANDBOX" title="CONFIGURE O SEU CENÁRIO" copy="O modo está preparado para receber ligas, calendários e equipes reais versionadas por temporada." /><div className="setup-layout"><article className="setup-steps panel"><p className="eyebrow">CONFIGURAÇÃO 01/03</p><h2>SELEÇÃO DE CONTEÚDO</h2><label>Liga<select disabled><option>Disponível após o Lote 02</option></select></label><label>Snapshot da temporada<select disabled><option>Nenhum snapshot validado</option></select></label><label>Equipe<select disabled><option>Catálogo pendente</option></select></label><div className="inline-notice"><span>!</span>A seleção permanece bloqueada até que a cobertura factual esteja completa.</div></article><aside className="setup-status panel"><p className="eyebrow">INTEGRIDADE</p><h2>SEM DADOS DE FACHADA</h2><div className="status-meter"><span>Catálogo real</span><strong>0%</strong><div><i /></div></div><div className="status-meter"><span>Regras por temporada</span><strong>0%</strong><div><i /></div></div><div className="status-meter"><span>Calendários verificados</span><strong>0%</strong><div><i /></div></div><button className="action-button secondary full" onClick={() => onNavigate('banco')}>VER PENDÊNCIAS <span>↗</span></button></aside></div></section>
}

function SingleGame({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return <section className="route-page" aria-labelledby="single-title"><PageHeading eyebrow="JOGO ÚNICO" title="PREPARE A PARTIDA" copy="A tela já define o fluxo. Ela só permitirá iniciar uma partida quando dois clubes e as regras do snapshot estiverem validados." /><div className="single-game-board panel"><div className="matchup-row"><MatchSlot side="MANDANTE" /><div className="versus">VS<small>AGUARDANDO DADOS</small></div><MatchSlot side="VISITANTE" /></div><div className="field-preview" aria-hidden="true"><div className="yard-lines" /><span>CAMPO DE JOGO</span><small>RENDER 2D · LOTE 05</small></div><div className="game-options"><div><span>REGRAS</span><strong>Snapshot pendente</strong></div><div><span>ESTÁDIO</span><strong>Conteúdo pendente</strong></div><div><span>DURAÇÃO</span><strong>A definir por liga</strong></div><button className="action-button primary" disabled>INICIAR PARTIDA <span>›</span></button></div></div><div className="content-callout"><span>▤</span><div><strong>Próxima dependência: inventário técnico real.</strong><p>O modo será conectado ao SimEngine determinístico no Lote 04 e à transmissão 2D no Lote 05.</p></div><button className="text-button" onClick={() => onNavigate('banco')}>ABRIR STATUS <span>›</span></button></div></section>
}

function MatchSlot({ side }: { side: string }) { return <div className="match-slot"><span>{side}</span><div className="empty-crest">?</div><strong>CONTEÚDO PENDENTE</strong><small>Nenhuma equipe exibida</small></div> }

function ContentDatabase() {
  return <section className="route-page" aria-labelledby="database-title"><PageHeading eyebrow="BANCO DE DADOS" title="STATUS DO CONTEÚDO REAL" copy="Toda entrada futura terá fonte, data de corte e status de direitos. Este lote não preenche lacunas com dados inventados." /><div className="coverage-hero panel"><div><p className="eyebrow">SNAPSHOT</p><h2>{CONTENT_COVERAGE.catalogLabel}</h2><p>{CONTENT_COVERAGE.sourceMessage}</p></div><div className="coverage-score"><strong>{CONTENT_COVERAGE.completedFields}<small>/{CONTENT_COVERAGE.totalFields}</small></strong><span>campos verificados</span></div></div><div className="coverage-table panel"><div className="table-head"><span>CAMADA</span><span>STATUS</span><span>PRÓXIMA AÇÃO</span></div>{CONTENT_COVERAGE.layers.map((layer) => <div className="table-row" key={layer.name}><strong>{layer.name}</strong><span className={`status-pill ${layer.status}`}>{layer.status === 'pending' ? 'PENDENTE' : 'PRONTO'}</span><span>{layer.nextAction}</span></div>)}</div><div className="data-principles"><article><span>01</span><h2>SEM IDENTIDADES FICTÍCIAS</h2><p>Times, atletas, técnicos, uniformes e logos só entram após o registro correspondente.</p></article><article><span>02</span><h2>SNAPSHOT VERSIONADO</h2><p>O conteúdo deve carregar liga, temporada, fonte e data de corte claramente declaradas.</p></article><article><span>03</span><h2>MODELO ≠ DADO OFICIAL</h2><p>Ratings futuros serão classificados como parâmetros de simulação, nunca como estatística oficial.</p></article></div></section>
}

function Settings({ profile, onChange, onSave }: { profile: CoachProfile; onChange: (profile: CoachProfile) => void; onSave: () => void }) {
  return <section className="route-page" aria-labelledby="settings-title"><PageHeading eyebrow="AJUSTES" title="PREFERÊNCIAS LOCAIS" copy="As configurações abaixo pertencem ao protótipo do Lote 01 e ficam armazenadas apenas neste navegador." /><div className="settings-grid"><article className="panel"><p className="eyebrow">ACESSIBILIDADE</p><h2>EXPERIÊNCIA VISUAL</h2><label className="toggle-row"><span>Reduzir animações</span><input type="checkbox" checked={profile.reduceMotion} onChange={(event) => onChange({ ...profile, reduceMotion: event.target.checked })} /></label><p className="muted">A preferência será aplicada aos efeitos de transição quando a camada de movimento for adicionada.</p></article><article className="panel"><p className="eyebrow">PERSISTÊNCIA</p><h2>SAVE LOCAL</h2><p className="muted">O perfil usa localStorage neste lote. A migração para slots em IndexedDB está planejada para o Lote 11.</p><button className="action-button primary full" onClick={onSave}>SALVAR AGORA <span>✓</span></button></article></div></section>
}

function PageHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></header> }

export default App
