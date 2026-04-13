import { useState } from 'react'
import { useCaminos, updateCamino, resetCaminoStats } from '../../hooks/useCaminos'
import { db } from '../../db'
import { haceNDiasISO } from '../../utils/dates'
import { xpANivel, nombreNivel } from '../../utils/xp'
import { useLiveQuery } from 'dexie-react-hooks'

const MARCA_SIMBOLO = { avance: '✓', pausa: '→', nada: '○' }
const MARCA_COLOR   = { avance: '#50c878', pausa: '#f0c040', nada: '#706060' }

// ── Subcomponente: historial inline ─────────────────────────────────────────
function HistorialCamino({ camino, onClose }) {
  const fechas = Array.from({ length: 30 }, (_, i) => haceNDiasISO(i))
  const registros = useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas)
         .filter(r => r.caminoId === camino.id).toArray(),
    [camino.id],
    []
  )
  const sorted = [...(registros || [])].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid #4a3860' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[8px] text-text-muted">HISTORIAL (30d)</span>
        <button onClick={onClose} className="font-pixel text-[8px] text-text-muted px-2 py-1"
                style={{ border: '1px solid #4a3860', borderRadius: '2px' }}>✕</button>
      </div>
      {sorted.length === 0 ? (
        <p className="font-body text-[11px] text-text-muted italic">Sin registros.</p>
      ) : (
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
          {sorted.map(r => (
            <div key={r.id} className="flex items-center gap-2">
              <span className="font-pixel text-[7px] text-text-muted w-20 flex-shrink-0">{r.fecha}</span>
              <span className="font-pixel text-[10px] font-bold flex-shrink-0"
                    style={{ color: MARCA_COLOR[r.marca] ?? '#a89b8c' }}>
                {MARCA_SIMBOLO[r.marca] ?? '?'}
              </span>
              {r.nota && (
                <span className="font-body text-[10px] text-text-secondary truncate italic">
                  "{r.nota}"
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Subcomponente: tarjeta de un camino ─────────────────────────────────────
function CaminoManagerCard({ camino, onMoverArriba, onMoverAbajo, esPrimero, esUltimo }) {
  const [editando, setEditando]         = useState(false)
  const [verHistorial, setVerHistorial] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [form, setForm] = useState({
    nombre:    camino.nombre,
    identidad: camino.identidad,
    ikigai:    camino.ikigai || '',
    icono:     camino.icono,
  })

  const esIndefinido = camino.nombre === '(Por definir)'

  const rutasActivas = useLiveQuery(
    () => db.rutas.where('caminoId').equals(camino.id).filter(r => r.estado === 'activa').count(),
    [camino.id], 0
  )

  const nivel = xpANivel(camino.xp)

  const guardar = async () => {
    if (!form.nombre.trim()) return
    await updateCamino(camino.id, {
      nombre:    form.nombre.trim(),
      identidad: form.identidad.trim(),
      ikigai:    form.ikigai.trim(),
      icono:     form.icono.trim() || '⭐',
      activo:    true,
    })
    setEditando(false)
  }

  const toggleActivo = async () => {
    await updateCamino(camino.id, { activo: !camino.activo })
  }

  const confirmarReset = async () => {
    await resetCaminoStats(camino.id)
    setConfirmReset(false)
  }

  // Tarjeta "por definir"
  if (esIndefinido && !editando) {
    return (
      <div className="rpg-card mx-0 p-3 mb-3 opacity-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{camino.icono}</span>
            <span className="font-pixel text-[9px] text-text-muted">CAMINO {camino.id} — SIN DEFINIR</span>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="font-pixel text-[8px] px-3 py-2 active:translate-y-[1px] active:translate-x-[1px]"
            style={{ background: 'linear-gradient(180deg,#342848,#2a2035)', border: '2px solid #6a5880', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', color: '#c4a882' }}
          >
            + DEFINIR
          </button>
        </div>
      </div>
    )
  }

  // Modo edición
  if (editando) {
    return (
      <div className="rpg-card mx-0 p-3 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <input
            value={form.icono}
            onChange={e => setForm(f => ({ ...f, icono: e.target.value }))}
            className="w-12 h-12 text-2xl text-center font-body outline-none"
            style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}
            maxLength={2}
          />
          <div className="flex-1">
            <input
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              placeholder="Nombre del camino"
              className="w-full px-2 py-1.5 font-pixel text-[9px] text-text-primary outline-none mb-1"
              style={{ background: '#342848', border: '2px solid #6a5880', borderRadius: '2px' }}
            />
            <input
              value={form.identidad}
              onChange={e => setForm(f => ({ ...f, identidad: e.target.value }))}
              placeholder="Identidad (quién eres)"
              className="w-full px-2 py-1.5 font-body text-[11px] text-text-primary outline-none"
              style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}
            />
          </div>
        </div>
        <textarea
          value={form.ikigai}
          onChange={e => setForm(f => ({ ...f, ikigai: e.target.value }))}
          placeholder="Ikigai / propósito profundo..."
          rows={2}
          className="w-full px-2 py-1.5 font-body text-[11px] text-text-secondary outline-none resize-none mb-3"
          style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setEditando(false); setForm({ nombre: camino.nombre, identidad: camino.identidad, ikigai: camino.ikigai || '', icono: camino.icono }) }}
            className="flex-1 py-2 font-pixel text-[8px] text-text-muted active:translate-y-[1px]"
            style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
          >
            CANCELAR
          </button>
          <button
            onClick={guardar}
            className="flex-1 py-2 font-pixel text-[8px] text-white active:translate-y-[1px]"
            style={{ background: 'linear-gradient(180deg,#3355AA,#223366)', border: '2px solid #5577CC', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
          >
            GUARDAR
          </button>
        </div>
      </div>
    )
  }

  // Vista normal
  return (
    <div className="rpg-card mx-0 mb-3"
         style={{ borderLeftColor: camino.activo ? '#4a3860' : '#3a2d45', opacity: camino.activo ? 1 : 0.55 }}>
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl flex-shrink-0">{camino.icono}</span>
            <div className="min-w-0">
              <p className="font-pixel text-[9px] text-text-primary leading-tight truncate">{camino.nombre}</p>
              <p className="font-body text-[10px] text-text-secondary italic mt-0.5 truncate">{camino.identidad}</p>
            </div>
          </div>
          {/* Reorder buttons */}
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              onClick={onMoverArriba} disabled={esPrimero}
              className="px-1.5 py-0.5 font-pixel text-[8px] disabled:opacity-30 active:translate-y-[1px]"
              style={{ border: '1px solid #4a3860', borderRadius: '2px', color: '#a89b8c' }}
            >▲</button>
            <button
              onClick={onMoverAbajo} disabled={esUltimo}
              className="px-1.5 py-0.5 font-pixel text-[8px] disabled:opacity-30 active:translate-y-[1px]"
              style={{ border: '1px solid #4a3860', borderRadius: '2px', color: '#a89b8c' }}
            >▼</button>
          </div>
        </div>

        {/* Ikigai */}
        {camino.ikigai ? (
          <p className="font-body text-[10px] italic mb-2 pl-7" style={{ color: '#c4a882', opacity: 0.85 }}>
            "{camino.ikigai}"
          </p>
        ) : null}

        {/* Stats */}
        <div className="flex gap-3 mb-3 pl-7">
          <div className="text-center">
            <p className="font-pixel text-[8px] text-text-muted">NIV</p>
            <p className="font-pixel text-[10px] text-xp-bar">{nivel}</p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-[8px] text-text-muted">XP</p>
            <p className="font-pixel text-[10px] text-text-primary">{camino.xp}</p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-[8px] text-text-muted">🔥</p>
            <p className="font-pixel text-[10px] text-racha-fire">{camino.rachaActual}</p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-[8px] text-text-muted">MÁX</p>
            <p className="font-pixel text-[10px] text-text-secondary">{camino.rachaMejor}</p>
          </div>
          {rutasActivas > 0 && (
            <div className="text-center">
              <p className="font-pixel text-[8px] text-text-muted">RUTAS</p>
              <p className="font-pixel text-[10px] text-blue-mana">{rutasActivas}</p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setEditando(true)}
            className="px-2 py-1.5 font-pixel text-[7px] active:translate-y-[1px]"
            style={{ background: '#342848', border: '2px solid #6a5880', borderRadius: '2px', color: '#c4a882', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
          >✏ EDITAR</button>

          <button
            onClick={toggleActivo}
            className="px-2 py-1.5 font-pixel text-[7px] active:translate-y-[1px]"
            style={{
              background: camino.activo ? 'rgba(112,96,96,0.15)' : 'rgba(80,200,120,0.15)',
              border: `2px solid ${camino.activo ? '#706060' : '#50c878'}`,
              borderRadius: '2px',
              color: camino.activo ? '#706060' : '#50c878',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
            }}
          >{camino.activo ? '⊗ DESACT' : '⊕ ACTIVAR'}</button>

          <button
            onClick={() => setVerHistorial(v => !v)}
            className="px-2 py-1.5 font-pixel text-[7px] active:translate-y-[1px]"
            style={{ background: '#342848', border: '2px solid #4488cc', borderRadius: '2px', color: '#4488cc', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
          >📜 HISTORIAL</button>

          <button
            onClick={() => setConfirmReset(true)}
            className="px-2 py-1.5 font-pixel text-[7px] active:translate-y-[1px]"
            style={{ background: 'rgba(233,69,96,0.1)', border: '2px solid #e94560', borderRadius: '2px', color: '#e94560', boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}
          >⚠ RESET</button>
        </div>

        {/* Confirmación reset */}
        {confirmReset && (
          <div className="mt-3 p-2" style={{ background: 'rgba(233,69,96,0.1)', border: '2px solid #e94560', borderRadius: '2px' }}>
            <p className="font-pixel text-[8px] text-accent mb-2">¿BORRAR TODO EL PROGRESO?</p>
            <p className="font-body text-[10px] text-text-secondary mb-3">XP, nivel y rachas vuelven a 0. Los registros diarios se conservan.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmReset(false)}
                className="flex-1 py-1.5 font-pixel text-[7px] text-text-muted"
                style={{ border: '2px solid #4a3860', borderRadius: '2px' }}>NO</button>
              <button onClick={confirmarReset}
                className="flex-1 py-1.5 font-pixel text-[8px] text-white active:translate-y-[1px]"
                style={{ background: 'linear-gradient(180deg,#e94560,#c03040)', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                SÍ, RESET
              </button>
            </div>
          </div>
        )}

        {/* Historial inline */}
        {verHistorial && (
          <HistorialCamino camino={camino} onClose={() => setVerHistorial(false)} />
        )}
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function CaminosManager({ onClose }) {
  const caminos = useCaminos()

  const moverArriba = async (camino) => {
    const idx = caminos.findIndex(c => c.id === camino.id)
    if (idx <= 0) return
    const anterior = caminos[idx - 1]
    await updateCamino(camino.id,    { orden: anterior.orden })
    await updateCamino(anterior.id,  { orden: camino.orden })
  }

  const moverAbajo = async (camino) => {
    const idx = caminos.findIndex(c => c.id === camino.id)
    if (idx >= caminos.length - 1) return
    const siguiente = caminos[idx + 1]
    await updateCamino(camino.id,     { orden: siguiente.orden })
    await updateCamino(siguiente.id,  { orden: camino.orden })
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3"
           style={{ background: '#1a1520', borderBottom: '2px solid #4a3860', boxShadow: '0 2px 0 rgba(0,0,0,0.4)' }}>
        <button
          onClick={onClose}
          className="font-pixel text-[9px] px-3 py-2 active:translate-y-[1px] active:translate-x-[1px]"
          style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', color: '#a89b8c', boxShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}
        >← VOLVER</button>
        <h1 className="font-pixel text-[11px] text-xp-bar" style={{ textShadow: '0 0 8px #ffd70060' }}>
          CAMINOS
        </h1>
        <span className="font-pixel text-[8px] text-text-muted ml-auto">
          {caminos.filter(c => c.activo).length}/{caminos.length} activos
        </span>
      </div>

      {/* Lista de caminos */}
      <div className="flex-1 px-4 pt-4 pb-20 overflow-y-auto">
        {caminos.map((camino, idx) => (
          <CaminoManagerCard
            key={camino.id}
            camino={camino}
            onMoverArriba={() => moverArriba(camino)}
            onMoverAbajo={() => moverAbajo(camino)}
            esPrimero={idx === 0}
            esUltimo={idx === caminos.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
