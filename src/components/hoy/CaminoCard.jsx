import { useState } from 'react'
import XpBar from './XpBar'
import XpAnimation from './XpAnimation'
import LevelBadge from '../shared/LevelBadge'
import { marcarCamino, agregarNotaRegistro } from '../../hooks/useRegistros'
import { MENSAJES_WABI_SABI } from '../../constants'

const MARCAS = [
  { id: 'avance', label: '✓', full: 'Avance', color: '#00e676', bg: 'bg-green-xp/10 border-green-xp/40',  textColor: 'text-green-xp' },
  { id: 'pausa',  label: '→', full: 'Pausa',  color: '#ffab00', bg: 'bg-yellow-pause/10 border-yellow-pause/40', textColor: 'text-yellow-pause' },
  { id: 'nada',   label: '○', full: 'Nada',   color: '#616161', bg: 'bg-gray-nada/10 border-gray-nada/40',  textColor: 'text-gray-nada' },
]

function mensajeWabiSabi() {
  return MENSAJES_WABI_SABI[Math.floor(Math.random() * MENSAJES_WABI_SABI.length)]
}

export default function CaminoCard({ camino, registroHoy, rutaActiva }) {
  const [xpAnim, setXpAnim] = useState(null)
  const [nivelUp, setNivelUp] = useState(false)
  const [showNota, setShowNota] = useState(false)
  const [notaInput, setNotaInput] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [wabiMsg, setWabiMsg] = useState(null)

  const handleMarcar = async (marca) => {
    if (procesando) return
    setProcesando(true)
    try {
      const result = await marcarCamino(camino.id, marca)
      if (result?.xpGanado > 0) {
        setXpAnim({ amount: result.xpGanado, key: Date.now() })
      }
      if (result?.subioNivel) {
        setNivelUp(true)
        setTimeout(() => setNivelUp(false), 2000)
      }
      if (marca === 'avance') {
        setShowNota(true)
        setNotaInput(registroHoy?.nota || '')
        setWabiMsg(null)
      } else if (marca === 'nada') {
        setWabiMsg(mensajeWabiSabi())
        setTimeout(() => setWabiMsg(null), 3500)
        setShowNota(false)
      } else {
        setShowNota(false)
      }
    } finally {
      setProcesando(false)
    }
  }

  const handleGuardarNota = async () => {
    if (notaInput.trim()) await agregarNotaRegistro(camino.id, notaInput.trim())
    setShowNota(false)
    setNotaInput('')
  }

  const marcaHoy = registroHoy?.marca

  // Color del borde izquierdo según marca del día
  const borderAccent = marcaHoy === 'avance' ? '#00e676'
    : marcaHoy === 'pausa' ? '#ffab00'
    : marcaHoy === 'nada' ? '#616161'
    : null

  return (
    <div
      className={`relative mx-4 mb-3 p-3 bg-bg-card border rounded-xl transition-all duration-300
        ${nivelUp ? 'border-xp-bar animate-nivel-flash' : 'border-border-dark'}`}
      style={borderAccent ? { borderLeftColor: borderAccent, borderLeftWidth: '3px' } : {}}
    >

      {/* XP Animation */}
      {xpAnim && <XpAnimation amount={xpAnim.amount} animKey={xpAnim.key} />}

      {/* Header: icono + nombre + racha/nivel */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl leading-none flex-shrink-0">{camino.icono}</span>
          <span className="text-sm font-semibold text-text-primary truncate">{camino.nombre}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {camino.rachaActual > 0 && (
            <span className="font-mono text-xs text-racha-fire animate-racha-pulse">
              🔥{camino.rachaActual}
            </span>
          )}
          <LevelBadge nivel={camino.nivel} />
        </div>
      </div>

      {/* Ikigai */}
      {camino.ikigai ? (
        <p className="text-[11px] italic text-text-muted leading-snug mb-2 pl-7"
           style={{ color: '#a89f91', opacity: 0.8 }}>
          {camino.ikigai}
        </p>
      ) : null}

      {/* XP Bar */}
      <XpBar xp={camino.xp} className="mb-2" />

      {/* Ruta activa */}
      {rutaActiva && (
        <div className="mb-2 text-xs text-text-secondary truncate">
          📍 <span className="text-text-primary">{rutaActiva.nombre}</span>
          {' — '}Paso {Math.min(rutaActiva.pasoActual + 1, rutaActiva.pasos.length)}/{rutaActiva.pasos.length}
        </div>
      )}

      {/* Botones de marca */}
      <div className="flex gap-1.5">
        {MARCAS.map(m => {
          const activo = marcaHoy === m.id
          return (
            <button
              key={m.id}
              onClick={() => handleMarcar(m.id)}
              disabled={procesando}
              className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-150
                select-none active:scale-95 min-h-[44px] flex flex-col items-center justify-center gap-0.5
                ${activo ? `${m.bg}` : 'bg-bg-surface border-border-dark text-text-muted'}
                ${procesando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={activo ? { color: m.color } : {}}
            >
              <span className="text-base leading-none">{m.label}</span>
              <span className="text-[10px] opacity-70">{m.full}</span>
            </button>
          )
        })}
      </div>

      {/* Mensaje Wabi-Sabi */}
      {wabiMsg && (
        <p className="mt-2 text-xs italic animate-wabi-sabi text-center leading-snug"
           style={{ color: '#a89f91' }}>
          {wabiMsg}
        </p>
      )}

      {/* Nota mostrada */}
      {!showNota && registroHoy?.nota && (
        <p className="mt-2 text-xs text-text-secondary italic truncate">"{registroHoy.nota}"</p>
      )}

      {/* Input de nota inline */}
      {showNota && (
        <div className="mt-2 flex gap-2">
          <input
            autoFocus
            value={notaInput}
            onChange={e => setNotaInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGuardarNota()}
            placeholder="Nota opcional..."
            className="flex-1 bg-bg-surface border border-border-dark rounded-lg px-3 py-1.5
                       text-sm text-text-primary placeholder-text-muted outline-none
                       focus:border-green-xp/50 min-h-[36px]"
          />
          <button
            onClick={handleGuardarNota}
            className="px-3 py-1.5 bg-green-xp/20 border border-green-xp/40 rounded-lg
                       text-xs text-green-xp font-medium min-h-[36px]"
          >
            OK
          </button>
          <button
            onClick={() => setShowNota(false)}
            className="px-2 py-1.5 text-text-muted text-xs min-h-[36px]"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
