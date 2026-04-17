// src/components/hoy/DashboardSemanal.jsx
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { lunesDeSemana, diasDeSemana, hoyISO } from '../../utils/dates'

function MarcaSemana({ registros, fechas }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {fechas.map((f, i) => {
        const r = registros.find(x => x.fecha === f)
        const color = !r ? '#302e4e'
          : r.marca === 'avance' ? '#50c878'
          : r.marca === 'pausa'  ? '#f0c040'
          : '#706060'
        return (
          <div key={i} style={{
            width: 8, height: 8,
            background: color,
            border: '1px solid #302e4e',
            flexShrink: 0,
          }} />
        )
      })}
    </div>
  )
}

export default function DashboardSemanal() {
  const hoy = hoyISO()
  // lunesDeSemana accepts a Date object
  const lunesDate = lunesDeSemana(new Date(hoy + 'T00:00:00'))
  const fechas = diasDeSemana(lunesDate)
  const caminos = useCaminosActivos()

  const registrosSemana = useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).toArray(),
    [fechas.join(',')], []
  )

  if (!caminos?.length || !registrosSemana) return null

  // Stats: mejor y peor camino de la semana
  const statsXCamino = caminos.map(c => {
    const regs = (registrosSemana || []).filter(r => r.caminoId === c.id)
    const avances = regs.filter(r => r.marca === 'avance').length
    return { camino: c, avances, regs }
  })
  const mejor = statsXCamino.reduce((a, b) => a.avances >= b.avances ? a : b, statsXCamino[0])
  const peor  = statsXCamino.reduce((a, b) => a.avances <= b.avances ? a : b, statsXCamino[0])
  const totalAvances = statsXCamino.reduce((s, x) => s + x.avances, 0)
  const totalPosible = caminos.length * fechas.length

  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  return (
    <div className="mx-4 mb-3 p-3 animate-card-entrance" style={{
      background: '#181726',
      border: '1px solid #302e4e',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    }}>
      {/* Título tablón */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[10px]" style={{ color: '#9590a8' }}>
          📋 TABLÓN DE CAMPAÑA
        </span>
        <span className="font-pixel text-[9px]" style={{ color: '#5c5875' }}>
          SEMANA ACTUAL
        </span>
      </div>

      {/* Cabecera días */}
      <div className="flex items-center mb-1" style={{ gap: 0 }}>
        <div style={{ width: 80, flexShrink: 0 }} />
        <div style={{ display: 'flex', gap: 2 }}>
          {diasSemana.map((d, i) => (
            <div key={i} style={{
              width: 8, textAlign: 'center',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: 6, color: fechas[i] === hoy ? '#f0c040' : '#5c5875',
            }}>{d}</div>
          ))}
        </div>
        <div style={{ marginLeft: 6, fontFamily: '"Press Start 2P", cursive', fontSize: 7, color: '#5c5875' }}>✓</div>
      </div>

      {/* Fila por camino */}
      {statsXCamino.map(({ camino, avances, regs }) => (
        <div key={camino.id} className="flex items-center mb-1" style={{ gap: 0 }}>
          {/* Nombre camino */}
          <div style={{
            width: 80, flexShrink: 0, overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
            fontSize: 9, color: '#9590a8',
            whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            paddingRight: 4,
          }}>
            {camino.icono} {camino.nombre.slice(0, 8)}
          </div>
          {/* Dots */}
          <MarcaSemana registros={regs} fechas={fechas} />
          {/* Count */}
          <span style={{
            marginLeft: 6,
            fontFamily: '"Press Start 2P", cursive',
            fontSize: 7,
            color: avances >= 5 ? '#50c878' : avances >= 3 ? '#f0c040' : '#706060',
          }}>{avances}</span>
        </div>
      ))}

      {/* Resumen footer */}
      <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid #302e4e' }}>
        <span className="font-pixel text-[9px]" style={{ color: '#50c878' }}>
          🏆 {mejor?.camino?.icono} {mejor?.camino?.nombre?.slice(0, 10)}
        </span>
        <span className="font-pixel text-[9px]" style={{ color: '#f0c040' }}>
          {totalAvances}/{totalPosible}
        </span>
        {peor?.avances < mejor?.avances && (
          <span className="font-pixel text-[9px]" style={{ color: '#e94560' }}>
            ⚠ {peor?.camino?.icono} {peor?.camino?.nombre?.slice(0, 8)}
          </span>
        )}
      </div>
    </div>
  )
}
