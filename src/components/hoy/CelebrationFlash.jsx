// src/components/hoy/CelebrationFlash.jsx
import { useEffect, useState } from 'react'
import { PersonajeSprite, getPersonajeActivo } from '../../constants'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { nivelGlobal } from '../../utils/xp'

const STARS = ['✦', '★', '✦', '⭐', '✦']

export default function CelebrationFlash({ xpGanado, subioNivel, nuevoNivel, onDone }) {
  const [fase, setFase] = useState('show') // 'show' | 'done'
  const todosCaminos = useLiveQuery(() => db.caminos.toArray(), [], [])
  const nvGlobal = nivelGlobal(todosCaminos || [])
  const personaje = getPersonajeActivo(nvGlobal)
  const duracion = subioNivel ? 3000 : 1500

  useEffect(() => {
    const t = setTimeout(() => { setFase('done'); onDone?.() }, duracion)
    return () => clearTimeout(t)
  }, [duracion, onDone])

  if (fase === 'done') return null

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: 'rgba(4,4,12,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '3px', overflow: 'hidden',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* Estrellas flotantes */}
      {STARS.map((s, i) => (
        <span key={i} className="animate-star-float"
          style={{
            position: 'absolute',
            left: `${15 + i * 18}%`,
            top: '60%',
            fontSize: '14px',
            color: '#ffd700',
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.9 + i * 0.1}s`,
          }}>{s}</span>
      ))}

      {/* Sprite celebrando */}
      <div className="animate-celeb-jump" style={{ marginBottom: '8px' }}>
        <PersonajeSprite personaje={personaje} size={48} />
      </div>

      {/* +XP */}
      <div className="animate-xp-rise"
        style={{
          fontFamily: '"Cinzel", serif', fontWeight: 900,
          fontSize: '18px', color: '#ffd700',
          textShadow: '0 0 12px #ffd700',
        }}>
        +{xpGanado} XP
      </div>

      {/* Subida de nivel */}
      {subioNivel && (
        <div className="animate-unlock-appear"
          style={{
            fontFamily: '"Cinzel", serif', fontWeight: 700,
            fontSize: '11px', color: '#00d4ff',
            letterSpacing: '3px', marginTop: '6px',
            textShadow: '0 0 10px #00d4ff',
          }}>
          ⬆ NIVEL {nuevoNivel}
        </div>
      )}
    </div>
  )
}
