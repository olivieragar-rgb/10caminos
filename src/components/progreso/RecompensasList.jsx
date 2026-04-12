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

  const handleReclamar = () => db.recompensas.update(r.id, { reclamada: true })

  return (
    <div className={`p-3 bg-bg-surface border rounded-xl transition-all
        ${desbloqueada && !r.reclamada ? 'border-xp-bar/50' : r.reclamada ? 'border-border-dark opacity-60' : 'border-border-dark'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{r.icono}</span>
          <div>
            <p className={`text-xs font-medium ${desbloqueada && !r.reclamada ? 'text-xp-bar' : 'text-text-secondary'}`}>
              {r.nombre}
            </p>
            <p className="text-[10px] text-text-muted">
              {camino ? `${camino.icono} ${camino.nombre}` : 'Global'} · Nv.{requerido}
            </p>
          </div>
        </div>
        <div>
          {desbloqueada && !r.reclamada && (
            <button onClick={handleReclamar}
              className="px-3 py-1 bg-xp-bar/20 border border-xp-bar/40 rounded-lg
                         text-[10px] text-xp-bar font-semibold active:scale-95 transition-transform">
              🎁 Reclamar
            </button>
          )}
          {r.reclamada && (
            <span className="text-[10px] text-text-muted">✓ Reclamada</span>
          )}
          {!desbloqueada && (
            <span className="font-mono text-[10px] text-text-muted">{nivel}/{requerido}</span>
          )}
        </div>
      </div>
      {!desbloqueada && (
        <div className="h-1 bg-bg-card rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ffd700, #ffab00)' }} />
        </div>
      )}
      {desbloqueada && !r.reclamada && (
        <div className="h-1 rounded-full glow-xp"
          style={{ background: 'linear-gradient(90deg, #ffd700, #ffab00)' }} />
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

  return (
    <div className="mt-3 p-3 bg-bg-surface border border-border-dark rounded-xl animate-fade-in-up">
      <p className="text-xs font-medium text-text-secondary mb-3">Nueva recompensa</p>

      <div className="flex gap-2 mb-2">
        <input
          value={icono}
          onChange={e => setIcono(e.target.value)}
          maxLength={2}
          className="w-12 text-center bg-bg-card border border-border-dark rounded-lg text-lg
                     outline-none focus:border-accent/50 py-1.5"
        />
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre de la recompensa"
          className="flex-1 bg-bg-card border border-border-dark rounded-lg px-3 py-1.5
                     text-sm text-text-primary placeholder-text-muted outline-none
                     focus:border-accent/50 min-h-[36px]"
        />
      </div>

      <div className="flex gap-2 mb-3">
        <select
          value={caminoId}
          onChange={e => setCaminoId(e.target.value)}
          className="flex-1 bg-bg-card border border-border-dark rounded-lg px-2 py-1.5
                     text-sm text-text-primary outline-none focus:border-accent/50"
        >
          <option value="global">🌐 Global</option>
          {caminos.filter(c => c.activo).map(c => (
            <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted">Nv.</span>
          <input
            type="number"
            min={1}
            value={nivelReq}
            onChange={e => setNivelReq(e.target.value)}
            className="w-14 bg-bg-card border border-border-dark rounded-lg px-2 py-1.5
                       text-sm text-text-primary outline-none focus:border-accent/50 text-center"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onClose}
          className="flex-1 py-2 rounded-lg border border-border-dark text-text-muted text-xs">
          Cancelar
        </button>
        <button onClick={guardar} disabled={guardando || !nombre.trim()}
          className="flex-1 py-2 rounded-lg bg-accent text-white text-xs font-medium
                     disabled:opacity-50 active:scale-95 transition-transform">
          Crear
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
        <p className="text-xs font-medium text-text-secondary">🏆 Recompensas</p>
        <button
          onClick={() => setShowForm(v => !v)}
          className="text-xs text-accent border border-accent/30 rounded-lg px-2 py-1
                     active:scale-95 transition-transform"
        >
          {showForm ? 'Cancelar' : '+ Nueva'}
        </button>
      </div>

      {showForm && (
        <CrearRecompensaForm caminos={caminos} onClose={() => setShowForm(false)} />
      )}

      {/* Desbloqueadas */}
      {desbloqueadas.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] text-xp-bar uppercase tracking-wider mb-2">✨ Desbloqueadas</p>
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
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Próximas</p>
          <div className="space-y-2">
            {proximas.map(r => (
              <RecompensaItem key={r.id} r={r} caminos={caminos} />
            ))}
          </div>
        </div>
      )}

      {recompensas.length === 0 && !showForm && (
        <p className="text-xs text-text-muted text-center py-4 italic">
          Sin recompensas aún. ¡Crea una!
        </p>
      )}
    </div>
  )
}
