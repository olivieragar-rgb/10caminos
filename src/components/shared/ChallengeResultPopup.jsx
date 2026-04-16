// src/components/shared/ChallengeResultPopup.jsx
import { useEffect } from 'react'
import { PersonajeSprite } from '../../constants'

const PARTICLES_WIN = [
  { left: '8%',  top: '55%', delay: '0s',    dur: '1.1s', emoji: '⭐' },
  { left: '20%', top: '60%', delay: '0.15s', dur: '1.3s', emoji: '✨' },
  { left: '35%', top: '65%', delay: '0.05s', dur: '1.0s', emoji: '⭐' },
  { left: '50%', top: '58%', delay: '0.25s', dur: '1.4s', emoji: '✨' },
  { left: '65%', top: '62%', delay: '0.1s',  dur: '1.2s', emoji: '⭐' },
  { left: '78%', top: '56%', delay: '0.3s',  dur: '1.1s', emoji: '✨' },
  { left: '88%', top: '64%', delay: '0.08s', dur: '1.3s', emoji: '⭐' },
  { left: '14%', top: '70%', delay: '0.2s',  dur: '0.9s', emoji: '✨' },
]

const PARTICLES_BONUS = [
  { left: '12%', top: '60%', delay: '0s',    dur: '1.2s', emoji: '⚡' },
  { left: '30%', top: '55%', delay: '0.2s',  dur: '1.0s', emoji: '💫' },
  { left: '55%', top: '65%', delay: '0.1s',  dur: '1.3s', emoji: '⚡' },
  { left: '72%', top: '58%', delay: '0.15s', dur: '1.1s', emoji: '💫' },
  { left: '88%', top: '62%', delay: '0.25s', dur: '1.4s', emoji: '⚡' },
  { left: '45%', top: '70%', delay: '0.05s', dur: '0.9s', emoji: '💫' },
]

/**
 * type: 'win' | 'lose' | 'bonus'
 * xp: number (shown on win/bonus)
 * titulo: string
 * mensaje: string (personaje quote)
 * personaje: object (optional)
 * caminoNombre: string (optional)
 * onClose: fn
 */
export default function ChallengeResultPopup({
  type = 'win',
  xp = 0,
  titulo,
  mensaje,
  personaje,
  caminoNombre,
  onClose,
}) {
  useEffect(() => {
    const id = setTimeout(onClose, 4500)
    return () => clearTimeout(id)
  }, [onClose])

  const isWin   = type === 'win'
  const isBonus = type === 'bonus'
  const isLose  = type === 'lose'

  const bg = isWin   ? 'radial-gradient(ellipse at center, #0a2010 0%, #060f0a 60%, #030806 100%)'
           : isBonus ? 'radial-gradient(ellipse at center, #0a1530 0%, #060a1f 60%, #030610 100%)'
           :           'radial-gradient(ellipse at center, #200a10 0%, #0f0608 60%, #080306 100%)'

  const accentColor = isWin   ? '#ffd700'
                    : isBonus ? '#4488ff'
                    :           '#e94560'

  const particles = isWin ? PARTICLES_WIN : isBonus ? PARTICLES_BONUS : []

  const mainEmoji = isWin   ? '🏆'
                  : isBonus ? '⚡'
                  :           '💀'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="animate-particle-up"
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            fontSize: 20,
            animationDuration: p.dur,
            animationDelay: p.delay,
            pointerEvents: 'none',
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Glow ring */}
      <div style={{
        position: 'absolute',
        width: 280, height: 280,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Main emoji */}
      <div
        className="animate-unlock-appear"
        style={{ fontSize: 72, lineHeight: 1, zIndex: 1 }}
      >
        {mainEmoji}
      </div>

      {/* Title */}
      <p
        className="animate-neon-pulse"
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: 13,
          color: accentColor,
          textAlign: 'center',
          textShadow: `0 0 24px ${accentColor}90`,
          letterSpacing: '0.04em',
          padding: '0 28px',
          lineHeight: 1.6,
          zIndex: 1,
        }}
      >
        {titulo}
      </p>

      {/* XP badge */}
      {xp > 0 && (
        <div
          className="animate-xp-big"
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: 28,
            color: '#ffd700',
            textShadow: '0 0 32px #ffd700aa',
            zIndex: 1,
          }}
        >
          +{xp} XP
        </div>
      )}

      {/* Camino tag */}
      {caminoNombre && (
        <p
          className="animate-pop-in"
          style={{
            fontFamily: '"Press Start 2P", cursive',
            fontSize: 8,
            color: accentColor + 'b0',
            textAlign: 'center',
            padding: '0 32px',
            zIndex: 1,
          }}
        >
          {caminoNombre}
        </p>
      )}

      {/* Personaje sprite + message */}
      {(personaje || mensaje) && (
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            maxWidth: 320, padding: '0 24px',
            zIndex: 1,
          }}
        >
          {personaje && (
            <div style={{
              flexShrink: 0,
              padding: '6px',
              background: `${accentColor}18`,
              border: `2px solid ${accentColor}40`,
              borderRadius: '2px',
            }}>
              <PersonajeSprite personaje={personaje} size={36} />
            </div>
          )}
          {mensaje && (
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13,
              color: '#d4cfc9',
              fontStyle: 'italic',
              lineHeight: 1.5,
              alignSelf: 'center',
            }}>
              "{mensaje}"
            </p>
          )}
        </div>
      )}

      {/* Tap hint */}
      <p
        className="animate-neon-pulse"
        style={{
          fontFamily: '"Press Start 2P", cursive',
          fontSize: 7,
          color: '#3a3040',
          marginTop: 8,
          zIndex: 1,
        }}
      >
        [ TOCA PARA CONTINUAR ]
      </p>
    </div>
  )
}
