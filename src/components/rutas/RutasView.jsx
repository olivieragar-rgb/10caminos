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
              className={`flex-1 py-2 font-body font-bold text-[12px] active:translate-y-[1px] min-h-[44px]
                ${filtro === f
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-muted'}`}
              style={{
                border: filtro === f ? '1px solid #e94560' : '1px solid #302e4e',
                borderRadius: '100px',
                boxShadow: filtro === f ? '0 4px 12px rgba(233,69,96,0.2)' : '0 4px 12px rgba(0,0,0,0.4)',
              }}>
              {FILTRO_LABEL[f]}
              {f === 'activa' && (
                <span className="ml-1 text-[11px] opacity-70">
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
        className="fixed bottom-20 right-4 font-body font-bold text-[22px] text-white z-40
                   w-14 h-14 flex items-center justify-center active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, #e94560, #c03040)',
          border: 'none',
          borderRadius: '100px',
          boxShadow: '0 4px 20px rgba(233,69,96,0.4)',
        }}>
        +
      </button>

      {showForm && <RutaForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
