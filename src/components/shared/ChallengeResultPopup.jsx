// src/components/shared/ChallengeResultPopup.jsx — Pokémon victory/defeat screen
import { useState, useEffect } from 'react'
import { PersonajeSprite } from '../../constants'

const BORDER = '#c8c0a8'
const BOX_BG = '#0c0a18'
const TEXT_C = '#e8e0c8'

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 42, delay = 0) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setIdx(0)
    if (!text) return
    const startId = setTimeout(() => {
      const id = setInterval(() => {
        setIdx(prev => {
          if (prev >= text.length) { clearInterval(id); return prev }
          return prev + 1
        })
      }, speed)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(startId)
  }, [text, speed, delay])
  return text ? text.slice(0, idx) : ''
}

// ── Partículas (deterministas) ────────────────────────────────────────────────
const WIN_PARTICLES = [
  { left: '6%',  top: '62%', delay: '0s',    dur: '1.2s', e: '⭐' },
  { left: '18%', top: '55%', delay: '0.2s',  dur: '1.4s', e: '✨' },
  { left: '33%', top: '68%', delay: '0.08s', dur: '1.1s', e: '⭐' },
  { left: '50%', top: '58%', delay: '0.3s',  dur: '1.5s', e: '✨' },
  { left: '66%', top: '65%', delay: '0.12s', dur: '1.3s', e: '⭐' },
  { left: '80%', top: '52%', delay: '0.25s', dur: '1.0s', e: '✨' },
  { left: '90%', top: '70%', delay: '0.05s', dur: '1.4s', e: '⭐' },
  { left: '12%', top: '75%', delay: '0.18s', dur: '1.2s', e: '✨' },
]
const BONUS_PARTICLES = [
  { left: '10%', top: '60%', delay: '0s',    dur: '1.1s', e: '⚡' },
  { left: '28%', top: '54%', delay: '0.2s',  dur: '1.3s', e: '💫' },
  { left: '50%', top: '66%', delay: '0.1s',  dur: '1.2s', e: '⚡' },
  { left: '70%', top: '58%', delay: '0.15s', dur: '1.4s', e: '💫' },
  { left: '88%', top: '64%', delay: '0.25s', dur: '1.0s', e: '⚡' },
  { left: '42%', top: '72%', delay: '0.05s', dur: '1.3s', e: '💫' },
]

/**
 * type: 'win' | 'lose' | 'bonus'
 * xp: number
 * titulo, mensaje, personaje, caminoNombre, onClose
 */
export default function ChallengeResultPopup({
  type = 'win', xp = 0,
  titulo, mensaje, personaje, caminoNombre, onClose,
}) {
  const isWin   = type === 'win'
  const isBonus = type === 'bonus'
  const isLose  = type === 'lose'

  // XP counter rolling up
  const [displayXp, setDisplayXp] = useState(0)
  useEffect(() => {
    if (!isWin || !xp) return
    let cur = 0
    const step = Math.max(1, Math.ceil(xp / 24))
    const id = setInterval(() => {
      cur = Math.min(cur + step, xp)
      setDisplayXp(cur)
      if (cur >= xp) clearInterval(id)
    }, 55)
    return () => clearInterval(id)
  }, [isWin, xp])

  // Auto-close
  useEffect(() => {
    const id = setTimeout(onClose, 5200)
    return () => clearTimeout(id)
  }, [onClose])

  // Typewriters
  const line1 = useTypewriter(titulo || '', 55, 300)
  const line2 = useTypewriter(caminoNombre || '', 40, 900)
  const line3 = useTypewriter(mensaje || '', 35, 1400)

  const accentColor = isWin   ? '#ffd700'
                    : isBonus ? '#4488ff'
                    :           '#e94560'

  const particles = isWin ? WIN_PARTICLES : isBonus ? BONUS_PARTICLES : []

  const bgColor = isWin   ? 'radial-gradient(ellipse at 50% 40%, #0d2010 0%, #060c08 55%, #030608 100%)'
                : isBonus ? 'radial-gradient(ellipse at 50% 40%, #0a1530 0%, #060a1f 55%, #030610 100%)'
                :           'radial-gradient(ellipse at 50% 40%, #1a0808 0%, #0a0404 55%, #040202 100%)'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: bgColor,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 12,
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: '"Press Start 2P", cursive',
        maxWidth: 480, margin: '0 auto',
        animation: 'popIn 0.25s ease-out',
      }}
    >
      {/* Glow ring behind sprite */}
      <div style={{
        position: 'absolute',
        width: 260, height: 260, borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}14 0%, transparent 68%)`,
        pointerEvents: 'none',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div key={i} className="animate-particle-up" style={{
          position: 'absolute', left: p.left, top: p.top,
          fontSize: 18,
          animationDuration: p.dur,
          animationDelay: p.delay,
          pointerEvents: 'none',
        }}>{p.e}</div>
      ))}

      {/* Personaje sprite */}
      {personaje && (
        <div style={{
          animation: isLose
            ? 'defeatFade 0.5s ease-out both'
            : 'unlockAppear 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
          filter: isLose ? 'grayscale(60%) brightness(0.6)' : 'none',
          zIndex: 1,
        }}>
          <PersonajeSprite personaje={personaje} size={100} />
        </div>
      )}

      {/* TITLE LINE */}
      <p style={{
        fontSize: 14, color: accentColor,
        textShadow: `0 0 20px ${accentColor}90`,
        textAlign: 'center', padding: '0 24px', lineHeight: 1.7,
        zIndex: 1,
        animation: `${isWin ? 'victoryPulse' : 'neonPulse'} 1.6s ease-in-out infinite`,
        letterSpacing: '0.03em',
      }}>
        {line1}
      </p>

      {/* XP counter (win/bonus) */}
      {isWin && xp > 0 && displayXp > 0 && (
        <div style={{
          fontSize: 24, color: '#ffd700',
          textShadow: '0 0 28px #ffd700b0',
          animation: 'xpBig 0.6s 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
          zIndex: 1,
        }}>
          +{displayXp} XP
        </div>
      )}

      {/* Camino tag */}
      {caminoNombre && line2 && (
        <p style={{
          fontSize: 8, color: `${accentColor}a0`,
          zIndex: 1,
        }}>
          {line2}
        </p>
      )}

      {/* Message text box (Pokémon dialog style) */}
      {mensaje && (
        <div style={{
          width: '90%', maxWidth: 380, zIndex: 1,
          border: `3px solid ${BORDER}`, background: BORDER, padding: 2, borderRadius: '2px',
          marginTop: 4,
          animation: 'battleEnter 0.4s 0.8s ease-out both',
        }}>
          <div style={{
            background: BOX_BG, padding: '10px 14px',
            position: 'relative', minHeight: 64,
          }}>
            <p style={{ fontSize: 7, color: TEXT_C, lineHeight: 2 }}>
              {line3}
            </p>
            {line3.length >= (mensaje?.length || 0) && (
              <span style={{
                position: 'absolute', bottom: 6, right: 10,
                fontSize: 10, color: TEXT_C,
                animation: 'blinkHint 0.8s ease-in-out infinite',
              }}>▼</span>
            )}
          </div>
        </div>
      )}

      {/* Tap hint */}
      <p style={{
        fontSize: 7, color: '#2e2838', marginTop: 8, zIndex: 1,
        animation: 'blinkHint 1.2s ease-in-out infinite',
      }}>
        [ TOCA PARA CONTINUAR ]
      </p>
    </div>
  )
}
