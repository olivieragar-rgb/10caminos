// src/components/hoy/RetoProposalModal.jsx
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { PersonajeSprite } from '../../constants'
import { crearReto } from '../../hooks/useRetos'

function generarPropuestas(camino, personaje) {
  const nombre = camino?.nombre || 'este camino'
  return [
    {
      titulo: 'Prueba de 3 días',
      descripcion: `Logra "${nombre}" 3 días seguidos sin excusas.`,
      duracionDias: 3,
      xpPremio: 35,
      xpPenalty: 15,
      meta: 3,
      emoji: '⚡',
      color: '#50c878',
    },
    {
      titulo: 'Semana de fuego',
      descripcion: `Logra "${nombre}" al menos 5 de los próximos 7 días.`,
      duracionDias: 7,
      xpPremio: 85,
      xpPenalty: 25,
      meta: 5,
      emoji: '🔥',
      color: '#f0c040',
    },
    {
      titulo: 'Pacto de dos semanas',
      descripcion: `Logra "${nombre}" al menos 10 veces en los próximos 14 días.`,
      duracionDias: 14,
      xpPremio: 220,
      xpPenalty: 60,
      meta: 10,
      emoji: '🏆',
      color: '#ffd700',
    },
  ]
}

export default function RetoProposalModal({ personaje, onClose }) {
  const [elegido, setElegido] = useState(null)
  const [creando, setCreando] = useState(false)
  const [retoCreado, setRetoCreado] = useState(false)
  const [caminoElegidoId, setCaminoElegidoId] = useState(null)

  const caminos = useLiveQuery(() => db.caminos.orderBy('orden').filter(c => c.activo).toArray(), [], [])

  const caminoObj = caminos?.find(c => c.id === caminoElegidoId)
  const propuestas = caminoObj ? generarPropuestas(caminoObj, personaje) : []

  const handleCrear = async () => {
    if (!elegido || !caminoElegidoId || creando) return
    setCreando(true)
    try {
      await crearReto({
        caminoId: caminoElegidoId,
        titulo: elegido.titulo,
        descripcion: elegido.descripcion,
        duracionDias: elegido.duracionDias,
        xpPremio: elegido.xpPremio,
        xpPenalty: elegido.xpPenalty,
        meta: elegido.meta,
        personajeId: personaje?.id || 'unknown',
      })
      setRetoCreado(true)
    } finally {
      setCreando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[480px] p-4 mb-14 animate-fade-in-up overflow-y-auto max-h-[90vh]"
           style={{ background: 'linear-gradient(180deg, #2a2035 0%, #1a1520 100%)', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '4px 4px 0 rgba(0,0,0,0.8)' }}>

        {/* Header con personaje */}
        <div className="flex items-center gap-3 mb-4">
          {personaje && (
            <div style={{
              padding: '6px',
              background: `${personaje.glowColor}15`,
              border: `2px solid ${personaje.glowColor}40`,
              borderRadius: '2px',
              flexShrink: 0,
            }}>
              <PersonajeSprite personaje={personaje} size={36} />
            </div>
          )}
          <div>
            <p className="font-pixel text-[9px] mb-1" style={{ color: personaje?.glowColor || '#ffd700' }}>
              {personaje?.nombre || 'Compañero'}
            </p>
            <p className="font-body text-[12px]" style={{ color: '#c4a882' }}>
              {retoCreado ? '¡Reto aceptado! Que no te ganen.' : 'Te propongo un reto. ¿Lo aceptas?'}
            </p>
          </div>
        </div>

        {retoCreado ? (
          <div className="text-center py-4">
            <p className="font-pixel text-[10px] text-[#50c878] mb-2">✦ RETO ACTIVADO ✦</p>
            <p className="font-body text-[13px]" style={{ color: '#e8e6e3' }}>{elegido?.descripcion}</p>
            <p className="font-pixel text-[8px] mt-2" style={{ color: '#ffd700' }}>
              Premio: +{elegido?.xpPremio} XP · Penalti: -{elegido?.xpPenalty} XP
            </p>
            <button onClick={onClose}
              className="mt-4 w-full py-2.5 font-pixel text-[10px] text-white active:translate-y-[1px]"
              style={{ background: 'linear-gradient(180deg, #50c878, #3a9860)', border: '2px solid #70e898', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
              ¡ADELANTE!
            </button>
          </div>
        ) : (
          <>
            {/* Selector de camino */}
            {!caminoElegidoId ? (
              <div>
                <p className="font-pixel text-[8px] text-text-muted mb-2">¿Para qué camino?</p>
                <div className="flex flex-col gap-1 mb-4">
                  {(caminos || []).map(c => (
                    <button key={c.id} onClick={() => setCaminoElegidoId(c.id)}
                      className="text-left px-3 py-2 font-body text-[13px] active:translate-x-[1px]"
                      style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', color: '#e8e6e3', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}>
                      {c.icono} {c.nombre}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Breadcrumb camino */}
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => { setCaminoElegidoId(null); setElegido(null) }}
                    className="font-pixel text-[8px] text-text-muted">← cambiar</button>
                  <span className="font-body text-[12px]" style={{ color: '#c4a882' }}>
                    {caminoObj?.icono} {caminoObj?.nombre}
                  </span>
                </div>

                {/* 3 propuestas */}
                <div className="flex flex-col gap-2 mb-4">
                  {propuestas.map((p, i) => {
                    const sel = elegido?.titulo === p.titulo
                    return (
                      <button key={i} onClick={() => setElegido(p)}
                        className="text-left p-3 active:translate-y-[1px] transition-all"
                        style={{
                          background: sel ? `${p.color}15` : '#342848',
                          border: `2px solid ${sel ? p.color : '#4a3860'}`,
                          borderRadius: '2px',
                          boxShadow: sel ? `3px 3px 0 ${p.color}40` : '2px 2px 0 rgba(0,0,0,0.4)',
                        }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-pixel text-[9px]" style={{ color: p.color }}>
                            {p.emoji} {p.titulo}
                          </span>
                          <span className="font-pixel text-[7px]" style={{ color: '#6b5e52' }}>
                            {p.duracionDias}d
                          </span>
                        </div>
                        <p className="font-body text-[12px] leading-snug mb-1" style={{ color: '#a89b8c' }}>
                          {p.descripcion}
                        </p>
                        <div className="flex gap-3">
                          <span className="font-pixel text-[7px]" style={{ color: '#50c878' }}>
                            +{p.xpPremio} XP si ganas
                          </span>
                          <span className="font-pixel text-[7px]" style={{ color: '#e94560' }}>
                            -{p.xpPenalty} XP si fallas
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <button onClick={onClose}
                    className="flex-1 py-2.5 font-pixel text-[9px] text-text-muted"
                    style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                    AHORA NO
                  </button>
                  <button
                    onClick={handleCrear}
                    disabled={!elegido || creando}
                    className="flex-1 py-2.5 font-pixel text-[9px] text-white disabled:opacity-40 active:translate-y-[1px]"
                    style={{ background: elegido ? 'linear-gradient(180deg, #e94560, #c03040)' : '#342848', border: `2px solid ${elegido ? '#ff6080' : '#4a3860'}`, borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                    {creando ? '...' : '¡ACEPTO!'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
