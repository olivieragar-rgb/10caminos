import { useState, useCallback } from 'react'
import ArbolSprite   from './sprites/ArbolSprite'
import HamacaSprite  from './sprites/HamacaSprite'
import PapaSprite    from './sprites/PapaSprite'
import MamaSprite    from './sprites/MamaSprite'
import NinoSprite    from './sprites/NinoSprite'
import NinaSprite    from './sprites/NinaSprite'

// ── Audio ──────────────────────────────────────────────────────────────────
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.18)
  } catch (_) { /* silencioso si no hay AudioContext */ }
}

// ── Sol pixel art ──────────────────────────────────────────────────────────
function Sol() {
  return (
    <div style={{ position: 'absolute', top: '6%', right: '8%', width: 48, height: 48 }}>
      <svg viewBox="0 0 12 12" width={48} height={48}
           style={{ imageRendering: 'pixelated', animation: 'sunRays 2s ease-in-out infinite' }}>
        {/* Rayos */}
        <rect x="5"  y="0"  width="2" height="2" fill="#FFF5B0"/>
        <rect x="5"  y="10" width="2" height="2" fill="#FFF5B0"/>
        <rect x="0"  y="5"  width="2" height="2" fill="#FFF5B0"/>
        <rect x="10" y="5"  width="2" height="2" fill="#FFF5B0"/>
        <rect x="1"  y="1"  width="2" height="2" fill="#FFF5B0"/>
        <rect x="9"  y="1"  width="2" height="2" fill="#FFF5B0"/>
        <rect x="1"  y="9"  width="2" height="2" fill="#FFF5B0"/>
        <rect x="9"  y="9"  width="2" height="2" fill="#FFF5B0"/>
        {/* Círculo central */}
        <rect x="3"  y="2"  width="6" height="8" fill="#FFE066"/>
        <rect x="2"  y="3"  width="8" height="6" fill="#FFE066"/>
      </svg>
    </div>
  )
}

// ── Cesta de hierba ────────────────────────────────────────────────────────
function Cesped() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '32%',
      background: 'linear-gradient(180deg, #5DAE4B 0%, #4A8C3F 40%, #3A7030 100%)',
    }}>
      {/* Línea de transición cielo/hierba */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#4A8C3F' }}/>
      {/* Puntitas de hierba pixel */}
      {[5,9,14,20,26,31,36,42,48,54,60,66,72,78,83,88,93].map((x,i) => (
        <div key={i} style={{
          position: 'absolute', top: -4, left: `${x}%`,
          width: 4, height: 6,
          background: '#5DAE4B',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}/>
      ))}
    </div>
  )
}

// ── Escena principal ───────────────────────────────────────────────────────
export default function IntroScene({ onComplete }) {
  // phase: 'idle' | 'surprise' | 'lookUp' | 'standUp' | 'fadeOut'
  const [phase, setPhase] = useState('idle')

  const handlePapaTap = useCallback(() => {
    if (phase !== 'idle') return
    playBeep()
    setPhase('surprise')
    setTimeout(() => setPhase('lookUp'),  300)
    setTimeout(() => setPhase('standUp'), 500)
    setTimeout(() => setPhase('fadeOut'), 900)
    setTimeout(() => onComplete(),       1400)
  }, [phase, onComplete])

  const isStanding = phase === 'standUp' || phase === 'fadeOut'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      overflow: 'hidden',
      opacity: phase === 'fadeOut' ? 0 : 1,
      transition: phase === 'fadeOut' ? 'opacity 0.5s ease-in' : 'none',
      /* Sky gradient */
      background: 'linear-gradient(180deg, #87CEEB 0%, #A8D8F0 55%, #B0E0B0 68%, #5DAE4B 68%)',
    }}>

      {/* ── Sol ── */}
      <Sol />

      {/* ── Nube izquierda ── */}
      <div style={{ position: 'absolute', top: '12%', left: '8%', opacity: 0.85 }}>
        <svg viewBox="0 0 20 8" width={80} height={32} style={{ imageRendering: 'pixelated' }}>
          <rect x="4" y="2" width="12" height="6" fill="#FFFFFF"/>
          <rect x="2" y="4" width="16" height="4" fill="#FFFFFF"/>
          <rect x="6" y="0" width="8"  height="4" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* ── Nube derecha ── */}
      <div style={{ position: 'absolute', top: '18%', right: '20%', opacity: 0.7 }}>
        <svg viewBox="0 0 14 6" width={56} height={24} style={{ imageRendering: 'pixelated' }}>
          <rect x="2" y="2" width="10" height="4" fill="#FFFFFF"/>
          <rect x="0" y="3" width="14" height="3" fill="#FFFFFF"/>
          <rect x="4" y="0" width="6"  height="3" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* ── Árbol izquierdo ── */}
      <div style={{ position: 'absolute', bottom: '28%', left: '2%' }}>
        <ArbolSprite width={60} height={90} />
      </div>

      {/* ── Árbol derecho ── */}
      <div style={{ position: 'absolute', bottom: '28%', right: '2%' }}>
        <ArbolSprite width={60} height={90} />
      </div>

      {/* ── Árbol fondo izquierdo (más pequeño) ── */}
      <div style={{ position: 'absolute', bottom: '34%', left: '18%', opacity: 0.7 }}>
        <ArbolSprite width={40} height={60} />
      </div>

      {/* ── Árbol fondo derecho ── */}
      <div style={{ position: 'absolute', bottom: '34%', right: '18%', opacity: 0.7 }}>
        <ArbolSprite width={40} height={60} />
      </div>

      {/* ── Grupo hamaca + personajes ── */}
      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transformOrigin: 'center bottom',
        animation: phase === 'idle' || phase === 'surprise' || phase === 'lookUp'
          ? 'hamacaSway 3s ease-in-out infinite'
          : 'none',
      }}>
        {/* Personajes en la hamaca (solo cuando no está de pie) */}
        {!isStanding && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: -4 }}>
            {/* Papa (izquierda, clickable) */}
            <PapaSprite
              frame={phase}
              onClick={handlePapaTap}
              style={{ flexShrink: 0 }}
            />
            {/* Mama (derecha) */}
            <MamaSprite width={48} height={56} />
          </div>
        )}

        {/* Hamaca */}
        <HamacaSprite width={168} height={36} />
      </div>

      {/* ── Papa de pie (aparece en standUp) ── */}
      {isStanding && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(30% + 36px)',
          left: 'calc(50% - 80px)',
          animation: 'standUp 0.4s ease-out forwards',
        }}>
          <PapaSprite frame="standing" />
        </div>
      )}

      {/* ── Niños jugando en el césped ── */}
      {/* Niño mayor (5 años) — lado izquierdo */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(30% + 10px)',
        left: '22%',
        animation: 'correrA 2.2s ease-in-out infinite',
        zIndex: 2,
      }}>
        <NinoSprite width={36} height={64} />
      </div>

      {/* Niño pequeño (3 años) — lado derecho */}
      <div style={{
        position: 'absolute',
        bottom: 'calc(30% + 6px)',
        left: '68%',
        animation: 'correrB 1.8s ease-in-out infinite',
        zIndex: 2,
      }}>
        <NinaSprite width={28} height={48} />
      </div>

      {/* ── Césped ── */}
      <Cesped />

      {/* ── Hint texto ── */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: '"Press Start 2P", cursive',
          fontSize: 8,
          color: '#f0e6d3',
          textShadow: '1px 1px 0 #1A1A1A',
          whiteSpace: 'nowrap',
          animation: 'blinkHint 1.2s ease-in-out infinite',
          letterSpacing: '0.05em',
        }}>
          [ TOCA A PAPÁ ]
        </div>
      )}
    </div>
  )
}
