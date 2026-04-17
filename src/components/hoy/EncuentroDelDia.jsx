// src/components/hoy/EncuentroDelDia.jsx
import { useState, useEffect } from 'react'
import { db } from '../../db'
import { hoyISO } from '../../utils/dates'
import { evaluarTriggers, guardarEncuentro, otorgarXpEncuentro } from '../../hooks/useEncuentros'
import { getEntidad, elegirDesafio, elegirIntro } from '../../entidades'
import EncuentroModal from './EncuentroModal'
import ChallengeResultPopup from '../shared/ChallengeResultPopup'

// Typewriter hook (inline para no crear dependencia)
function useTypewriter(text, speed = 38) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setIdx(0)
    if (!text) return
    const id = setInterval(() => {
      setIdx(prev => {
        if (prev >= text.length) { clearInterval(id); return prev }
        return prev + 1
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return text ? text.slice(0, idx) : ''
}

export default function EncuentroDelDia({ caminos, registrosHoy }) {
  const [fase, setFase]           = useState('evaluando') // evaluando | flash | tarjeta | modal | resultado | cerrado
  const [entidadId, setEntidadId] = useState(null)
  const [desafioData, setDesafioData] = useState(null) // { desafio, desafioIdx }
  const [resultado, setResultado]   = useState(null)   // { correcto, loreFragment }
  const introText = entidadId ? elegirIntro(getEntidad(entidadId), hoyISO()) : ''
  const introVisible = useTypewriter(fase === 'tarjeta' ? introText : '', 40)

  useEffect(() => {
    if (!caminos?.length) return
    let cancelled = false
    async function init() {
      const hoy = hoyISO()
      // ¿Ya hubo encuentro hoy?
      const yaHubo = await db.encuentros.where('fecha').equals(hoy).count()
      if (yaHubo > 0 || cancelled) { setFase('cerrado'); return }

      const id = await evaluarTriggers(caminos, registrosHoy || [])
      if (!id || cancelled) { setFase('cerrado'); return }

      const entidad = getEntidad(id)
      if (!entidad) { setFase('cerrado'); return }

      setEntidadId(id)
      setDesafioData(elegirDesafio(entidad, hoy))
      setFase('flash')

      setTimeout(() => {
        if (!cancelled) setFase('tarjeta')
      }, 1400)
    }
    init()
    return () => { cancelled = true }
  }, [caminos, registrosHoy]) // eslint-disable-line

  if (fase === 'evaluando' || fase === 'cerrado') return null

  const entidad = getEntidad(entidadId)
  if (!entidad) return null

  // ── Flash de encuentro ─────────────────────────────────────────────────────
  if (fase === 'flash') {
    return (
      <div className="animate-encounter-flash" style={{
        position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
      }} />
    )
  }

  // ── Modal de desafío ───────────────────────────────────────────────────────
  if (fase === 'modal') {
    return (
      <EncuentroModal
        entidad={entidad}
        desafio={desafioData.desafio}
        desafioIdx={desafioData.desafioIdx}
        onResult={async ({ respuesta, correcto, loreFragment }) => {
          setResultado({ correcto, loreFragment })
          await guardarEncuentro({
            entidadId,
            desafioIdx: desafioData.desafioIdx,
            respuesta,
            correcto,
            loreFragment,
          })
          if (correcto) {
            await otorgarXpEncuentro(desafioData.desafio.xpRecompensa)
          }
          setFase('resultado')
        }}
      />
    )
  }

  // ── Resultado ──────────────────────────────────────────────────────────────
  if (fase === 'resultado' && resultado) {
    return (
      <ChallengeResultPopup
        type={resultado.correcto ? 'win' : 'lose'}
        xp={resultado.correcto ? desafioData.desafio.xpRecompensa : 0}
        titulo={resultado.correcto ? '¡RESPUESTA CORRECTA!' : 'RESPUESTA INCORRECTA'}
        mensaje={resultado.loreFragment}
        onClose={() => setFase('cerrado')}
      />
    )
  }

  // ── Tarjeta de encuentro ───────────────────────────────────────────────────
  return (
    <div
      className="mx-4 mb-3 p-3 animate-card-entrance"
      style={{
        background: `linear-gradient(180deg, #1e1830 0%, #0c0a18 100%)`,
        border: `2px solid ${entidad.color}60`,
        borderLeft: `3px solid ${entidad.color}`,
        borderRadius: 2,
        boxShadow: `4px 4px 0 rgba(0,0,0,0.7), 0 0 20px ${entidad.color}15`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[8px]" style={{ color: entidad.color }}>
          ✦ ENCUENTRO SECRETO
        </span>
        <button
          onClick={() => setFase('cerrado')}
          className="font-pixel text-[10px] text-text-muted px-1"
        >✕</button>
      </div>

      {/* Personaje + intro */}
      <div className="flex items-start gap-3 mb-3">
        <div style={{
          flexShrink: 0, padding: 8, fontSize: 32,
          background: `${entidad.color}10`,
          border: `2px solid ${entidad.color}30`,
          borderRadius: 2,
          lineHeight: 1,
        }}>
          {entidad.icono}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[10px] mb-1" style={{ color: entidad.color }}>
            {entidad.nombre}
          </p>
          <p className="font-body text-[13px] leading-snug" style={{ color: '#e8e6e3', fontStyle: 'italic', minHeight: 20 }}>
            {introVisible || '...'}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => setFase('modal')}
        className="w-full py-2.5 font-pixel text-[9px] active:translate-y-[1px] transition-transform"
        style={{
          background: `${entidad.color}15`,
          border: `2px solid ${entidad.color}70`,
          borderRadius: 2,
          color: entidad.color,
          boxShadow: `2px 2px 0 rgba(0,0,0,0.5), 0 0 12px ${entidad.color}20`,
        }}
      >
        ⚔ ACEPTAR DESAFÍO
      </button>
    </div>
  )
}
