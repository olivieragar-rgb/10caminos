import { useState } from 'react'
import NotasRuta from './NotasRuta'
import { avanzarPaso, pausarRuta, reanudarRuta, completarRuta, eliminarRuta } from '../../hooks/useRutas'

const ESTADO_COLOR = { activa: '#00e676', pausa: '#ffab00', completada: '#8a8690' }
const ESTADO_LABEL = { activa: 'Activa', pausa: 'Pausa', completada: 'Completada' }

export default function RutaCard({ ruta, camino }) {
  const [expanded, setExpanded] = useState(false)
  const [showPausaInput, setShowPausaInput] = useState(false)
  const [pausaMotivo, setPausaMotivo] = useState('')
  const [procesando, setProcesando] = useState(false)

  const pct = ruta.pasos.length ? Math.round((ruta.pasoActual / ruta.pasos.length) * 100) : 0

  const handle = async (fn) => {
    if (procesando) return
    setProcesando(true)
    try { await fn() } finally { setProcesando(false) }
  }

  return (
    <div className={`mx-4 mb-3 bg-bg-card border rounded-xl overflow-hidden
      ${ruta.estado === 'completada' ? 'border-border-dark opacity-60' : 'border-border-dark'}`}>

      {/* Header */}
      <button onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-text-primary truncate">{ruta.nombre}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0"
                style={{ color: ESTADO_COLOR[ruta.estado], borderColor: ESTADO_COLOR[ruta.estado] + '50' }}>
                {ESTADO_LABEL[ruta.estado]}
              </span>
            </div>
            {camino && (
              <p className="text-[10px] text-text-muted mb-1.5">
                {camino.icono} {camino.nombre}
              </p>
            )}
            {/* Progress bar */}
            <div className="h-1 bg-bg-surface rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: ESTADO_COLOR[ruta.estado] }} />
            </div>
            <p className="text-[10px] text-text-muted mt-1">
              Paso {Math.min(ruta.pasoActual + 1, ruta.pasos.length)}/{ruta.pasos.length} · {pct}%
            </p>
          </div>
          <span className="text-text-muted text-xs flex-shrink-0">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-border-dark/50">
          {/* Pasos */}
          <div className="mt-3 space-y-1">
            {ruta.pasos.map((paso, i) => (
              <div key={i} className={`flex items-start gap-2 text-xs
                ${i < ruta.pasoActual ? 'text-text-muted line-through' : ''}
                ${i === ruta.pasoActual ? 'text-text-primary font-medium' : ''}
                ${i > ruta.pasoActual ? 'text-text-muted/50' : ''}`}>
                <span className="flex-shrink-0 w-4 font-mono">
                  {i < ruta.pasoActual ? '✓' : i === ruta.pasoActual ? '→' : `${i+1}`}
                </span>
                <span>{paso.texto}</span>
              </div>
            ))}
          </div>

          {/* Pausa motivo */}
          {ruta.estado === 'pausa' && ruta.pausaMotivo && (
            <p className="mt-2 text-xs text-yellow-pause/80 italic">
              Motivo: {ruta.pausaMotivo}
            </p>
          )}

          {/* Acciones */}
          {ruta.estado === 'activa' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => handle(() => avanzarPaso(ruta.id))}
                disabled={ruta.pasoActual >= ruta.pasos.length || procesando}
                className="px-3 py-2 bg-green-xp/10 border border-green-xp/40 rounded-lg
                           text-xs text-green-xp disabled:opacity-30 min-h-[36px]">
                Siguiente paso →
              </button>
              <button onClick={() => setShowPausaInput(true)}
                className="px-3 py-2 bg-yellow-pause/10 border border-yellow-pause/40 rounded-lg
                           text-xs text-yellow-pause min-h-[36px]">
                Pausar
              </button>
              <button onClick={() => handle(() => completarRuta(ruta.id))}
                className="px-3 py-2 bg-bg-surface border border-border-dark rounded-lg
                           text-xs text-text-muted min-h-[36px]">
                Completar
              </button>
            </div>
          )}

          {ruta.estado === 'pausa' && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => handle(() => reanudarRuta(ruta.id))}
                className="px-3 py-2 bg-green-xp/10 border border-green-xp/40 rounded-lg
                           text-xs text-green-xp min-h-[36px]">
                Reanudar
              </button>
            </div>
          )}

          {showPausaInput && (
            <div className="mt-2 flex gap-2">
              <input value={pausaMotivo} onChange={e => setPausaMotivo(e.target.value)}
                placeholder="Motivo de la pausa..."
                className="flex-1 bg-bg-surface border border-border-dark rounded-lg px-3 py-1.5
                           text-xs text-text-primary placeholder-text-muted outline-none
                           focus:border-accent/50 min-h-[36px]" />
              <button onClick={() => {
                handle(() => pausarRuta(ruta.id, pausaMotivo))
                setShowPausaInput(false)
              }} className="px-3 py-1.5 bg-accent/20 border border-accent/40 rounded-lg
                           text-xs text-accent min-h-[36px]">OK</button>
            </div>
          )}

          {/* Notas */}
          <NotasRuta rutaId={ruta.id} notas={ruta.notas} />

          {/* Eliminar */}
          <button onClick={() => { if (confirm('¿Eliminar esta ruta?')) eliminarRuta(ruta.id) }}
            className="mt-3 text-[10px] text-red-alert/50 hover:text-red-alert transition-colors">
            Eliminar ruta
          </button>
        </div>
      )}
    </div>
  )
}
