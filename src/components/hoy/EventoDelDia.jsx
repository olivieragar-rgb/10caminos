// src/components/hoy/EventoDelDia.jsx
import { useState, useEffect } from 'react'
import { db } from '../../db'
import { hoyISO } from '../../utils/dates'
import { PERSONAJES, PersonajeSprite } from '../../constants'
import RetoProposalModal from './RetoProposalModal'
import ChallengeResultPopup from '../shared/ChallengeResultPopup'

function diaDelAno(fechaISO) {
  const d = new Date(fechaISO + 'T00:00:00')
  const inicio = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - inicio) / (1000 * 60 * 60 * 24))
}

// Determina el evento del día de forma determinística
export function getEventoHoy() {
  const dia = diaDelAno(hoyISO())
  const tipo = dia % 7
  if (tipo === 0) return { tipo: 'companero', personajeIdx: dia % 20 }
  if (tipo === 3) return { tipo: 'suerte' }
  if (tipo === 5) return { tipo: 'doblexp' }
  return null
}

export function getBonusDia() {
  const evento = getEventoHoy()
  if (!evento) return 1
  if (evento.tipo === 'suerte') return 1
  if (evento.tipo === 'doblexp') return 2
  return 1
}
export function getXpExtraDia() {
  const evento = getEventoHoy()
  if (evento?.tipo === 'suerte') return 5
  return 0
}

// ── Evento Suerte ─────────────────────────────────────────────────────────────
function EventoSuerte({ onClose }) {
  const [activado, setActivado] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleActivar = () => {
    setActivado(true)
    setShowPopup(true)
  }

  return (
    <>
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
        <p className="font-body text-[13px] text-text-primary leading-snug mb-3">
          Hoy cada <span style={{ color: '#50c878', fontWeight: 700 }}>LOGRADO</span> te da{' '}
          <span style={{ color: '#ffd700', fontWeight: 700 }}>+5 XP extra</span>. ¡Aprovéchalo!
        </p>
        {!activado ? (
          <button
            onClick={handleActivar}
            className="w-full py-2 font-pixel text-[9px] active:translate-y-[1px]"
            style={{
              background: 'linear-gradient(180deg, #2a4520, #1e2a10)',
              border: '2px solid #50c878',
              borderRadius: '2px',
              color: '#50c878',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.4), 0 0 8px #50c87830',
            }}
          >
            🍀 ACTIVAR BONO DE SUERTE
          </button>
        ) : (
          <p className="font-pixel text-[8px] text-center" style={{ color: '#50c87880' }}>
            ✓ Bono activado
          </p>
        )}
      </div>

      {showPopup && (
        <ChallengeResultPopup
          type="bonus"
          xp={0}
          titulo="¡BONO DE SUERTE ACTIVADO!"
          mensaje="+5 XP extra en cada LOGRADO de hoy. La suerte favorece al constante."
          onClose={() => { setShowPopup(false); onClose() }}
        />
      )}
    </>
  )
}

// ── Evento Doble XP ───────────────────────────────────────────────────────────
function EventoDobleXp({ onClose }) {
  const [activado, setActivado] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleActivar = () => {
    setActivado(true)
    setShowPopup(true)
  }

  return (
    <>
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
        <p className="font-body text-[13px] text-text-primary leading-snug mb-3">
          Hoy ganas el <span style={{ color: '#ffd700', fontWeight: 700 }}>DOBLE de XP</span> por cada logro. ¡Es tu momento!
        </p>
        {!activado ? (
          <button
            onClick={handleActivar}
            className="w-full py-2 font-pixel text-[9px] active:translate-y-[1px]"
            style={{
              background: 'linear-gradient(180deg, #1e2845, #1a1e35)',
              border: '2px solid #4488cc',
              borderRadius: '2px',
              color: '#4488cc',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.4), 0 0 8px #4488cc30',
            }}
          >
            ⚡ ACTIVAR DOBLE XP
          </button>
        ) : (
          <p className="font-pixel text-[8px] text-center" style={{ color: '#4488cc80' }}>
            ✓ Doble XP activo
          </p>
        )}
      </div>

      {showPopup && (
        <ChallengeResultPopup
          type="bonus"
          xp={0}
          titulo="¡DOBLE XP ACTIVADO!"
          mensaje="Cada LOGRADO de hoy vale el doble. No desperdicies ni un camino."
          onClose={() => { setShowPopup(false); onClose() }}
        />
      )}
    </>
  )
}

// ── Evento Compañero ──────────────────────────────────────────────────────────
function EventoCompanero({ personaje, onClose }) {
  const frases = personaje.frases || []
  const dia    = diaDelAno(hoyISO())
  const frase  = frases.length > 0 ? frases[dia % frases.length] : '...'
  const [showDesafio, setShowDesafio] = useState(false)
  const [showFlash,   setShowFlash]   = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setShowFlash(false), 1400)
    return () => clearTimeout(id)
  }, [])

  return (
    <>
      {/* Encounter flash */}
      {showFlash && (
        <div className="animate-encounter-flash" style={{
          position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
        }} />
      )}

      <div className="mx-4 mb-3 p-3 animate-card-entrance" style={{
        background: 'linear-gradient(180deg, #2a2035 0%, #1a1520 100%)',
        border: `2px solid ${personaje.glowColor}60`,
        borderLeft: `3px solid ${personaje.glowColor}`,
        borderRadius: '2px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.6)',
      }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-[9px]" style={{ color: personaje.glowColor }}>
            ✦ COMPAÑERO VIAJERO
          </span>
          <button onClick={onClose} className="font-pixel text-[10px] text-text-muted px-1">✕</button>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div style={{
            flexShrink: 0, padding: '6px',
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
          onClick={() => setShowDesafio(true)}
          className="w-full py-2.5 font-pixel text-[9px] active:translate-y-[1px]"
          style={{
            background: `${personaje.glowColor}18`,
            border: `2px solid ${personaje.glowColor}70`,
            borderRadius: '2px',
            color: personaje.glowColor,
            boxShadow: `2px 2px 0 rgba(0,0,0,0.4), 0 0 12px ${personaje.glowColor}25`,
          }}
        >
          ⚔ ACEPTAR DESAFÍO
        </button>
      </div>

      {showDesafio && (
        <RetoProposalModal
          personaje={personaje}
          onClose={() => { setShowDesafio(false); onClose() }}
        />
      )}
    </>
  )
}

// ── Export principal ──────────────────────────────────────────────────────────
// La clave guardada en DB: { key: 'eventoVistoDia', value: 'YYYY-MM-DD' }
// Al montar: si ya hay fecha de hoy → no mostrar nunca más hoy.
// Si no → marcar inmediatamente y mostrar (persiste incluso si refresca).
export default function EventoDelDia() {
  const [cerrado, setCerrado] = useState(true)  // true hasta confirmar con DB
  const [listo,   setListo]   = useState(false)
  const evento = getEventoHoy()

  useEffect(() => {
    if (!evento) { setListo(true); return }
    async function init() {
      try {
        const cfg = await db.configuracion.get('eventoVistoDia')
        if (cfg?.value === hoyISO()) {
          // Ya visto hoy → no mostrar
          setCerrado(true)
        } else {
          // Primer vez hoy → marcar en DB ahora mismo y mostrar
          await db.configuracion.put({ key: 'eventoVistoDia', value: hoyISO() })
          setCerrado(false)
        }
      } catch {
        setCerrado(false) // en caso de error de DB, mostrar igual
      } finally {
        setListo(true)
      }
    }
    init()
  }, []) // eslint-disable-line

  if (!listo || cerrado || !evento) return null

  const cerrar = () => setCerrado(true)

  if (evento.tipo === 'suerte')
    return <EventoSuerte onClose={cerrar} />
  if (evento.tipo === 'doblexp')
    return <EventoDobleXp onClose={cerrar} />
  if (evento.tipo === 'companero') {
    const personaje = PERSONAJES[evento.personajeIdx % PERSONAJES.length]
    return <EventoCompanero personaje={personaje} onClose={cerrar} />
  }
  return null
}
