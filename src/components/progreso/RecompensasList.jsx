import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { xpANivel } from '../../utils/xp'
import { v4 as uuidv4 } from 'uuid'

function getProgreso(r, caminos) {
  if (r.caminoId === null) {
    const activos = caminos.filter(c => c.activo)
    if (!activos.length) return { nivel: 0, requerido: r.nivelRequerido }
    const nivelG = Math.floor(activos.reduce((s, c) => s + xpANivel(c.xp), 0) / activos.length)
    return { nivel: nivelG, requerido: r.nivelRequerido }
  }
  const camino = caminos.find(c => c.id === r.caminoId)
  return { nivel: camino ? xpANivel(camino.xp) : 0, requerido: r.nivelRequerido }
}

function RecompensaItem({ r, caminos }) {
  const { nivel, requerido } = getProgreso(r, caminos)
  const desbloqueada = nivel >= requerido
  const pct = Math.min((nivel / requerido) * 100, 100)
  const camino = r.caminoId ? caminos.find(c => c.id === r.caminoId) : null

  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ nombre: r.nombre, icono: r.icono, nivelRequerido: r.nivelRequerido, caminoId: r.caminoId === null ? 'global' : String(r.caminoId) })

  const handleReclamar = () => db.recompensas.update(r.id, { reclamada: true })
  const handleEliminar = () => db.recompensas.delete(r.id)
  const handleGuardar = async () => {
    await db.recompensas.update(r.id, {
      nombre: form.nombre.trim(),
      icono: form.icono.trim() || '🎁',
      nivelRequerido: Number(form.nivelRequerido),
      caminoId: form.caminoId === 'global' ? null : Number(form.caminoId),
    })
    setEditando(false)
  }

  const inputStyle = { background: '#2a2035', border: '2px solid #4a3860', borderRadius: '2px' }

  if (editando) {
    return (
      <div className="p-3 animate-card-entrance" style={{ background: '#342848', border: '2px solid #6a5880', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
        <div className="flex gap-2 mb-2">
          <input value={form.icono} onChange={e => setForm(f => ({ ...f, icono: e.target.value }))}
            maxLength={2} className="w-10 text-center text-lg outline-none py-1" style={inputStyle} />
          <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            placeholder="Nombre de la recompensa"
            className="flex-1 px-2 py-1 font-body text-sm text-text-primary placeholder-text-muted outline-none" style={inputStyle} />
        </div>
        <div className="flex gap-2 mb-3">
          <select value={form.caminoId} onChange={e => setForm(f => ({ ...f, caminoId: e.target.value }))}
            className="flex-1 px-2 py-1 font-body text-sm text-text-primary outline-none" style={inputStyle}>
            <option value="global">🌐 Global</option>
            {caminos.filter(c => c.activo).map(c => (
              <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <span className="font-pixel text-[7px] text-text-muted">NV.</span>
            <input type="number" min={1} value={form.nivelRequerido}
              onChange={e => setForm(f => ({ ...f, nivelRequerido: e.target.value }))}
              className="w-12 px-1 py-1 font-pixel text-[9px] text-xp-bar text-center outline-none" style={inputStyle} />
          </div>
          <div className="flex items-center">
            <span className="font-pixel text-[7px] text-text-muted">= {Number(form.nivelRequerido) * 100} XP</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditando(false)}
            className="flex-1 py-1.5 font-pixel text-[7px] text-text-muted active:translate-y-[1px]"
            style={{ border: '2px solid #4a3860', borderRadius: '2px' }}>CANCELAR</button>
          <button onClick={handleEliminar}
            className="py-1.5 px-2 font-pixel text-[7px] text-red-alert active:translate-y-[1px]"
            style={{ border: '2px solid #e9456040', borderRadius: '2px' }}>✕</button>
          <button onClick={handleGuardar}
            className="flex-1 py-1.5 font-pixel text-[8px] text-white active:translate-y-[1px]"
            style={{ background: 'linear-gradient(180deg, #ffd700, #b8960c)', border: '2px solid #ffd700', borderRadius: '2px', color: '#1a1520' }}>
            GUARDAR
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-3 transition-all ${r.reclamada ? 'opacity-60' : ''}`}
      style={{
        background: '#342848',
        border: `2px solid ${desbloqueada && !r.reclamada ? '#ffd700' : '#4a3860'}`,
        borderRadius: '2px',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
      }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{r.icono}</span>
          <div className="min-w-0">
            <p className={`font-pixel text-[9px] truncate ${desbloqueada && !r.reclamada ? 'text-xp-bar' : 'text-text-secondary'}`}>
              {r.nombre}
            </p>
            <p className="font-pixel text-[7px] text-text-muted mt-0.5">
              {camino ? `${camino.icono} ${camino.nombre.split(' ')[0]}` : 'GLOBAL'}
              {' · '}NV.{requerido} <span style={{ color: '#6b5e52' }}>({requerido * 100} XP)</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!r.reclamada && (
            <button onClick={() => setEditando(true)}
              className="font-pixel text-[7px] text-text-muted px-1.5 py-1 active:translate-y-[1px]"
              style={{ border: '1px solid #4a3860', borderRadius: '2px' }}>✏</button>
          )}
          {desbloqueada && !r.reclamada && (
            <button onClick={handleReclamar}
              className="font-pixel text-[8px] text-xp-bar px-2 py-1.5 active:translate-y-[1px]"
              style={{ background: 'rgba(255,215,0,0.1)', border: '2px solid #ffd700', borderRadius: '2px' }}>
              🎁 RECLAMAR
            </button>
          )}
          {r.reclamada && (
            <span className="font-pixel text-[8px] text-text-muted">✓ RECLAMADA</span>
          )}
          {!desbloqueada && (
            <span className="font-pixel text-[9px] text-xp-bar">{nivel}<span className="text-text-muted">/{requerido}</span></span>
          )}
        </div>
      </div>
      {!desbloqueada && (
        <div className="h-2 overflow-hidden" style={{ background: '#1a1520', border: '1px solid #4a3860' }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ffd700, #f0c040)' }} />
        </div>
      )}
      {desbloqueada && !r.reclamada && (
        <div className="h-2"
          style={{ background: 'linear-gradient(90deg, #ffd700, #f0c040)', boxShadow: '0 0 6px #ffd70050' }} />
      )}
    </div>
  )
}

function CrearRecompensaForm({ caminos, onClose }) {
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('🎁')
  const [nivelReq, setNivelReq] = useState(5)
  const [caminoId, setCaminoId] = useState('global')
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    if (!nombre.trim()) return
    setGuardando(true)
    await db.recompensas.add({
      id: uuidv4(),
      caminoId: caminoId === 'global' ? null : Number(caminoId),
      nombre: nombre.trim(),
      descripcion: null,
      nivelRequerido: Number(nivelReq),
      icono,
      desbloqueada: false,
      reclamada: false,
      desbloqueadaAt: null,
    })
    setGuardando(false)
    onClose()
  }

  const inputStyle = { background: '#2a2035', border: '2px solid #4a3860', borderRadius: '2px' }

  return (
    <div className="mt-3 p-3 animate-fade-in-up" style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}>
      <p className="font-pixel text-[8px] text-text-secondary mb-3">NUEVA RECOMPENSA</p>

      <div className="flex gap-2 mb-2">
        <input
          value={icono}
          onChange={e => setIcono(e.target.value)}
          maxLength={2}
          className="w-12 text-center text-lg outline-none py-1.5"
          style={inputStyle}
        />
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre de la recompensa"
          className="flex-1 px-3 py-1.5 font-body text-sm text-text-primary placeholder-text-muted outline-none min-h-[36px]"
          style={inputStyle}
        />
      </div>

      <div className="flex gap-2 mb-3">
        <select
          value={caminoId}
          onChange={e => setCaminoId(e.target.value)}
          className="flex-1 px-2 py-1.5 font-body text-sm text-text-primary outline-none"
          style={inputStyle}
        >
          <option value="global">🌐 Global</option>
          {caminos.filter(c => c.activo).map(c => (
            <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <span className="font-pixel text-[7px] text-text-muted">NV.</span>
          <input
            type="number"
            min={1}
            value={nivelReq}
            onChange={e => setNivelReq(e.target.value)}
            className="w-14 px-2 py-1.5 font-pixel text-[9px] text-text-primary outline-none text-center"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onClose}
          className="flex-1 py-2 font-pixel text-[8px] text-text-muted active:translate-y-[1px]"
          style={{ background: '#2a2035', border: '2px solid #4a3860', borderRadius: '2px' }}>
          CANCELAR
        </button>
        <button onClick={guardar} disabled={guardando || !nombre.trim()}
          className="flex-1 py-2 font-pixel text-[8px] text-white disabled:opacity-50 active:translate-y-[1px]"
          style={{ background: 'linear-gradient(180deg, #e94560, #c03040)', border: '2px solid #ff6080', borderRadius: '2px' }}>
          CREAR
        </button>
      </div>
    </div>
  )
}

export default function RecompensasList({ caminos }) {
  const recompensas = useLiveQuery(() => db.recompensas.toArray(), [], [])
  const [showForm, setShowForm] = useState(false)

  const proximas = recompensas.filter(r => {
    const { nivel, requerido } = getProgreso(r, caminos)
    return nivel < requerido && !r.reclamada
  })
  const desbloqueadas = recompensas.filter(r => {
    const { nivel, requerido } = getProgreso(r, caminos)
    return nivel >= requerido
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-pixel text-[8px] text-xp-bar">🏆 RECOMPENSAS</p>
        <button
          onClick={() => setShowForm(v => !v)}
          className="font-pixel text-[8px] text-accent px-2 py-1 active:translate-y-[1px]"
          style={{ border: '2px solid #e9456050', borderRadius: '2px' }}
        >
          {showForm ? 'CANCELAR' : '+ NUEVA'}
        </button>
      </div>

      {showForm && (
        <CrearRecompensaForm caminos={caminos} onClose={() => setShowForm(false)} />
      )}

      {/* Desbloqueadas */}
      {desbloqueadas.length > 0 && (
        <div className="mb-4">
          <p className="font-pixel text-[7px] text-xp-bar uppercase tracking-wider mb-2">✨ DESBLOQUEADAS</p>
          <div className="space-y-2">
            {desbloqueadas.map(r => (
              <RecompensaItem key={r.id} r={r} caminos={caminos} />
            ))}
          </div>
        </div>
      )}

      {/* Próximas */}
      {proximas.length > 0 && (
        <div>
          <p className="font-pixel text-[7px] text-text-muted uppercase tracking-wider mb-2">PRÓXIMAS</p>
          <div className="space-y-2">
            {proximas.map(r => (
              <RecompensaItem key={r.id} r={r} caminos={caminos} />
            ))}
          </div>
        </div>
      )}

      {recompensas.length === 0 && !showForm && (
        <p className="font-pixel text-[8px] text-text-muted text-center py-4">
          SIN RECOMPENSAS AÚN. ¡CREA UNA!
        </p>
      )}
    </div>
  )
}
