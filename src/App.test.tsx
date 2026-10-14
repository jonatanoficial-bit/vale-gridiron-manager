import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { NFL_2026_FRANCHISES, RIGHTS_ASSET_MANIFEST_2026, RULESETS_2026, UFL_2026_FRANCHISES } from './data/catalog-2026'
import { BILLS_2026_ROSTER, BILLS_2026_ROSTER_IMPORT, BILLS_2026_STAFF, BILLS_2026_STAFF_CONTRACTS } from './data/roster-2026'
import App from './App'

describe('Lotes 01 a 06', () => {
  beforeEach(() => {
    window.location.hash = '#/'
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('boots with the three game modes visible', () => {
    render(<App />)
    expect(screen.getByRole('img', { name: /vale gridiron manager/i })).toHaveAttribute('src', '/brand/vale-gridiron-manager.png')
    expect(screen.getByRole('heading', { name: /construa/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /modo carreira/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /temporada sandbox/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /jogo único/i })).toBeInTheDocument()
  })

  it('opens the career route, persists a coach profile and confirms the next step', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /começar carreira/i }))
    expect(screen.getByRole('heading', { name: /sua jornada começa aqui/i })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/nome do técnico/i), { target: { value: 'Alex' } })
    fireEvent.click(screen.getByRole('button', { name: /tático sob pressão/i }))
    fireEvent.click(screen.getByRole('button', { name: /salvar perfil/i }))
    expect(window.localStorage.getItem('vale-gridiron-manager:coach-profile:v1')).toContain('Alex')
    expect(window.localStorage.getItem('vale-gridiron-manager:coach-profile:v1')).toContain('rain-tactician')
    expect(screen.getByRole('img', { name: /avatar fictício: tático sob pressão/i })).toHaveAttribute('src', '/avatars/coach-rain-tactician.png')
    expect(screen.getByRole('status')).toHaveTextContent(/perfil salvo/i)
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
  })

  it('creates a user-coach dossier without inventing a real job or contract', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /começar carreira/i }))
    fireEvent.change(screen.getByLabelText(/nome do técnico/i), { target: { value: 'Alex' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar dossiê/i }))
    expect(screen.getByRole('heading', { name: /central da carreira/i })).toBeInTheDocument()
    expect(screen.getByText(/0 vagas verificadas/i)).toBeInTheDocument()
    expect(window.localStorage.getItem('vale-gridiron-manager:career-progress:v1')).toContain('user-coach-alex-v1')
    fireEvent.click(screen.getByRole('button', { name: /registrar leitura/i }))
    expect(screen.getByText('135')).toBeInTheDocument()
  })

  it('keeps the catalog factual: 32 NFL teams, 8 UFL teams and four separate rulesets', () => {
    expect(NFL_2026_FRANCHISES).toHaveLength(32)
    expect(UFL_2026_FRANCHISES).toHaveLength(8)
    expect(new Set(NFL_2026_FRANCHISES.map((team) => team.id)).size).toBe(32)
    expect(new Set(RULESETS_2026.map((ruleset) => ruleset.leagueId))).toEqual(new Set(['nfl', 'ncaa-fbs', 'ncaa-fcs', 'ufl']))
    expect(RIGHTS_ASSET_MANIFEST_2026).toHaveLength(40)
    expect(RIGHTS_ASSET_MANIFEST_2026.every((asset) => asset.contentRightsStatus === 'pending')).toBe(true)
  })

  it('persists an explicitly selected real team for the sandbox', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /abrir sandbox/i }))
    fireEvent.change(screen.getByLabelText(/equipe real/i), { target: { value: 'nfl-buffalo-bills' } })
    expect(window.localStorage.getItem('vale-gridiron-manager:catalog-selection:v1')).toContain('nfl-buffalo-bills')
    expect(screen.getByText(/buffalo bills selecionado/i)).toBeInTheDocument()
  })

  it('uses the registered Buffalo Bills crest in the single-game selection', () => {
    window.location.hash = '#/jogo-unico'
    render(<App />)
    expect(screen.getByRole('img', { name: /buffalo bills.*escudo publicado/i })).toHaveAttribute('src', '/assets-real/nfl/buf.png')
  })

  it('opens a deterministic 2D game from the single-game setup', () => {
    window.location.hash = '#/jogo-unico'
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /iniciar partida/i }))
    expect(screen.getByRole('heading', { name: /jogo ao vivo/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/campo tático 2d/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /passe curto/i })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: /passe curto/i }))
    expect(screen.getByText(/play-by-play/i)).toBeInTheDocument()
  })

  it('keeps the Buffalo Bills import auditable and without invented contracts or ratings', () => {
    expect(BILLS_2026_ROSTER).toHaveLength(77)
    expect(BILLS_2026_ROSTER_IMPORT.rowCount).toBe(BILLS_2026_ROSTER.length)
    expect(BILLS_2026_ROSTER_IMPORT.duplicateCount).toBe(0)
    expect(new Set(BILLS_2026_ROSTER.map((player) => player.id)).size).toBe(BILLS_2026_ROSTER.length)
    expect(BILLS_2026_ROSTER.find((player) => player.name === 'Josh Allen')).toMatchObject({ jerseyNumber: 17, position: 'QB', rosterStatus: 'ACT', contractStatus: 'pending', simulationAttributeStatus: 'pending' })
    expect(BILLS_2026_STAFF).toHaveLength(4)
    expect(BILLS_2026_STAFF_CONTRACTS).toEqual([expect.objectContaining({ staffId: 'nfl-2026-buffalo-bills-joe-brady', durationYears: 5, salary: null, contractStatus: 'partial' })])
  })

  it('opens the audited roster route with its official player link', () => {
    window.location.hash = '#/elenco'
    render(<App />)
    expect(screen.getByRole('heading', { name: /dados reais, sem atalhos/i })).toBeInTheDocument()
    expect(screen.getByText('77 de 77 linhas publicadas')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Josh Allen' })).toHaveAttribute('href', 'https://www.nfl.com/players/josh-allen/')
  })
})
