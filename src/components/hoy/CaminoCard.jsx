import { useState, useRef, useEffect } from 'react'
import XpBar from './XpBar'
import XpAnimation from './XpAnimation'
import CelebrationFlash from './CelebrationFlash'
import LevelBadge from '../shared/LevelBadge'
import { marcarCamino, agregarNotaRegistro } from '../../hooks/useRegistros'
import { MENSAJES_WABI_SABI } from '../../constants'
import { db } from '../../db'
import { useLiveQuery } from 'dexie-react-hooks'
import { haceNDiasISO, hoyISO } from '../../utils/dates'
import { useRetoCamino, evaluarRetosExpirados, abandonarReto } from '../../hooks/useRetos'
import RecompensaUnlockModal from '../shared/RecompensaUnlockModal'

const MARCAS = [
  { id: 'avance', label: '✓', full: 'LOGRADO!', color: '#50c878', bg: 'rgba(80,200,120,0.12)', border: '#50c878' },
  { id: 'pausa',  label: '→', full: 'PEND.HOY', color: '#f0c040', bg: 'rgba(240,192,64,0.12)',  border: '#f0c040' },
  { id: 'nada',   label: '○', full: 'HOY NO',   color: '#706060', bg: 'rgba(112,96,96,0.12)',   border: '#706060' },
]

function mensajeWabiSabi() {
  return MENSAJES_WABI_SABI[Math.floor(Math.random() * MENSAJES_WABI_SABI.length)]
}

// ── Escudo pixelado con número ──────────────────────────────────────────────
function PixelShield({ numero }) {
  return (
    <div style={{ position: 'relative', width: 22, height: 28, flexShrink: 0 }}>
      <svg viewBox="0 0 11 14" width={22} height={28}
           style={{ imageRendering: 'pixelated', position: 'absolute', top: 0, left: 0 }}>
        {/* Relleno escudo */}
        <rect x="0" y="0"  width="11" height="10" fill="#2a2035"/>
        <rect x="1" y="10" width="9"  height="2"  fill="#2a2035"/>
        <rect x="2" y="12" width="7"  height="1"  fill="#2a2035"/>
        <rect x="4" y="13" width="3"  height="1"  fill="#2a2035"/>
        {/* Borde exterior */}
        <rect x="0" y="0"  width="11" height="1"  fill="#6a5880"/>
        <rect x="0" y="0"  width="1"  height="10" fill="#6a5880"/>
        <rect x="10" y="0" width="1"  height="10" fill="#6a5880"/>
        <rect x="0" y="10" width="1"  height="2"  fill="#6a5880"/>
        <rect x="10" y="10" width="1" height="2"  fill="#6a5880"/>
        <rect x="1" y="12" width="1"  height="1"  fill="#6a5880"/>
        <rect x="9" y="12" width="1"  height="1"  fill="#6a5880"/>
        <rect x="2" y="13" width="2"  height="1"  fill="#6a5880"/>
        <rect x="7" y="13" width="2"  height="1"  fill="#6a5880"/>
        <rect x="5" y="14" width="1"  height="0"  fill="#6a5880"/>
        {/* Brillo interior */}
        <rect x="1" y="1"  width="9"  height="1"  fill="#4a3860"/>
        <rect x="1" y="1"  width="1"  height="8"  fill="#4a3860"/>
      </svg>
      <span style={{
        position: 'absolute', top: '32%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: '"Press Start 2P", cursive',
        fontSize: 7, color: '#ffd700',
        textShadow: '1px 1px 0 #1a1a1a',
        lineHeight: 1, pointerEvents: 'none',
      }}>{numero}</span>
    </div>
  )
}

// ── Menú contextual long-press ──────────────────────────────────────────────
function MenuContextual({ camino, rutaActiva, onEditar, onClose }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 animate-fade-in-up"
      style={{
        background: 'linear-gradient(180deg, #342848 0%, #2a2035 100%)',
        border: '2px solid #6a5880',
        borderRadius: '2px',
        boxShadow: '6px 6px 0 rgba(0,0,0,0.7)',
        padding: '8px',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[10px] text-xp-bar truncate">{camino.icono} {camino.nombre}</span>
        <button onClick={onClose} className="font-pixel text-[10px] text-text-muted px-1">✕</button>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={onEditar}
          className="text-left px-2 py-2 font-pixel text-[10px] active:translate-x-[1px]"
          style={{ border: '2px solid #6a5880', borderRadius: '2px', color: '#c4a882', background: '#2a2035' }}
        >✏ EDITAR CAMINO</button>

        {rutaActiva && (
          <button
            onClick={onClose}
            className="text-left px-2 py-2 font-pixel text-[10px] active:translate-x-[1px]"
            style={{ border: '2px solid #4488cc', borderRadius: '2px', color: '#4488cc', background: '#2a2035' }}
          >🗺 {rutaActiva.nombre.slice(0, 18)}</button>
        )}
      </div>
    </div>
  )
}

// ── Historial rápido (7 días) ───────────────────────────────────────────────
const MARCA_SIM = { avance: '✓', pausa: '→', nada: '○' }
const MARCA_COL = { avance: '#50c878', pausa: '#f0c040', nada: '#706060' }

function HistorialRapido({ caminoId, onClose }) {
  const fechas = Array.from({ length: 7 }, (_, i) => haceNDiasISO(i))
  const registros = useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).filter(r => r.caminoId === caminoId).toArray(),
    [caminoId], []
  )
  const sorted = [...(registros || [])].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="mt-2 pt-2" style={{ borderTop: '1px solid #4a3860' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-pixel text-[9px] text-text-muted">ÚLTIMOS 7 DÍAS</span>
        <button onClick={onClose} className="text-text-muted text-xs px-1">✕</button>
      </div>
      {sorted.length === 0
        ? <p className="font-body text-[10px] text-text-muted italic">Sin registros recientes.</p>
        : sorted.map(r => (
          <div key={r.id} className="flex items-center gap-2 mb-1">
            <span className="font-pixel text-[9px] text-text-muted w-20 flex-shrink-0">{r.fecha}</span>
            <span className="font-pixel text-[12px]" style={{ color: MARCA_COL[r.marca] }}>
              {MARCA_SIM[r.marca]}
            </span>
            {r.nota && <span className="font-body text-[10px] text-text-secondary italic truncate">"{r.nota}"</span>}
          </div>
        ))
      }
    </div>
  )
}

// ── Indicador de reto activo ────────────────────────────────────────────────
function RetoIndicator({ reto, onAbandonar }) {
  const [confirmando, setConfirmando] = useState(false)
  const hoy = hoyISO()

  // Calcular días restantes
  const fechaFin = new Date(reto.fechaFin + 'T23:59:59')
  const hoyDate = new Date(hoy + 'T00:00:00')
  const diasRestantes = Math.max(0, Math.ceil((fechaFin - hoyDate) / (1000 * 60 * 60 * 24)))

  return (
    <div className="mb-2" style={{
      background: 'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(42,32,53,0.8) 100%)',
      border: '2px solid #b8960c',
      borderRadius: '2px',
      padding: '8px 10px',
    }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span style={{
            fontFamily: '"Press Start 2P", cursive', fontSize: '6px',
            color: '#ffd700', background: 'rgba(255,215,0,0.12)',
            border: '1px solid #b8960c60', padding: '2px 4px', borderRadius: '1px',
          }}>RETO</span>
          <span className="font-body text-[11px]" style={{ color: '#c4a882', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {reto.titulo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px]" style={{ color: diasRestantes <= 1 ? '#e94560' : '#ffd700' }}>
            {diasRestantes}d
          </span>
          {confirmando ? (
            <button onClick={() => { abandonarReto(reto.id); setConfirmando(false) }}
              className="font-pixel text-[7px] px-1 py-0.5" style={{ color: '#e94560', border: '1px solid #e94560', borderRadius: '1px' }}>
              ✓
            </button>
          ) : (
            <button onClick={() => setConfirmando(true)}
              className="font-pixel text-[7px] px-1 py-0.5 text-text-muted"
              style={{ border: '1px solid #4a3860', borderRadius: '1px' }}>
              ✕
            </button>
          )}
        </div>
      </div>
      <p className="font-body text-[10px] leading-snug" style={{ color: '#8a8080' }}>
        {reto.descripcion}
      </p>
      <div className="flex items-center justify-between mt-1">
        <span className="font-pixel text-[7px]" style={{ color: '#50c878' }}>+{reto.xpPremio} XP</span>
        <span className="font-pixel text-[7px]" style={{ color: '#6b5e52' }}>si logras la meta</span>
        <span className="font-pixel text-[7px]" style={{ color: '#e94560' }}>-{reto.xpPenalty} XP si no</span>
      </div>
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────
export default function CaminoCard({ camino, registroHoy, rutaActiva, onAbrirManager }) {
  const [xpAnim, setXpAnim]       = useState(null)
  const [nivelUp, setNivelUp]     = useState(false)
  const [showNota, setShowNota]   = useState(false)
  const [notaInput, setNotaInput] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [wabiMsg, setWabiMsg]     = useState(null)
  const [showMenu, setShowMenu]   = useState(false)
  const [showHistorial, setShowHistorial] = useState(false)
  const [recompensaUnlock, setRecompensaUnlock] = useState(null) // recompensa a mostrar
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebData, setCelebData] = useState({ xpGanado: 0, subioNivel: false, nuevoNivel: 0 })

  const longPressTimer = useRef(null)
  const retoActivo = useRetoCamino(camino.id)

  useEffect(() => {
    evaluarRetosExpirados().catch(console.error)
  }, [])

  // ── Long press handlers ──
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setShowMenu(true), 500)
  }
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const handleMarcar = async (marca) => {
    if (procesando) return
    setProcesando(true)
    try {
      const result = await marcarCamino(camino.id, marca)
      if (result?.xpGanado > 0) setXpAnim({ amount: result.xpGanado, key: Date.now() })
      if (result?.subioNivel) { setNivelUp(true); setTimeout(() => setNivelUp(false), 2000) }
      if (result?.recompensasDesbloqueadas?.length > 0) {
        // Mostrar de a una; si hay varias, la primera (las siguientes aparecerán en la próxima acción)
        setRecompensaUnlock(result.recompensasDesbloqueadas[0])
      }
      if (marca === 'avance' && result?.xpGanado > 0) {
        setCelebData({
          xpGanado: result.xpGanado || 0,
          subioNivel: !!result.subioNivel,
          nuevoNivel: camino.nivel + (result.subioNivel ? 1 : 0),
        })
        setShowCelebration(true)
      }
      if (marca === 'avance') {
        setShowNota(true); setNotaInput(registroHoy?.nota || ''); setWabiMsg(null)
      } else if (marca === 'nada') {
        setWabiMsg(mensajeWabiSabi()); setTimeout(() => setWabiMsg(null), 3500); setShowNota(false)
      } else {
        setShowNota(false)
      }
    } finally { setProcesando(false) }
  }

  const handleGuardarNota = async () => {
    if (notaInput.trim()) await agregarNotaRegistro(camino.id, notaInput.trim())
    setShowNota(false); setNotaInput('')
  }

  const marcaHoy = registroHoy?.marca
  const borderAccentColor = marcaHoy === 'avance' ? '#50c878'
    : marcaHoy === 'pausa' ? '#f0c040'
    : marcaHoy === 'nada' ? '#706060'
    : '#4a3860'

  return (
    <div
      className={`relative mx-4 mb-3 p-3 transition-all duration-300 ${nivelUp ? 'animate-nivel-flash' : 'animate-card-entrance'}`}
      style={{
        background: 'linear-gradient(180deg, #2a2035 0%, rgba(26,21,32,0.85) 100%)',
        border: '2px solid #4a3860',
        borderLeftColor: borderAccentColor,
        borderLeftWidth: '3px',
        borderRadius: '2px',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.6)',
      }}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
    >
      {/* XP Animation */}
      {xpAnim && <XpAnimation amount={xpAnim.amount} animKey={xpAnim.key} />}

      {/* Celebration flash */}
      {showCelebration && (
        <CelebrationFlash
          xpGanado={celebData.xpGanado}
          subioNivel={celebData.subioNivel}
          nuevoNivel={celebData.nuevoNivel}
          onDone={() => setShowCelebration(false)}
        />
      )}

      {/* Menú contextual (long-press) */}
      {showMenu && (
        <MenuContextual
          camino={camino}
          rutaActiva={rutaActiva}
          onEditar={() => { setShowMenu(false); onAbrirManager?.() }}
          onClose={() => setShowMenu(false)}
        />
      )}

      {/* Header: escudo + icono + nombre + racha/nivel */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <PixelShield numero={camino.id} />
          <span className="text-lg leading-none flex-shrink-0">{camino.icono}</span>
          <span className="font-pixel text-[12px] text-text-primary leading-tight truncate">{camino.nombre}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {camino.rachaActual > 0 && (
            <span className="font-pixel text-[10px] text-racha-fire animate-racha-pulse leading-none">
              🔥{camino.rachaActual}
            </span>
          )}
          <LevelBadge nivel={camino.nivel} />
        </div>
      </div>

      {/* Ikigai */}
      {camino.ikigai ? (
        <p className="text-[10px] font-body italic leading-snug mb-2 pl-14"
           style={{ color: '#c4a882', opacity: 0.8 }}>
          {camino.ikigai}
        </p>
      ) : null}

      {/* XP Bar */}
      <XpBar xp={camino.xp} className="mb-2" />

      {/* Ruta activa — bloque MISIÓN */}
      {rutaActiva && (() => {
        const pasoIdx  = rutaActiva.pasoActual ?? 0
        const paso     = rutaActiva.pasos?.[pasoIdx]
        const total    = rutaActiva.pasos?.length ?? 0
        const pct      = total > 0 ? Math.round((pasoIdx / total) * 100) : 0
        return (
          <div className="mb-2" style={{
            background: 'linear-gradient(135deg, rgba(68,136,204,0.08) 0%, rgba(42,32,53,0.6) 100%)',
            border: '2px solid #4488cc50',
            borderLeft: '3px solid #4488cc',
            borderRadius: '2px',
            padding: '8px 10px',
          }}>
            {/* Etiqueta + nombre ruta */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span style={{
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '6px',
                  color: '#4488cc',
                  background: 'rgba(68,136,204,0.15)',
                  border: '1px solid #4488cc60',
                  padding: '2px 4px',
                  borderRadius: '1px',
                }}>MISIÓN</span>
                <span className="font-body text-[10px] text-text-muted truncate" style={{ maxWidth: '120px' }}>
                  {rutaActiva.nombre}
                </span>
              </div>
              <span style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '7px',
                color: '#4488cc99',
              }}>{pasoIdx + 1}/{total}</span>
            </div>

            {/* Acción del día — texto grande */}
            {paso && (
              <p className="font-body leading-snug" style={{
                fontSize: '13px',
                color: '#e8e6e3',
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                ▸ {paso.texto}
              </p>
            )}

            {/* Barra de progreso de la ruta */}
            <div style={{ height: '4px', background: '#1a1520', borderRadius: '0' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #4488cc, #66aaee)',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 6px #4488cc80',
              }} />
            </div>
          </div>
        )
      })()}

      {/* Reto activo */}
      {retoActivo && (
        <RetoIndicator reto={retoActivo} onAbandonar={() => abandonarReto(retoActivo.id)} />
      )}

      {/* Botones de marca */}
      {!rutaActiva ? (
        <div className="flex flex-col items-center justify-center py-3 gap-1"
             style={{ border: '2px dashed #4a3860', borderRadius: '2px', background: 'rgba(42,32,53,0.3)' }}>
          <p className="font-pixel text-[8px]" style={{ color: '#6b5e52' }}>Sin misión asignada</p>
          <p className="font-body text-[11px]" style={{ color: '#4a3860' }}>Ve a Rutas para añadir una misión</p>
        </div>
      ) : (
        <div className="flex gap-1.5">
          {MARCAS.map(m => {
            const activo = marcaHoy === m.id
            return (
              <button
                key={m.id}
                onClick={() => handleMarcar(m.id)}
                disabled={procesando}
                className="flex-1 py-2.5 font-pixel select-none min-h-[44px]
                           flex flex-col items-center justify-center gap-0.5
                           active:translate-y-[1px] active:translate-x-[1px]"
                style={{
                  background: activo ? m.bg : 'rgba(52,40,72,0.5)',
                  border: `2px solid ${activo ? m.border : '#4a3860'}`,
                  borderRadius: '2px',
                  boxShadow: activo ? '2px 2px 0 rgba(0,0,0,0.6)' : '2px 2px 0 rgba(0,0,0,0.4)',
                  color: activo ? m.color : '#6b5e52',
                  opacity: procesando ? 0.5 : 1,
                  cursor: procesando ? 'not-allowed' : 'pointer',
                }}
              >
                <span className="text-sm leading-none">{m.label}</span>
                <span style={{ fontSize: '9px' }}>{m.full}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Wabi-Sabi */}
      {wabiMsg && (
        <p className="mt-2 text-[10px] font-body italic animate-wabi-sabi text-center leading-snug"
           style={{ color: '#c4a882' }}>{wabiMsg}</p>
      )}

      {/* Nota guardada */}
      {!showNota && registroHoy?.nota && (
        <p className="mt-2 text-[10px] font-body text-text-secondary italic truncate">"{registroHoy.nota}"</p>
      )}

      {/* Input nota */}
      {showNota && (
        <div className="mt-2 flex gap-2">
          <input
            autoFocus
            value={notaInput}
            onChange={e => setNotaInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGuardarNota()}
            placeholder="Nota opcional..."
            className="flex-1 px-3 py-1.5 font-body text-sm text-text-primary
                       placeholder-text-muted outline-none min-h-[36px]"
            style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}
          />
          <button onClick={handleGuardarNota}
            className="px-3 py-1.5 font-pixel text-[11px] min-h-[36px] active:translate-y-[1px]"
            style={{ background: 'rgba(80,200,120,0.15)', border: '2px solid #50c878', borderRadius: '2px', color: '#50c878', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
            OK
          </button>
          <button onClick={() => setShowNota(false)}
            className="px-2 py-1.5 font-body text-text-muted text-xs min-h-[36px]">✕</button>
        </div>
      )}

      {/* Historial rápido */}
      {showHistorial && (
        <HistorialRapido caminoId={camino.id} onClose={() => setShowHistorial(false)} />
      )}

      {/* Modal de recompensa desbloqueada */}
      {recompensaUnlock && (
        <RecompensaUnlockModal
          recompensa={recompensaUnlock}
          onClose={() => setRecompensaUnlock(null)}
        />
      )}
    </div>
  )
}
