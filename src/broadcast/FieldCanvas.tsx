import { useEffect, useRef } from 'react'
import type { GameState } from '../sim/types'

function fieldX(state: GameState) {
  const spot = state.direction === 'right' ? state.ballSpot : 100 - state.ballSpot
  return 0.1 + (spot / 100) * 0.8
}

export function FieldCanvas({ state }: { state: GameState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof CanvasRenderingContext2D === 'undefined') return
    const rect = canvas.getBoundingClientRect()
    const pixelRatio = window.devicePixelRatio || 1
    const width = Math.max(360, Math.round(rect.width || 760))
    const height = Math.max(230, Math.round(rect.height || 330))
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    const context = canvas.getContext('2d')
    if (!context) return
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    context.clearRect(0, 0, width, height)

    const left = width * 0.08
    const top = height * 0.09
    const fieldWidth = width * 0.84
    const fieldHeight = height * 0.82
    const endZone = fieldWidth * 0.09
    context.fillStyle = '#123b2c'
    context.fillRect(left, top, fieldWidth, fieldHeight)
    context.fillStyle = '#173c6d'
    context.fillRect(left, top, endZone, fieldHeight)
    context.fillStyle = '#8f1830'
    context.fillRect(left + fieldWidth - endZone, top, endZone, fieldHeight)
    context.strokeStyle = 'rgba(235, 252, 240, .7)'
    context.lineWidth = 1
    for (let yard = 0; yard <= 100; yard += 5) {
      const x = left + endZone + (yard / 100) * (fieldWidth - endZone * 2)
      context.beginPath()
      context.moveTo(x, top)
      context.lineTo(x, top + fieldHeight)
      context.stroke()
    }
    context.setLineDash([3, 5])
    context.beginPath()
    context.moveTo(left + endZone, top + fieldHeight / 2)
    context.lineTo(left + fieldWidth - endZone, top + fieldHeight / 2)
    context.stroke()
    context.setLineDash([])

    const ballX = left + fieldX(state) * fieldWidth
    const firstDownOffset = state.direction === 'right' ? state.distance : -state.distance
    const firstDownX = left + fieldX({ ...state, ballSpot: Math.max(0, Math.min(100, state.ballSpot + firstDownOffset)) }) * fieldWidth
    context.strokeStyle = '#3a9cff'
    context.lineWidth = 3
    context.beginPath()
    context.moveTo(ballX, top)
    context.lineTo(ballX, top + fieldHeight)
    context.stroke()
    context.strokeStyle = '#f3cf43'
    context.beginPath()
    context.moveTo(firstDownX, top)
    context.lineTo(firstDownX, top + fieldHeight)
    context.stroke()

    const attackColor = state.offenseId === state.homeTeamId ? '#e53b55' : '#2e91f0'
    const defenseColor = state.offenseId === state.homeTeamId ? '#2e91f0' : '#e53b55'
    const drawUnit = (color: string, side: number) => {
      for (let index = 0; index < 11; index += 1) {
        const column = Math.floor(index / 4)
        const row = index % 4
        const x = ballX + side * (20 + column * 19)
        const y = top + fieldHeight * (0.18 + row * 0.19) + (column % 2) * 8
        context.beginPath()
        context.fillStyle = color
        context.arc(x, y, 8, 0, Math.PI * 2)
        context.fill()
        context.strokeStyle = '#eaf7ff'
        context.lineWidth = 1
        context.stroke()
      }
    }
    drawUnit(attackColor, state.direction === 'right' ? -1 : 1)
    drawUnit(defenseColor, state.direction === 'right' ? 1 : -1)
    context.fillStyle = '#f4bf48'
    context.beginPath()
    context.arc(ballX, top + fieldHeight / 2, 5, 0, Math.PI * 2)
    context.fill()
  }, [state])

  return <canvas className="live-field-canvas" ref={canvasRef} aria-label="Campo tático 2D com marcadores neutros" />
}
