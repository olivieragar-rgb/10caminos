import { hoyISO } from '../../utils/dates'

const NIVELES = [
  { min: 0,   max: 0,   color: '#181726' },
  { min: 1,   max: 39,  color: '#4ade8030' },
  { min: 40,  max: 69,  color: '#4ade8060' },
  { min: 70,  max: 99,  color: '#4ade8090' },
  { min: 100, max: 999, color: '#4ade80' },
]

function getColor(pct) {
  return NIVELES.find(n => pct >= n.min && pct <= n.max)?.color ?? '#181726'
}

export default function Heatmap({ registros, totalCaminos }) {
  const hoy = hoyISO()
  // Últimas 12 semanas (84 días)
  const dias = Array.from({ length: 84 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (83 - i))
    return d.toISOString().slice(0, 10)
  })

  const scoresPorFecha = {}
  for (const fecha of dias) {
    const avances = registros.filter(r => r.fecha === fecha && r.marca === 'avance').length
    scoresPorFecha[fecha] = totalCaminos ? Math.round((avances / totalCaminos) * 100) : 0
  }

  // Agrupar en semanas de 7
  const semanas = []
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7))
  }

  return (
    <div>
      <p className="font-pixel text-[7px] text-text-muted mb-2">ACTIVIDAD (12 SEMANAS)</p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {semanas.map((semana, si) => (
          <div key={si} className="flex flex-col gap-1">
            {semana.map(fecha => {
              const pct = scoresPorFecha[fecha] ?? 0
              const esHoy = fecha === hoy
              return (
                <div key={fecha}
                  title={`${fecha}: ${pct}%`}
                  className={`w-3.5 h-3.5 flex-shrink-0
                    ${esHoy ? 'ring-1 ring-accent' : ''}`}
                  style={{ backgroundColor: getColor(pct), borderRadius: '3px' }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-text-muted">Menos</span>
        {NIVELES.map((n, i) => (
          <div key={i} className="w-3 h-3" style={{ backgroundColor: n.color, borderRadius: '3px' }} />
        ))}
        <span className="text-[10px] text-text-muted">Más</span>
      </div>
    </div>
  )
}
