import { useState, useEffect } from 'react'
import { db } from '../../db'

// ── Sprites ──────────────────────────────────────────────────────────────────

function CaminanteA() {
  return (
    <svg viewBox="0 0 10 16" width={20} height={32}
         style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Cabeza */}
      <rect x="3" y="0" width="4" height="4" fill="#f0c080"/>
      {/* Pelo */}
      <rect x="3" y="0" width="4" height="1" fill="#5a3010"/>
      <rect x="2" y="1" width="1" height="2" fill="#5a3010"/>
      {/* Cuerpo */}
      <rect x="2" y="4" width="6" height="4" fill="#4488cc"/>
      {/* Brazo izq adelante */}
      <rect x="1" y="4" width="1" height="3" fill="#4488cc"/>
      <rect x="0" y="6" width="1" height="2" fill="#f0c080"/>
      {/* Brazo der atrás */}
      <rect x="8" y="5" width="1" height="3" fill="#336699"/>
      {/* Pierna izq atrás */}
      <rect x="3" y="8" width="2" height="3" fill="#336699"/>
      <rect x="3" y="11" width="2" height="2" fill="#5a3010"/>
      {/* Pierna der adelante */}
      <rect x="5" y="8" width="2" height="5" fill="#4a4090"/>
      <rect x="5" y="13" width="3" height="2" fill="#2a2060"/>
    </svg>
  )
}

function CaminanteB() {
  return (
    <svg viewBox="0 0 10 16" width={20} height={32}
         style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Cabeza */}
      <rect x="3" y="0" width="4" height="4" fill="#f0c080"/>
      <rect x="3" y="0" width="4" height="1" fill="#5a3010"/>
      <rect x="2" y="1" width="1" height="2" fill="#5a3010"/>
      {/* Cuerpo */}
      <rect x="2" y="4" width="6" height="4" fill="#4488cc"/>
      {/* Brazo izq atrás */}
      <rect x="1" y="5" width="1" height="3" fill="#336699"/>
      {/* Brazo der adelante */}
      <rect x="8" y="4" width="1" height="3" fill="#4488cc"/>
      <rect x="9" y="6" width="1" height="2" fill="#f0c080"/>
      {/* Pierna izq adelante */}
      <rect x="3" y="8" width="2" height="5" fill="#4a4090"/>
      <rect x="2" y="13" width="3" height="2" fill="#2a2060"/>
      {/* Pierna der atrás */}
      <rect x="5" y="8" width="2" height="3" fill="#336699"/>
      <rect x="5" y="11" width="2" height="2" fill="#5a3010"/>
    </svg>
  )
}

function CofreCerrado() {
  return (
    <svg viewBox="0 0 18 14" width={54} height={42}
         style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Cuerpo del cofre */}
      <rect x="0" y="5" width="18" height="9" fill="#8B4513"/>
      <rect x="1" y="6" width="16" height="7" fill="#A0522D"/>
      {/* Tapa */}
      <rect x="0" y="1" width="18" height="5" fill="#8B4513"/>
      <rect x="1" y="2" width="16" height="3" fill="#A0522D"/>
      {/* Arco de la tapa */}
      <rect x="2" y="0" width="14" height="2" fill="#8B4513"/>
      {/* Herrajes dorados */}
      <rect x="0" y="5" width="18" height="1" fill="#DAA520"/>
      <rect x="0" y="4" width="18" height="1" fill="#DAA520"/>
      {/* Cerradura */}
      <rect x="7" y="4" width="4" height="4" fill="#DAA520"/>
      <rect x="8" y="5" width="2" height="2" fill="#8B4513"/>
      {/* Esquinas */}
      <rect x="0" y="5"  width="3" height="9" fill="#6B3410"/>
      <rect x="15" y="5" width="3" height="9" fill="#6B3410"/>
      <rect x="0" y="1"  width="3" height="4" fill="#6B3410"/>
      <rect x="15" y="1" width="3" height="4" fill="#6B3410"/>
      {/* Bandas horizontales */}
      <rect x="0" y="9" width="18" height="1" fill="#DAA520"/>
    </svg>
  )
}

function CofreAbierto() {
  return (
    <svg viewBox="0 0 18 18" width={54} height={54}
         style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Cuerpo */}
      <rect x="0" y="9" width="18" height="9" fill="#8B4513"/>
      <rect x="1" y="10" width="16" height="7" fill="#A0522D"/>
      {/* Tapa abierta (levantada) */}
      <rect x="0" y="0" width="18" height="5" fill="#8B4513"/>
      <rect x="1" y="1" width="16" height="3" fill="#A0522D"/>
      {/* Herraje tapa */}
      <rect x="0" y="4" width="18" height="1" fill="#DAA520"/>
      {/* Interior iluminado */}
      <rect x="2" y="10" width="14" height="5" fill="#ffd700"/>
      <rect x="4" y="11" width="10" height="3" fill="#ffec80"/>
      {/* Brillo interior */}
      <rect x="7" y="10" width="4" height="1" fill="#fff"/>
      {/* Herraje cuerpo */}
      <rect x="0" y="9"  width="18" height="1" fill="#DAA520"/>
      <rect x="0" y="13" width="18" height="1" fill="#DAA520"/>
      {/* Esquinas */}
      <rect x="0"  y="9"  width="3" height="9" fill="#6B3410"/>
      <rect x="15" y="9"  width="3" height="9" fill="#6B3410"/>
      <rect x="0"  y="0"  width="3" height="5" fill="#6B3410"/>
      <rect x="15" y="0"  width="3" height="5" fill="#6B3410"/>
      {/* Destellos alrededor */}
      <rect x="8" y="6"  width="2" height="3" fill="#ffd700"/>
      <rect x="3" y="5"  width="1" height="2" fill="#ffd700"/>
      <rect x="14" y="5" width="1" height="2" fill="#ffd700"/>
    </svg>
  )
}

// Piedritas del camino
function Camino() {
  const piedras = [8, 18, 28, 38, 48, 58, 68, 78]
  return (
    <div style={{ position: 'relative', height: '12px', width: '100%' }}>
      {piedras.map((left, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${left}%`,
          top: '4px',
          width: '8px',
          height: '4px',
          background: i % 2 === 0 ? '#6b5e52' : '#4a3860',
          imageRendering: 'pixelated',
        }} />
      ))}
    </div>
  )
}

// Árboles decorativos
function ArbolPequeno({ style }) {
  return (
    <svg viewBox="0 0 8 10" width={16} height={20}
         style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="3" y="0" width="2" height="2" fill="#50c878"/>
      <rect x="2" y="1" width="4" height="3" fill="#50c878"/>
      <rect x="1" y="3" width="6" height="3" fill="#3a9858"/>
      <rect x="3" y="6" width="2" height="4" fill="#5a3010"/>
    </svg>
  )
}

// ── Estados de la animación ──────────────────────────────────────────────────
// idle → walking → arrived → opening → revealed

export default function RecompensaUnlockModal({ recompensa, onClose }) {
  const [fase, setFase]         = useState('walking')  // walking | arrived | opening | revealed
  const [frame, setFrame]       = useState(0)           // 0 | 1 para el caminante
  const [particulas, setParticulas] = useState([])

  // Animar pasos del personaje (2 frames)
  useEffect(() => {
    if (fase !== 'walking' && fase !== 'arrived') return
    const id = setInterval(() => setFrame(f => 1 - f), 180)
    return () => clearInterval(id)
  }, [fase])

  // Secuencia de fases
  useEffect(() => {
    // walking → arrived (2.8s = tiempo del CSS de caminata)
    const t1 = setTimeout(() => setFase('arrived'),  2800)
    // arrived → opening (0.5s después)
    const t2 = setTimeout(() => setFase('opening'),  3300)
    // opening → revealed (0.6s después)
    const t3 = setTimeout(() => {
      setFase('revealed')
      // Generar partículas
      setParticulas(Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 40,
        delay: Math.random() * 0.5,
      })))
    }, 3900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleReclamar = async () => {
    await db.recompensas.update(recompensa.id, { reclamada: true })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(10,8,15,0.95)' }}
    >
      <div className="w-full max-w-[420px] px-4">
        {/* Título */}
        <p className="font-pixel text-[8px] text-center text-xp-bar mb-6 animate-fade-in-up"
           style={{ textShadow: '0 0 12px #ffd70080' }}>
          ✦ RECOMPENSA DESBLOQUEADA ✦
        </p>

        {/* Escena del camino */}
        <div className="relative" style={{
          background: 'linear-gradient(180deg, #1a1530 0%, #2a1a10 60%, #1a1008 100%)',
          border: '2px solid #4a3860',
          borderRadius: '2px',
          padding: '20px 12px 12px',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.8)',
          overflow: 'hidden',
          minHeight: '120px',
        }}>
          {/* Árboles de fondo */}
          <ArbolPequeno style={{ position: 'absolute', top: 8, left: '4%', opacity: 0.7 }}/>
          <ArbolPequeno style={{ position: 'absolute', top: 4, left: '22%', opacity: 0.5 }}/>
          <ArbolPequeno style={{ position: 'absolute', top: 10, left: '55%', opacity: 0.6 }}/>

          {/* Personaje caminante */}
          <div style={{
            position: 'absolute',
            bottom: '28px',
            left: fase === 'walking' ? undefined : '62%',
            animation: fase === 'walking' ? 'caminataHero 2.8s steps(1) forwards' : 'none',
            transform: fase !== 'walking' ? 'scaleX(1)' : undefined,
            transition: 'none',
            zIndex: 2,
          }}>
            {frame === 0 ? <CaminanteA /> : <CaminanteB />}
          </div>

          {/* Cofre */}
          <div style={{ position: 'absolute', bottom: '24px', right: '8%', zIndex: 1 }}>
            {fase === 'opening' || fase === 'revealed' ? <CofreAbierto /> : <CofreCerrado />}
          </div>

          {/* Partículas al abrir */}
          {particulas.map(p => (
            <div key={p.id} style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: 4, height: 4,
              background: p.id % 3 === 0 ? '#ffd700' : p.id % 3 === 1 ? '#50c878' : '#e94560',
              animation: `floatUp 1.2s ease-out ${p.delay}s forwards`,
            }} />
          ))}

          {/* Camino */}
          <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, padding: '0 8px' }}>
            <Camino />
          </div>

          {/* Suelo */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px',
            background: 'linear-gradient(180deg, #2a1a10, #1a1008)',
          }} />
        </div>

        {/* Contenido de la recompensa (aparece en fase revealed) */}
        {fase === 'revealed' && (
          <div className="mt-4 text-center animate-fade-in-up">
            <div className="text-5xl mb-2">{recompensa.icono}</div>
            <p className="font-pixel text-[11px] text-xp-bar mb-1"
               style={{ textShadow: '0 0 8px #ffd70080' }}>
              {recompensa.nombre}
            </p>
            <p className="font-pixel text-[7px] text-text-muted mb-4">
              NV.{recompensa.nivelRequerido} ALCANZADO
            </p>
            <button
              onClick={handleReclamar}
              className="w-full py-3 font-pixel text-[10px] text-white active:translate-y-[1px] animate-glow-pulse"
              style={{
                background: 'linear-gradient(180deg, #e94560, #c03040)',
                border: '2px solid #ff6080',
                borderRadius: '2px',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.7)',
              }}
            >
              🎁 ¡RECLAMAR RECOMPENSA!
            </button>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2 font-pixel text-[8px] text-text-muted"
              style={{ border: '1px solid #4a3860', borderRadius: '2px' }}
            >
              GUARDAR PARA DESPUÉS
            </button>
          </div>
        )}

        {/* Mensaje mientras camina */}
        {fase !== 'revealed' && (
          <p className="mt-3 font-pixel text-[7px] text-text-muted text-center animate-racha-pulse">
            {fase === 'walking' ? '...' : fase === 'arrived' ? '¡Hay algo ahí!' : '¡ABRIENDO!'}
          </p>
        )}
      </div>
    </div>
  )
}
