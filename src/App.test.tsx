import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { NFL_2026_FRANCHISES, RIGHTS_ASSET_MANIFEST_2026, RULESETS_2026, UFL_2026_FRANCHISES } from './data/catalog-2026'
import App from './App'

describe('Lotes 01 e 02', () => {
  beforeEach(() => {
    window.location.hash = '#/'
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('boots with the three game modes visible', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /construa/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /modo carreira/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /temporada sandbox/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /jogo único/i })).toBeInTheDocument()
  })

  it('opens the career route and persists a coach profile', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /começar carreira/i }))
    expect(screen.getByRole('heading', { name: /sua jornada começa aqui/i })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/nome do técnico/i), { target: { value: 'Alex' } })
    fireEvent.click(screen.getByRole('button', { name: /salvar perfil/i }))
    expect(window.localStorage.getItem('vale-gridiron-manager:coach-profile:v1')).toContain('Alex')
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
})
