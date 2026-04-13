// src/components/hoy/EventoDelDia.jsx
import { useState } from 'react'
import { hoyISO } from '../../utils/dates'
import { PERSONAJES, PersonajeSprite } from '../../constants'
import RetoProposalModal from './RetoProposalModal'

function diaDelAno(fechaISO) {
  const d = new Date(fechaISO + 'T00:00:00')
  const inicio = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - inicio) / (1000 * 60 * 60 * 24))
}

// Determina el evento del día de forma determinística
export function getEventoHoy() {
  const dia = diaDelAno(hoyISO())
  // Patrón: cada 7 días hay un evento especial
  const tipo = dia % 7
  if (tipo === 0) return { tipo: 'companero', personajeIdx: dia % 20 }
  if (tipo === 3) return { tipo: 'suerte' }
  if (tipo === 5) return { tipo: 'doblexp' }
  return null // días normales (4 de cada 7)
}

// Export para que otros componentes (useXp) sepan el bonus del día
export function getBonusDia() {
  const evento = getEventoHoy()
  if (!evento) return 1
  if (evento.tipo === 'suerte') return 1 // +5 XP extra (se aplica en useXp)
  if (evento.tipo === 'doblexp') return 2
  return 1
}
export function getXpExtraDia() {
  const evento = getEventoHoy()
  if (evento?.tipo === 'suerte') return 5
  return 0
}

function EventoSuerte({ onClose }) {
  return (
    <div className="mx-4 mb-3 p-3 animate-card-entrance" style={{
      background: 'linear-gradient(135deg, #1e2a10 0%, #1a1520 100%)',
      border: '2px solid #50c878',
      borderRadius: '2px',
      boxShadow: '4px 4px 0 rgba(80,200,120,0.3)',
    }}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-pixel text-[10px]" style={{ color: '#50c878' }}>🍀 DÍA DE SUERTE</span>
        <button onClick={onClose} className="font-pixel text-[10px] text-text-muted px-1">✕</button>
      </div>
      <p className="font-body text-[13px] text-text-primary leading-snug">
        Hoy cada <span style={{ color: '#50c878', fontWeight: 700 }}>LOGRADO</span> te da <span style={{ color: '#ffd700', fontWeight: 700 }}>+5 XP extra</span>. ¡Aprovéchalo!
      </p>
    </div>
  )
}

function EventoDobleXp({ onClose }) {
  return (
    <div className="mx-4 mb-3 p-3 animate-card-entrance" style={{
      background: 'linear-gradient(135deg, #1a1e35 0%, #1a1520 100%)',
      border: '2px solid #4488cc',
      borderRadius: '2px',
      boxShadow: '4px 4px 0 rgba(68,136,204,0.3)',
    }}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-pixel text-[10px]" style={{ color: '#4488cc' }}>⚡ DÍA DE PODER</span>
        <button onClick={onClose} className="font-pixel text-[10px] text-text-muted px-1">✕</button>
      </div>
      <p className="font-body text-[13px] text-text-primary leading-snug">
        Hoy ganas el <span style={{ color: '#ffd700', fontWeight: 700 }}>DOBLE de XP</span> por cada logro. ¡Es tu momento!
      </p>
    </div>
  )
}

function EventoCompanero({ personaje, onClose }) {
  const frases = personaje.frases || []
  const dia = diaDelAno(hoyISO())
  const frase = frases.length > 0 ? frases[dia % frases.length] : '...'
  const [showRetoModal, setShowRetoModal] = useState(false)

  return (
    <div className="mx-4 mb-3 p-3 animate-card-entrance" style={{
      background: 'linear-gradient(180deg, #2a2035 0%, #1a1520 100%)',
      border: `2px solid ${personaje.glowColor}60`,
      borderLeft: `3px solid ${personaje.glowColor}`,
      borderRadius: '2px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.6)',
    }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[9px]" style={{ color: personaje.glowColor }}>
            ✦ COMPAÑERO VIAJERO
          </span>
        </div>
        <button onClick={onClose} className="font-pixel text-[10px] text-text-muted px-1">✕</button>
      </div>
      <div className="flex items-start gap-3">
        <div style={{
          flexShrink: 0,
          padding: '6px',
          background: `${personaje.glowColor}15`,
          border: `2px solid ${personaje.glowColor}40`,
          borderRadius: '2px',
        }}>
          <PersonajeSprite personaje={personaje} size={40} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[10px] mb-1" style={{ color: personaje.glowColor }}>
            {personaje.nombre}
          </p>
          <p className="font-body text-[13px] leading-snug" style={{ color: '#e8e6e3', fontStyle: 'italic' }}>
            "{frase}"
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowRetoModal(true)}
        className="mt-2 w-full py-2 font-pixel text-[9px] active:translate-y-[1px]"
        style={{
          background: `${personaje.glowColor}15`,
          border: `2px solid ${personaje.glowColor}60`,
          borderRadius: '2px',
          color: personaje.glowColor,
          boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
        }}
      >
        ⚔ PROPONER RETO
      </button>
      {showRetoModal && (
        <RetoProposalModal
          personaje={personaje}
          onClose={() => setShowRetoModal(false)}
        />
      )}
    </div>
  )
}

export default function EventoDelDia() {
  const [cerrado, setCerrado] = useState(false)
  const evento = getEventoHoy()

  if (cerrado || !evento) return null

  if (evento.tipo === 'suerte') return <EventoSuerte onClose={() => setCerrado(true)} />
  if (evento.tipo === 'doblexp') return <EventoDobleXp onClose={() => setCerrado(true)} />
  if (evento.tipo === 'companero') {
    const personaje = PERSONAJES[evento.personajeIdx % PERSONAJES.length]
    return <EventoCompanero personaje={personaje} onClose={() => setCerrado(true)} />
  }
  return null
}
