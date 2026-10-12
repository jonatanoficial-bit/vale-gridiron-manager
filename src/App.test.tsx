import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('Lote 01 shell', () => {
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
})
