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
        <h2 className="text-base font-medium text-text-primary mb-3">Rutas</h2>
        <div className="flex gap-2">
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors min-h-[40px]
                ${filtro === f
                  ? 'bg-accent/20 border border-accent/40 text-accent'
                  : 'bg-bg-surface border border-border-dark text-text-muted'}`}>
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
            <p className="text-sm text-text-secondary">
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
        className="fixed bottom-20 right-4 bg-accent text-white rounded-full w-12 h-12
                   flex items-center justify-center text-xl shadow-lg active:scale-95
                   transition-transform z-40 glow-accent">
        +
      </button>

      {showForm && <RutaForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
