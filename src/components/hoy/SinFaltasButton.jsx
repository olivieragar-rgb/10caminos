import { useState } from 'react'
import { Shield, X } from '@phosphor-icons/react'
import { hoyISO, formatearFechaLarga } from '../../utils/dates'

function colorBordeTiempo() {
  const ahora = new Date()
  const medianoche = new Date()
  medianoche.setHours(23, 59, 59, 999)
  const horas = (medianoche - ahora) / 3_600_000
  if (horas > 6) return '#4ade80'
  if (horas > 2) return '#f97316'
  return '#f43f5e'
}

function TarjetaActividad({ camino, registroHoy, rutaActiva }) {
  const borde = colorBordeTiempo()
  const marcaHoy = registroHoy?.marca
  const paso = rutaActiva?.pasos?.[rutaActiva.pasoActual ?? 0]

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        background: '#181726',
        border: `2px solid ${borde}`,
        boxShadow: `0 0 8px ${borde}25`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{camino.icono}</span>
        <span className="font-body font-semibold text-base text-text-primary flex-1 truncate">
          {camino.nombre}
        </span>
        {marcaHoy && (
          <span
            className="font-body font-bold text-sm px-2 py-0.5 rounded-full"
            style={{
              background: marcaHoy === 'avance' ? '#4ade8020' : marcaHoy === 'pausa' ? '#fbbf2420' : '#6b728020',
              color: marcaHoy === 'avance' ? '#4ade80' : marcaHoy === 'pausa' ? '#fbbf24' : '#6b7280',
            }}
          >
            {marcaHoy === 'avance' ? '✓ Hecho' : marcaHoy === 'pausa' ? '→ Pausa' : '○ No hoy'}
          </span>
        )}
      </div>
      {paso ? (
        <p className="font-body text-sm text-text-secondary leading-snug">
          ▸ {paso.texto}
        </p>
      ) : (
        <p className="font-body text-sm text-text-muted italic">Sin misión asignada</p>
      )}
    </div>
  )
}

export default function SinFaltasButton({ caminos, registrosHoy, rutasActivas }) {
  const [abierto, setAbierto] = useState(false)
  const hoy = hoyISO()

  const caminosActivos = (caminos || []).filter(c => c.activo)
  const completados = caminosActivos.filter(c =>
    (registrosHoy || []).some(r => r.caminoId === c.id && r.marca === 'avance')
  ).length
  const total = caminosActivos.length
  const todosHechos = total > 0 && completados === total

  return (
    <>
      <div className="px-4 py-3">
        <button
          onClick={() => setAbierto(true)}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl
                     active:scale-[0.98] transition-all duration-150 select-none"
          style={{
            background: todosHechos
              ? 'linear-gradient(135deg, rgba(74,222,128,0.08), #181726)'
              : 'linear-gradient(135deg, rgba(233,69,96,0.08), #181726)',
            border: `2px solid ${todosHechos ? '#4ade80' : '#e94560'}`,
            boxShadow: `0 0 20px ${todosHechos ? '#4ade8030' : '#e9456030'}`,
            animation: 'glowPulse 2.5s ease-in-out infinite',
          }}
        >
          <Shield size={22} weight="duotone"
            color={todosHechos ? '#4ade80' : '#e94560'} />
          <span className="font-pixel text-sm"
                style={{ color: todosHechos ? '#4ade80' : '#e94560' }}>
            {todosHechos ? '✓ MISIÓN CUMPLIDA' : 'SIN FALTAS DE HOY'}
          </span>
          <span className="font-body text-sm font-semibold"
                style={{ color: '#5c5875' }}>
            {completados}/{total}
          </span>
        </button>
      </div>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => e.target === e.currentTarget && setAbierto(false)}
        >
          <div
            className="w-full max-w-[480px] mx-auto flex flex-col"
            style={{
              background: '#0e0e1a',
              borderRadius: '20px 20px 0 0',
              border: '1px solid #302e4e',
              borderBottom: 'none',
              maxHeight: '88vh',
            }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3"
                 style={{ borderBottom: '1px solid #302e4e' }}>
              <div>
                <h2 className="font-pixel text-base text-text-primary">HOY</h2>
                <p className="font-body text-sm text-text-muted capitalize">
                  {formatearFechaLarga(hoy)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm font-semibold"
                      style={{ color: todosHechos ? '#4ade80' : '#9590a8' }}>
                  {completados}/{total} completados
                </span>
                <button
                  onClick={() => setAbierto(false)}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, background: '#2d2b47', color: '#9590a8' }}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-5 pt-4 pb-8">
              {caminosActivos.length === 0 ? (
                <p className="font-body text-sm text-text-muted text-center py-8">
                  No hay caminos activos
                </p>
              ) : (
                caminosActivos.map(camino => (
                  <TarjetaActividad
                    key={camino.id}
                    camino={camino}
                    registroHoy={(registrosHoy || []).find(r => r.caminoId === camino.id) || null}
                    rutaActiva={(rutasActivas || []).find(r => r.caminoId === camino.id) || null}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
