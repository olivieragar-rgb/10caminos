import { useState } from 'react'
import { crearRuta } from '../../hooks/useRutas'
import { useCaminosActivos } from '../../hooks/useCaminos'

export default function RutaForm({ onClose }) {
  const caminos = useCaminosActivos()
  const [nombre, setNombre] = useState('')
  const [caminoId, setCaminoId] = useState('')
  const [pasos, setPasos] = useState([''])
  const [guardando, setGuardando] = useState(false)

  const addPaso = () => setPasos(p => [...p, ''])
  const updatePaso = (i, v) => setPasos(p => p.map((x, j) => j === i ? v : x))
  const removePaso = (i) => setPasos(p => p.filter((_, j) => j !== i))

  const handleGuardar = async () => {
    if (!nombre.trim() || !caminoId) return
    const pasosValidos = pasos.filter(p => p.trim())
    if (!pasosValidos.length) return
    setGuardando(true)
    await crearRuta(Number(caminoId), nombre.trim(), pasosValidos)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[480px] bg-bg-card border border-border-dark rounded-[2px] p-4 mb-14 max-h-[80vh] overflow-y-auto">
        <h3 className="font-pixel text-[10px] text-xp-bar mb-4">NUEVA RUTA</h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted block mb-1">Nombre de la ruta</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Pasaporte Gaël"
              className="w-full bg-bg-surface border border-border-dark rounded-[2px] px-3 py-2
                         text-sm text-text-primary placeholder-text-muted outline-none
                         focus:border-accent/50 min-h-[44px]" />
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1">Camino</label>
            <select value={caminoId} onChange={e => setCaminoId(e.target.value)}
              className="w-full bg-bg-surface border border-border-dark rounded-[2px] px-3 py-2
                         text-sm text-text-primary outline-none focus:border-accent/50 min-h-[44px]">
              <option value="">Seleccionar camino...</option>
              {caminos.map(c => (
                <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-2">Pasos</label>
            {pasos.map((paso, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="text-xs text-text-muted font-mono w-5 pt-2.5 flex-shrink-0">{i+1}.</span>
                <input value={paso} onChange={e => updatePaso(i, e.target.value)}
                  placeholder={`Paso ${i+1}...`}
                  className="flex-1 bg-bg-surface border border-border-dark rounded-[2px] px-3 py-2
                             text-sm text-text-primary placeholder-text-muted outline-none
                             focus:border-accent/50 min-h-[44px]" />
                {pasos.length > 1 && (
                  <button onClick={() => removePaso(i)}
                    className="text-text-muted text-sm px-2 min-h-[44px]">✕</button>
                )}
              </div>
            ))}
            <button onClick={addPaso}
              className="w-full py-2 border border-dashed border-border-dark rounded-[2px]
                         text-xs text-text-muted active:scale-98 min-h-[40px]">
              + Añadir paso
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 font-pixel text-[9px] text-text-muted min-h-[44px] active:translate-y-[1px]"
            style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
            CANCELAR
          </button>
          <button onClick={handleGuardar} disabled={guardando || !nombre.trim() || !caminoId}
            className="flex-1 py-2.5 font-pixel text-[9px] text-white disabled:opacity-40 min-h-[44px] active:translate-y-[1px]"
            style={{ background: 'linear-gradient(180deg, #e94560, #c03040)', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
            CREAR RUTA
          </button>
        </div>
      </div>
    </div>
  )
}
