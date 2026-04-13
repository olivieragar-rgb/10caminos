import { useState } from 'react'
import { useTodasRutas } from '../../hooks/useRutas'
import { useCaminos } from '../../hooks/useCaminos'
import RutaCard from './RutaCard'
import RutaForm from './RutaForm'

const FILTROS = ['activa', 'pausa', 'completada']
const FILTRO_LABEL = { activa: 'Activas', pausa: 'Pausa', completada: 'Completadas' }

export default function RutasView() {
  const [filtro, setFiltro] = useState('activa')
  const [showForm, setShowForm] = useState(false)

  const todasRutas = useTodasRutas()
  const caminos = useCaminos()

  const rutas = todasRutas.filter(r => r.estado === filtro)
  const getCamino = (caminoId) => caminos.find(c => c.id === caminoId)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header filtros */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="font-pixel text-[10px] text-xp-bar mb-3">RUTAS</h2>
        <div className="flex gap-2">
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`flex-1 py-2 font-pixel text-[8px] active:translate-y-[1px] min-h-[44px]
                ${filtro === f
                  ? 'bg-accent/20 border-2 border-accent text-accent'
                  : 'border-2 text-text-muted'}`}
              style={{ borderColor: filtro === f ? '#e94560' : '#4a3860', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
              {FILTRO_LABEL[f]}
              {f === 'activa' && (
                <span className="ml-1 text-[10px] opacity-70">
                  ({todasRutas.filter(r => r.estado === 'activa').length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 pt-1">
        {rutas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <p className="text-3xl mb-3">🗺️</p>
            <p className="font-body text-sm text-text-secondary">
              {filtro === 'activa'
                ? 'No hay rutas activas. Crea tu primera ruta.'
                : `No hay rutas en ${FILTRO_LABEL[filtro].toLowerCase()}.`}
            </p>
          </div>
        ) : (
          rutas.map(ruta => (
            <RutaCard key={ruta.id} ruta={ruta} camino={getCamino(ruta.caminoId)} />
          ))
        )}
      </div>

      {/* FAB crear */}
      <button onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 font-pixel text-[18px] text-white z-40
                   w-12 h-12 flex items-center justify-center active:translate-y-[1px] active:translate-x-[1px]"
        style={{ background: 'linear-gradient(180deg, #e94560, #c03040)', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '4px 4px 0 rgba(0,0,0,0.7)' }}>
        +
      </button>

      {showForm && <RutaForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
