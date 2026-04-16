// src/components/hoy/RetoProposalModal.jsx — Pokémon Red battle screen
import { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { PersonajeSprite, PERSONAJES } from '../../constants'
import { generarDesafioIA } from '../../services/claude'
import { haceNDiasISO } from '../../utils/dates'
import ChallengeResultPopup from '../shared/ChallengeResultPopup'

const BORDER  = '#c8c0a8'
const BOX_BG  = '#0c0a18'
const TEXT_C  = '#e8e0c8'
const CURSOR_C = '#f0c040'

// ── Typewriter hook ───────────────────────────────────────────────────────────
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

// ── Player sprite (back view) ─────────────────────────────────────────────────
function TrainerSprite({ width = 44, height = 64 }) {
  return (
    <svg viewBox="0 0 11 16" width={width} height={height}
         style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="2" y="0" width="7" height="2" fill="#2a1808" />
      <rect x="2" y="1" width="7" height="4" fill="#8B6544" />
      <rect x="1" y="2" width="1" height="3" fill="#8B6544" />
      <rect x="9" y="2" width="1" height="3" fill="#8B6544" />
      <rect x="4" y="5" width="3" height="1" fill="#7a5a34" />
      <rect x="2" y="6" width="7" height="5" fill="#3060a8" />
      <rect x="1" y="7" width="1" height="3" fill="#2050a0" />
      <rect x="9" y="7" width="1" height="3" fill="#2050a0" />
      <rect x="2" y="11" width="3" height="4" fill="#1a1a3a" />
      <rect x="6" y="11" width="3" height="4" fill="#1a1a3a" />
      <rect x="1" y="14" width="4" height="2" fill="#1a1a1a" />
      <rect x="6" y="14" width="4" height="2" fill="#1a1a1a" />
    </svg>
  )
}

// ── HP Bar ────────────────────────────────────────────────────────────────────
function HpBar({ pct }) {
  const color = pct > 50 ? '#50c878' : pct > 20 ? '#f0c040' : '#e94560'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: TEXT_C }}>HP</span>
      <div style={{ flex: 1, height: 4, background: '#0a0814', border: `1px solid ${BORDER}50`, overflow: 'hidden', borderRadius: '1px' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color,
          transition: 'width 0.9s ease-out, background-color 0.4s',
          borderRadius: '1px',
        }} />
      </div>
    </div>
  )
}

// ── Info box estilo Pokémon (nombre + nivel + HP) ─────────────────────────────
function InfoBox({ nombre, nivel, hp }) {
  return (
    <div style={{
      padding: '4px 8px 6px',
      background: BOX_BG,
      border: `2px solid ${BORDER}`,
      borderRadius: '2px',
      minWidth: 136,
      boxShadow: '3px 3px 0 #000',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: TEXT_C, letterSpacing: '0.03em' }}>
          {nombre.toUpperCase().slice(0, 11)}
        </span>
        {nivel != null && (
          <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#a0a070' }}>
            NV.{nivel}
          </span>
        )}
      </div>
      <HpBar pct={hp} />
    </div>
  )
}

// ── Caja de diálogo estilo Pokémon ────────────────────────────────────────────
function DialogBox({ children, showCursor = false, style = {} }) {
  return (
    <div style={{ border: `3px solid ${BORDER}`, background: BORDER, padding: 2, borderRadius: '2px', ...style }}>
      <div style={{ background: BOX_BG, padding: '10px 14px', position: 'relative', minHeight: 60 }}>
        {children}
        {showCursor && (
          <span style={{
            position: 'absolute', bottom: 7, right: 10,
            fontFamily: '"Press Start 2P"', fontSize: 10, color: TEXT_C,
            animation: 'blinkHint 0.8s ease-in-out infinite',
          }}>▼</span>
        )}
      </div>
    </div>
  )
}

// ── Fallback sin API ──────────────────────────────────────────────────────────
function generarDesafioFallback(personaje, caminos) {
  const frases = personaje?.frases || []
  if (!frases.length || !caminos.length) return null
  const correctaFrase = frases[Math.floor(Math.random() * frases.length)]
  const otros = PERSONAJES
    .filter(p => p.id !== personaje.id && p.frases?.length > 0)
    .sort(() => Math.random() - 0.5).slice(0, 3)
    .map(p => p.frases[Math.floor(Math.random() * p.frases.length)])
  const opciones = [correctaFrase, ...otros].sort(() => Math.random() - 0.5)
  const correcta = opciones.indexOf(correctaFrase)
  const camino   = caminos[Math.floor(Math.random() * caminos.length)]
  return {
    caminoId: camino.id, opciones, correcta, xpPremio: 20,
    pregunta:    `¿Cuál frase pertenece a ${personaje.nombre}?`,
    explicacion: `¡El espíritu de ${personaje.nombre} vive en ti!`,
    consolacion: `Medita más las palabras de ${personaje.nombre}.`,
  }
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function RetoProposalModal({ personaje, onClose }) {
  // encounter → loading → challenge → answered → result
  const [fase, setFase]               = useState('encounter')
  const [desafio, setDesafio]         = useState(null)
  const [caminoTarget, setCaminoTarget] = useState(null)
  const [selIdx, setSelIdx]           = useState(null)
  const [ganado, setGanado]           = useState(false)
  const [enemyHp, setEnemyHp]         = useState(100)
  const [playerHp, setPlayerHp]       = useState(100)
  const [shakeField, setShakeField]   = useState(false)
  const [hitEnemy, setHitEnemy]       = useState(false)
  const [hitPlayer, setHitPlayer]     = useState(false)
  const [spritesVisible, setSpritesVisible] = useState(false)

  const caminos = useLiveQuery(
    () => db.caminos.orderBy('orden').filter(c => c.activo).toArray(),
    [], []
  )

  // Typewriter text para cada fase
  const encounterMsg = `¡${personaje.nombre.toUpperCase()} QUIERE COMBATIR!`
  const loadingMsg   = `El compañero prepara su desafío...`
  const activeMsg    = fase === 'encounter' ? encounterMsg
                     : fase === 'loading'   ? loadingMsg
                     : ''
  const typeText = useTypewriter(activeMsg, 38)
  const typeDone = typeText.length >= activeMsg.length && activeMsg.length > 0

  // Sprites aparecen después del flash inicial
  useEffect(() => {
    const id = setTimeout(() => setSpritesVisible(true), 800)
    return () => clearTimeout(id)
  }, [])

  // Avanzar de encounter → loading tras 2s
  useEffect(() => {
    const id = setTimeout(() => {
      setFase(prev => prev === 'encounter' ? (desafio ? 'challenge' : 'loading') : prev)
    }, 2200)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line

  // Cargar desafío en background
  useEffect(() => {
    if (!caminos?.length) return
    let cancelled = false
    async function load() {
      try {
        const cfg    = await db.configuracion.get('claudeApiKey')
        const apiKey = cfg?.value
        let d
        if (apiKey) {
          const fechas14 = Array.from({ length: 14 }, (_, i) => haceNDiasISO(i))
          const reg14    = await db.registros.where('fecha').anyOf(fechas14).toArray()
          d = await generarDesafioIA(personaje, caminos, reg14, apiKey)
        } else {
          d = generarDesafioFallback(personaje, caminos)
        }
        if (cancelled || !d) return
        const camino = caminos.find(c => c.id === d.caminoId) || caminos[0]
        setDesafio({ ...d, caminoId: camino.id })
        setCaminoTarget(camino)
      } catch {
        if (cancelled) return
        const d = generarDesafioFallback(personaje, caminos)
        if (!d) { onClose(); return }
        const camino = caminos.find(c => c.id === d.caminoId) || caminos[0]
        setDesafio({ ...d, caminoId: camino.id })
        setCaminoTarget(camino)
      }
    }
    load()
    return () => { cancelled = true }
  }, [caminos?.length]) // eslint-disable-line

  // Cuando desafío listo y estamos en loading → challenge
  useEffect(() => {
    if (desafio && fase === 'loading') setFase('challenge')
  }, [desafio, fase])

  const handleSelect = useCallback(async (idx) => {
    if (selIdx !== null || fase !== 'challenge') return
    setSelIdx(idx)
    setFase('answered')

    const correcto = idx === desafio.correcta
    setGanado(correcto)

    // Shake + hit flash
    setShakeField(true)
    setTimeout(() => setShakeField(false), 550)

    if (correcto) {
      setHitEnemy(true)
      setTimeout(() => setHitEnemy(false), 400)
      setEnemyHp(0)
      const camino = await db.caminos.get(desafio.caminoId)
      if (camino) {
        const newXp = Math.max(0, camino.xp + desafio.xpPremio)
        await db.caminos.update(desafio.caminoId, { xp: newXp, nivel: Math.floor(newXp / 100) })
      }
    } else {
      setHitPlayer(true)
      setTimeout(() => setHitPlayer(false), 400)
      setPlayerHp(0)
    }

    setTimeout(() => setFase('result'), 1700)
  }, [selIdx, fase, desafio])

  // ── RESULT popup ──────────────────────────────────────────────────────────
  if (fase === 'result') {
    return (
      <ChallengeResultPopup
        type={ganado ? 'win' : 'lose'}
        xp={ganado ? desafio?.xpPremio : 0}
        titulo={ganado ? '¡CORRECTO!' : 'INCORRECTO...'}
        mensaje={ganado ? desafio?.explicacion : desafio?.consolacion}
        personaje={personaje}
        caminoNombre={ganado && caminoTarget ? `${caminoTarget.icono} ${caminoTarget.nombre}` : null}
        onClose={onClose}
      />
    )
  }

  const showOptions = (fase === 'challenge' || fase === 'answered') && desafio

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', flexDirection: 'column',
      background: '#06040c',
      maxWidth: 480, margin: '0 auto',
      fontFamily: '"Press Start 2P", cursive',
    }}>

      {/* ── ENCOUNTER FLASH ── */}
      {fase === 'encounter' && (
        <div className="animate-encounter-flash" style={{
          position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
        }} />
      )}

      {/* ── CAMPO DE BATALLA ── */}
      <div
        className={shakeField ? 'animate-battle-shake' : ''}
        style={{
          height: 210,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0c1828 0%, #0c1828 52%, #0a1c08 52%, #081408 100%)',
          borderBottom: `3px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        {/* Pixel grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }} />

        {/* Ground line deco */}
        <div style={{
          position: 'absolute', top: '52%', left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${BORDER}40, transparent)`,
        }} />

        {/* ENEMY platform shadow */}
        <div style={{
          position: 'absolute', top: '44%', right: '10%',
          width: 80, height: 8,
          background: 'radial-gradient(ellipse 90% 80%, #303020 0%, transparent 75%)',
        }} />

        {/* ENEMY sprite (right) */}
        {spritesVisible && (
          <div
            className={`animate-slide-right ${hitEnemy ? 'animate-hit-flash' : 'animate-battle-float'}`}
            style={{ position: 'absolute', top: '4%', right: '8%' }}
          >
            <PersonajeSprite personaje={personaje} size={88} />
          </div>
        )}

        {/* ENEMY info box (top-left) */}
        {spritesVisible && (
          <div className="animate-battle-enter" style={{ position: 'absolute', top: 10, left: 10 }}>
            <InfoBox nombre={personaje.nombre} nivel={personaje.nivelDesbloqueo} hp={enemyHp} />
          </div>
        )}

        {/* PLAYER platform shadow */}
        <div style={{
          position: 'absolute', bottom: '16%', left: '10%',
          width: 72, height: 6,
          background: 'radial-gradient(ellipse 90% 80%, #303020 0%, transparent 75%)',
        }} />

        {/* PLAYER sprite (back view, left) */}
        {spritesVisible && (
          <div
            className={`animate-slide-left ${hitPlayer ? 'animate-hit-flash' : ''}`}
            style={{ position: 'absolute', bottom: '19%', left: '12%' }}
          >
            <TrainerSprite width={44} height={64} />
          </div>
        )}

        {/* PLAYER info box (bottom-right) */}
        {spritesVisible && (
          <div className="animate-battle-enter" style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <InfoBox nombre="OLIVIER" nivel={null} hp={playerHp} />
          </div>
        )}
      </div>

      {/* ── BATTLE UI (bottom) ── */}
      <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>

        {/* Encounter / loading text box */}
        {!showOptions && (
          <DialogBox showCursor={typeDone} style={{ flex: 1 }}>
            <p style={{ fontSize: 9, color: TEXT_C, lineHeight: 1.9 }}>
              {typeText || '...'}
            </p>
          </DialogBox>
        )}

        {/* Challenge: pregunta + opciones */}
        {showOptions && (
          <>
            {/* Pregunta */}
            <DialogBox>
              <p style={{ fontSize: 7, color: TEXT_C, lineHeight: 1.9 }}>
                {desafio.pregunta}
              </p>
            </DialogBox>

            {/* Opciones 2×2 */}
            <div style={{ border: `3px solid ${BORDER}`, background: BORDER, padding: 2, borderRadius: '2px' }}>
              <div style={{
                background: BOX_BG,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
              }}>
                {desafio.opciones.map((op, i) => {
                  const isSel  = selIdx === i
                  const isOk   = i === desafio.correcta
                  const done   = fase === 'answered'

                  const bg     = done && isOk   ? '#50c87828'
                               : done && isSel  ? '#e9456018'
                               : isSel          ? '#ffffff12'
                               : 'transparent'
                  const border = done && isOk   ? `1px solid #50c87870`
                               : done && isSel  ? `1px solid #e9456070`
                               : `1px solid ${BORDER}20`
                  const color  = done && isOk   ? '#50c878'
                               : done && isSel  ? '#e94560'
                               : TEXT_C
                  const cursor = !done && isSel ? '▶'
                               : done && isOk   ? '✓'
                               : done && isSel  ? '✗'
                               : ' '

                  return (
                    <button key={i} onClick={() => handleSelect(i)}
                      disabled={done}
                      style={{
                        background: bg, border,
                        padding: '9px 8px',
                        textAlign: 'left', cursor: done ? 'default' : 'pointer',
                        fontFamily: '"Press Start 2P"', fontSize: 7,
                        color, lineHeight: 1.7,
                        display: 'flex', alignItems: 'flex-start', gap: 5,
                        transition: 'background 0.15s, border-color 0.15s',
                        borderRadius: '1px',
                      }}
                    >
                      <span style={{ color: CURSOR_C, flexShrink: 0, minWidth: 8 }}>{cursor}</span>
                      {op}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* XP prize + HUIR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
              <span style={{ fontSize: 7, color: '#50c878' }}>
                Premio: +{desafio.xpPremio} XP
              </span>
              {fase === 'challenge' && (
                <button onClick={onClose} style={{
                  fontSize: 7, color: '#6b5e52',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: '"Press Start 2P"',
                }}>
                  ↩ HUIR
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
