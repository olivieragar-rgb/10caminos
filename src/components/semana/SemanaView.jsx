import { useState } from 'react'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosSemana } from '../../hooks/useRegistros'
import { lunesDeSemana, diasDeSemana, diaSemanaCorto, formatearFechaCorta, hoyISO } from '../../utils/dates'
import { scoreSemanalCamino } from '../../utils/stats'

const MARCA_SIMBOLO = { avance: '✓', pausa: '→', nada: '○' }
const MARCA_COLOR   = { avance: '#00e676', pausa: '#ffab00', nada: '#616161' }

export default function SemanaView() {
  const [offsetSemana, setOffsetSemana] = useState(0)
  const hoy = hoyISO()

  const lunes = new Date(lunesDeSemana())
  lunes.setDate(lunes.getDate() - offsetSemana * 7)
  const fechas = diasDeSemana(lunes)

  const caminos = useCaminosActivos()
  const registros = useRegistrosSemana(fechas)

  const getRegistro = (caminoId, fecha) =>
    registros.find(r => r.caminoId === caminoId && r.fecha === fecha)

  // Score por día (columna footer)
  const scoresPorDia = fechas.map(f => ({
    fecha: f,
    avances: registros.filter(r => r.fecha === f && r.marca === 'avance').length,
  }))

  const esHoy = (fecha) => fecha === hoy

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <button onClick={() => setOffsetSemana(o => o + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-surface
                     border border-border-dark text-text-secondary active:scale-95">
          ←
        </button>
        <div className="text-center">
          <p className="text-xs text-text-muted">
            {formatearFechaCorta(fechas[0])} – {formatearFechaCorta(fechas[6])}
          </p>
          {offsetSemana === 0 && (
            <p className="text-[10px] text-accent">Esta semana</p>
          )}
        </div>
        <button
          onClick={() => setOffsetSemana(o => Math.max(0, o - 1))}
          disabled={offsetSemana === 0}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-bg-surface
                     border border-border-dark text-text-secondary active:scale-95
                     disabled:opacity-30">
          →
        </button>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-x-auto px-2">
        <table className="w-full border-collapse text-center" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '30%' }} />
            {fechas.map((_, i) => <col key={i} style={{ width: `${70/7}%` }} />)}
            <col style={{ width: '8%' }} />
          </colgroup>

          {/* Header días */}
          <thead>
            <tr>
              <th className="pb-2 text-left pl-2 text-[10px] text-text-muted font-normal">Camino</th>
              {fechas.map(f => (
                <th key={f} className={`pb-2 text-[10px] font-normal
                  ${esHoy(f) ? 'text-accent' : 'text-text-muted'}`}>
                  {diaSemanaCorto(f).toUpperCase().slice(0,1)}
                </th>
              ))}
              <th className="pb-2 text-[10px] text-text-muted font-normal">✓</th>
            </tr>
          </thead>

          <tbody>
            {caminos.map(camino => {
              const score = scoreSemanalCamino(registros, camino.id)
              const nadaCount = registros.filter(r => r.caminoId === camino.id && r.marca === 'nada').length
              const descuidado = nadaCount >= 3
              return (
                <tr key={camino.id}
                  className={`border-t border-border-dark/50 ${descuidado ? 'bg-red-alert/5' : ''}`}>
                  <td className="py-2 pl-2 text-left">
                    <span className="text-xs text-text-secondary truncate block leading-tight">
                      {camino.icono} {camino.nombre.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </td>
                  {fechas.map(f => {
                    const r = getRegistro(camino.id, f)
                    const esF = esHoy(f)
                    return (
                      <td key={f} className={`py-2 ${esF ? 'bg-accent/5 rounded' : ''}`}>
                        {r?.marca ? (
                          <span className="text-xs font-bold"
                            style={{ color: MARCA_COLOR[r.marca] }}>
                            {MARCA_SIMBOLO[r.marca]}
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted/30">·</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="py-2 font-mono text-xs text-xp-bar">{score}</td>
                </tr>
              )
            })}
          </tbody>

          {/* Footer scores por día */}
          <tfoot>
            <tr className="border-t border-border-dark">
              <td className="pt-2 pl-2 text-[10px] text-text-muted text-left">Score</td>
              {scoresPorDia.map(s => (
                <td key={s.fecha} className="pt-2 font-mono text-xs text-green-xp">{s.avances}</td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Leyenda descuidados */}
      <div className="px-4 py-2 text-[10px] text-text-muted">
        <span className="text-red-alert">■</span> Camino con 3+ ○ esta semana
      </div>
    </div>
  )
}
