// src/components/hoy/DashboardSemanal.jsx
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { lunesDeSemana, diasDeSemana, hoyISO } from '../../utils/dates'

function MarcaSemana({ registros, fechas, hoy }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {fechas.map((f, i) => {
        const r = registros.find(x => x.fecha === f)
        const esHoy = f === hoy
        const esFuturo = f > hoy
        const color = esFuturo ? 'transparent'
          : !r        ? '#2a2840'
          : r.marca === 'avance' ? '#50c878'
          : r.marca === 'pausa'  ? '#f0c040'
          : '#4a3a3a'
        const glow = r?.marca === 'avance' ? '0 0 6px #50c87860'
          : r?.marca === 'pausa' ? '0 0 6px #f0c04050'
          : 'none'
        return (
          <div key={i} style={{
            width: 11, height: 11,
            background: color,
            borderRadius: 3,
            border: esHoy ? '1px solid #f0c040' : esFuturo ? '1px dashed #2a2840' : '1px solid #302e4e',
            flexShrink: 0,
            boxShadow: glow,
          }} />
        )
      })}
    </div>
  )
}

export default function DashboardSemanal() {
  const hoy = hoyISO()
  const lunesDate = lunesDeSemana(new Date(hoy + 'T00:00:00'))
  const fechas = diasDeSemana(lunesDate)
  const caminos = useCaminosActivos()

  const registrosSemana = useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).toArray(),
    [fechas.join(',')], []
  )

  if (!caminos?.length || !registrosSemana) return null

  const statsXCamino = caminos.map(c => {
    const regs = (registrosSemana || []).filter(r => r.caminoId === c.id)
    const avances = regs.filter(r => r.marca === 'avance').length
    return { camino: c, avances, regs }
  })
  const mejor = statsXCamino.reduce((a, b) => a.avances >= b.avances ? a : b, statsXCamino[0])
  const peor  = statsXCamino.reduce((a, b) => a.avances <= b.avances ? a : b, statsXCamino[0])
  const totalAvances = statsXCamino.reduce((s, x) => s + x.avances, 0)
  const diasTranscurridos = fechas.filter(f => f <= hoy).length
  const totalPosible = caminos.length * diasTranscurridos

  const pct = totalPosible > 0 ? Math.round((totalAvances / totalPosible) * 100) : 0
  const pctColor = pct >= 70 ? '#50c878' : pct >= 40 ? '#f0c040' : '#e94560'

  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  return (
    <div className="mx-4 mb-3 animate-card-entrance" style={{
      background: '#181726',
      border: '1px solid #302e4e',
      borderRadius: '10px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      overflow: 'hidden',
    }}>
      {/* Barra de progreso semanal */}
      <div style={{ height: 3, background: '#2a2840' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: pctColor,
          transition: 'width 0.6s ease',
          boxShadow: `0 0 8px ${pctColor}80`,
        }} />
      </div>

      <div className="p-3">
        {/* Título */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-pixel text-[10px]" style={{ color: '#9590a8' }}>
            📋 TABLÓN DE CAMPAÑA
          </span>
          <span className="font-body text-[11px] font-semibold" style={{ color: pctColor }}>
            {pct}%
          </span>
        </div>

        {/* Cabecera días */}
        <div className="flex items-center mb-1.5">
          <div style={{ width: 82, flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 3 }}>
            {diasSemana.map((d, i) => (
              <div key={i} style={{
                width: 11, textAlign: 'center',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: 6,
                color: fechas[i] === hoy ? '#f0c040' : fechas[i] > hoy ? '#2a2840' : '#5c5875',
              }}>{d}</div>
            ))}
          </div>
          <div style={{ marginLeft: 7, fontFamily: '"Press Start 2P", cursive', fontSize: 7, color: '#5c5875' }}>✓</div>
        </div>

        {/* Fila por camino */}
        {statsXCamino.map(({ camino, avances, regs }) => (
          <div key={camino.id} className="flex items-center mb-1.5">
            <div style={{
              width: 82, flexShrink: 0, overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
              fontSize: 10, color: '#9590a8',
              whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              paddingRight: 4,
            }}>
              {camino.icono} {camino.nombre.slice(0, 8)}
            </div>
            <MarcaSemana registros={regs} fechas={fechas} hoy={hoy} />
            <span style={{
              marginLeft: 7,
              fontFamily: '"Press Start 2P", cursive',
              fontSize: 7,
              color: avances >= 5 ? '#50c878' : avances >= 3 ? '#f0c040' : '#5c5875',
            }}>{avances}</span>
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid #1e1c30' }}>
          <span className="font-body text-[11px]" style={{ color: '#50c878' }}>
            🏆 {mejor?.camino?.icono} {mejor?.camino?.nombre?.split(' ')[0]}
          </span>
          <span className="font-body text-[11px] font-semibold" style={{ color: '#5c5875' }}>
            {totalAvances}/{totalPosible}
          </span>
          {peor?.avances < mejor?.avances && (
            <span className="font-body text-[11px]" style={{ color: '#e94560' }}>
              ⚠ {peor?.camino?.icono} {peor?.camino?.nombre?.split(' ')[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
