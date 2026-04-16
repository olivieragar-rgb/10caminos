// src/components/hoy/RetoProposalModal.jsx
import { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { PersonajeSprite, PERSONAJES } from '../../constants'
import { generarDesafioIA } from '../../services/claude'
import { haceNDiasISO } from '../../utils/dates'
import ChallengeResultPopup from '../shared/ChallengeResultPopup'

// ── Fallback: quiz basado en frases del personaje ────────────────────────────
function generarDesafioFallback(personaje, caminos) {
  const frases = personaje?.frases || []
  if (frases.length === 0 || caminos.length === 0) return null

  const correctaFrase = frases[Math.floor(Math.random() * frases.length)]

  const otros = PERSONAJES
    .filter(p => p.id !== personaje.id && p.frases?.length > 0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(p => p.frases[Math.floor(Math.random() * p.frases.length)])

  const opciones = [correctaFrase, ...otros].sort(() => Math.random() - 0.5)
  const correcta = opciones.indexOf(correctaFrase)
  const camino   = caminos[Math.floor(Math.random() * caminos.length)]

  return {
    caminoId:    camino.id,
    pregunta:    `¿Cuál de estas frases pertenece a ${personaje.nombre}?`,
    opciones,
    correcta,
    xpPremio:    20,
    explicacion: `¡Conoces bien el espíritu de ${personaje.nombre}!`,
    consolacion: `Medita más las palabras de ${personaje.nombre}.`,
  }
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function RetoProposalModal({ personaje, onClose }) {
  // 'loading' | 'challenge' | 'answered' | 'result'
  const [fase, setFase]               = useState('loading')
  const [desafio, setDesafio]         = useState(null)
  const [caminoTarget, setCaminoTarget] = useState(null)
  const [selIdx, setSelIdx]           = useState(null)   // opción elegida
  const [ganado, setGanado]           = useState(false)

  const caminos = useLiveQuery(
    () => db.caminos.orderBy('orden').filter(c => c.activo).toArray(),
    [], []
  )

  // Cargar desafío al montar
  useEffect(() => {
    if (!caminos || caminos.length === 0) return

    async function cargar() {
      try {
        const apiKeyCfg = await db.configuracion.get('claudeApiKey')
        const apiKey    = apiKeyCfg?.value

        let d
        if (apiKey) {
          const fechas14 = Array.from({ length: 14 }, (_, i) => haceNDiasISO(i))
          const reg14    = await db.registros.where('fecha').anyOf(fechas14).toArray()
          d = await generarDesafioIA(personaje, caminos, reg14, apiKey)
        } else {
          d = generarDesafioFallback(personaje, caminos)
        }

        if (!d) { onClose(); return }

        const camino = caminos.find(c => c.id === d.caminoId) || caminos[0]
        setDesafio({ ...d, caminoId: camino.id })
        setCaminoTarget(camino)
        setFase('challenge')
      } catch (e) {
        console.warn('Challenge load error:', e)
        const d = generarDesafioFallback(personaje, caminos)
        if (d) {
          const camino = caminos.find(c => c.id === d.caminoId) || caminos[0]
          setDesafio({ ...d, caminoId: camino.id })
          setCaminoTarget(camino)
          setFase('challenge')
        } else {
          onClose()
        }
      }
    }

    cargar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caminos?.length])

  const handleSelect = useCallback(async (idx) => {
    if (selIdx !== null || fase !== 'challenge') return
    setSelIdx(idx)
    setFase('answered')

    const correcto = idx === desafio.correcta
    setGanado(correcto)

    if (correcto && desafio.caminoId) {
      const camino = await db.caminos.get(desafio.caminoId)
      if (camino) {
        const newXp  = Math.max(0, camino.xp + desafio.xpPremio)
        await db.caminos.update(desafio.caminoId, { xp: newXp, nivel: Math.floor(newXp / 100) })
      }
    }

    setTimeout(() => setFase('result'), 1300)
  }, [selIdx, fase, desafio])

  // ── FASE RESULT → full-screen popup ──────────────────────────────────────
  if (fase === 'result') {
    return (
      <ChallengeResultPopup
        type={ganado ? 'win' : 'lose'}
        xp={ganado ? desafio.xpPremio : 0}
        titulo={ganado ? '¡CORRECTO!' : 'INCORRECTO'}
        mensaje={ganado ? desafio.explicacion : desafio.consolacion}
        personaje={personaje}
        caminoNombre={ganado && caminoTarget
          ? `${caminoTarget.icono} ${caminoTarget.nombre}`
          : null}
        onClose={onClose}
      />
    )
  }

  // ── MODAL BASE ────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => e.target === e.currentTarget && fase !== 'answered' && onClose()}
    >
      <div
        className="w-full max-w-[480px] p-4 mb-14 animate-fade-in-up overflow-y-auto max-h-[92vh]"
        style={{
          background: 'linear-gradient(180deg, #2a2035 0%, #1a1520 100%)',
          border: `2px solid ${personaje?.glowColor || '#4a3860'}60`,
          borderTop: `3px solid ${personaje?.glowColor || '#4a3860'}`,
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {personaje && (
            <div style={{
              padding: '6px',
              background: `${personaje.glowColor}15`,
              border: `2px solid ${personaje.glowColor}40`,
              borderRadius: '2px', flexShrink: 0,
            }}>
              <PersonajeSprite personaje={personaje} size={36} />
            </div>
          )}
          <div>
            <p className="font-pixel text-[9px] mb-1" style={{ color: personaje?.glowColor || '#ffd700' }}>
              ⚔ DESAFÍO DE {(personaje?.nombre || 'COMPAÑERO').toUpperCase()}
            </p>
            <p className="font-body text-[12px]" style={{ color: '#c4a882' }}>
              {fase === 'loading' ? 'Preparando tu desafío...' : 'Responde para ganar XP'}
            </p>
          </div>
        </div>

        {/* Loading */}
        {fase === 'loading' && (
          <div className="py-10 text-center">
            <p className="font-pixel text-[8px] animate-pulse" style={{ color: personaje?.glowColor || '#ffd700' }}>
              El compañero analiza tus caminos...
            </p>
          </div>
        )}

        {/* Challenge */}
        {(fase === 'challenge' || fase === 'answered') && desafio && (
          <>
            {/* Camino target */}
            {caminoTarget && (
              <div className="mb-3 px-3 py-2" style={{
                background: `${personaje?.glowColor || '#ffd700'}10`,
                border: `1px solid ${personaje?.glowColor || '#ffd700'}30`,
                borderRadius: '2px',
              }}>
                <p className="font-pixel text-[7px]" style={{ color: '#6b5e52' }}>CAMINO EN JUEGO</p>
                <p className="font-body text-[13px] mt-0.5" style={{ color: '#e8e6e3' }}>
                  {caminoTarget.icono} {caminoTarget.nombre}
                </p>
              </div>
            )}

            {/* Pregunta */}
            <p className="font-body text-[15px] leading-snug mb-4 px-1" style={{ color: '#f0e8dc', fontWeight: 600 }}>
              {desafio.pregunta}
            </p>

            {/* Opciones */}
            <div className="flex flex-col gap-2 mb-4">
              {desafio.opciones.map((op, i) => {
                const isSelected = selIdx === i
                const isCorrect  = i === desafio.correcta
                const showResult = fase === 'answered'

                let borderColor = '#4a3860'
                let bg          = '#342848'
                let animClass   = ''

                if (showResult) {
                  if (isCorrect) {
                    borderColor = '#50c878'
                    bg = '#50c87820'
                  } else if (isSelected && !isCorrect) {
                    borderColor = '#e94560'
                    bg = '#e9456015'
                    animClass = 'animate-wrong-shake'
                  }
                } else if (isSelected) {
                  borderColor = personaje?.glowColor || '#ffd700'
                  bg = `${personaje?.glowColor || '#ffd700'}15`
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={fase === 'answered'}
                    className={`text-left px-3 py-3 font-body text-[13px] leading-snug active:translate-y-[1px] disabled:cursor-default ${animClass}`}
                    style={{
                      background: bg,
                      border: `2px solid ${borderColor}`,
                      borderRadius: '2px',
                      color: showResult && isCorrect ? '#50c878' : '#e8e6e3',
                      boxShadow: showResult && isCorrect
                        ? `0 0 16px #50c87840`
                        : '2px 2px 0 rgba(0,0,0,0.4)',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    <span className="font-pixel text-[7px] mr-2" style={{ color: '#6b5e52' }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {op}
                    {showResult && isCorrect && (
                      <span className="ml-2 font-pixel text-[8px]" style={{ color: '#50c878' }}>✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="ml-2 font-pixel text-[8px]" style={{ color: '#e94560' }}>✗</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* XP prize info */}
            <div className="flex items-center justify-between px-1">
              <p className="font-pixel text-[7px]" style={{ color: '#50c878' }}>
                Premio: +{desafio.xpPremio} XP
              </p>
              {fase === 'challenge' && (
                <button onClick={onClose}
                  className="font-pixel text-[7px] text-text-muted">
                  × cancelar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
