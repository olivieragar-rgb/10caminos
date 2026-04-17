import { useState } from 'react'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosSemana } from '../../hooks/useRegistros'
import { lunesDeSemana, diasDeSemana, diaSemanaCorto, formatearFechaCorta, hoyISO } from '../../utils/dates'
import { scoreSemanalCamino } from '../../utils/stats'

function MarcaCell({ marca }) {
  if (!marca) return <span style={{ color: '#302e4e', fontSize: '14px', lineHeight: 1 }}>·</span>
  const config = {
    avance: { sym: '✓', color: '#4ade80' },
    pausa:  { sym: '→', color: '#fbbf24' },
    nada:   { sym: '○', color: '#6b7280' },
  }
  const c = config[marca]
  if (!c) return null
  return <span style={{ color: c.color, fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>{c.sym}</span>
}

// ────────────────────────────────────────────────────────────────────────────

export default function SemanaView() {
  const [offsetSemana, setOffsetSemana] = useState(0)
  const hoy = hoyISO()

  const lunes = new Date(lunesDeSemana())
  lunes.setDate(lunes.getDate() - offsetSemana * 7)
  const fechas = diasDeSemana(lunes)

  const caminos  = useCaminosActivos()
  const registros = useRegistrosSemana(fechas)

  const getRegistro = (caminoId, fecha) =>
    registros.find(r => r.caminoId === caminoId && r.fecha === fecha)

  const scoresPorDia = fechas.map(f => ({
    fecha: f,
    avances: registros.filter(r => r.fecha === f && r.marca === 'avance').length,
  }))

  const esHoy = (fecha) => fecha === hoy

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between"
           style={{ borderBottom: '1px solid #4a4770' }}>
        <button
          onClick={() => setOffsetSemana(o => o + 1)}
          className="w-9 h-9 flex items-center justify-center font-body text-[14px] active:translate-y-[1px]"
          style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '6px', color: '#a89b8c', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
          ←
        </button>
        <div className="text-center">
          <p className="font-body text-[11px] text-text-muted">
            {formatearFechaCorta(fechas[0])} – {formatearFechaCorta(fechas[6])}
          </p>
          {offsetSemana === 0 && (
            <p className="font-pixel text-[7px] text-accent mt-0.5">ESTA SEMANA</p>
          )}
        </div>
        <button
          onClick={() => setOffsetSemana(o => Math.max(0, o - 1))}
          disabled={offsetSemana === 0}
          className="w-9 h-9 flex items-center justify-center font-body text-[14px] active:translate-y-[1px] disabled:opacity-30"
          style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '6px', color: '#a89b8c', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
          →
        </button>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-x-auto px-2 pt-2">
        <table className="w-full border-collapse text-center" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '28%' }}/>
            {fechas.map((_, i) => <col key={i} style={{ width: `${65/7}%` }}/>)}
            <col style={{ width: '7%' }}/>
          </colgroup>

          <thead>
            <tr>
              <th className="pb-2 text-left pl-2 font-pixel text-[7px] text-text-muted font-normal">CAMINO</th>
              {fechas.map(f => (
                <th key={f} className="pb-2 font-body font-normal"
                    style={{ fontSize: 11, color: esHoy(f) ? '#e94560' : '#6b5e52' }}>
                  {diaSemanaCorto(f).toUpperCase().slice(0, 1)}
                </th>
              ))}
              <th className="pb-2 font-body text-[11px] text-xp-bar font-normal">⭐</th>
            </tr>
          </thead>

          <tbody>
            {caminos.map(camino => {
              const score = scoreSemanalCamino(registros, camino.id)
              const nadaCount = registros.filter(r => r.caminoId === camino.id && r.marca === 'nada').length
              const descuidado = nadaCount >= 3
              return (
                <tr key={camino.id}
                    style={{ borderTop: '1px solid #302e4e', background: descuidado ? 'rgba(232,48,48,0.05)' : 'transparent' }}>
                  <td className="py-1.5 pl-2 text-left">
                    <span className="font-body text-[10px] text-text-secondary truncate block leading-tight">
                      {camino.icono} {camino.nombre.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </td>
                  {fechas.map(f => {
                    const r = getRegistro(camino.id, f)
                    return (
                      <td key={f} className="py-1"
                          style={{ background: esHoy(f) ? 'rgba(233,69,96,0.05)' : 'transparent' }}>
                        <div className="flex items-center justify-center">
                          <MarcaCell marca={r?.marca ?? null} />
                        </div>
                      </td>
                    )
                  })}
                  <td className="py-1 font-body text-[11px] text-xp-bar">{score}</td>
                </tr>
              )
            })}
          </tbody>

          <tfoot>
            <tr style={{ borderTop: '1px solid #4a4770' }}>
              <td className="pt-2 pl-2 font-pixel text-[7px] text-text-muted text-left">SCORE</td>
              {scoresPorDia.map(s => (
                <td key={s.fecha} className="pt-2 font-body text-[11px] text-green-xp">{s.avances}</td>
              ))}
              <td/>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Leyenda */}
      <div className="px-4 py-2 flex items-center gap-4" style={{ borderTop: '1px solid #302e4e' }}>
        <div className="flex items-center gap-1"><MarcaCell marca="avance" /><span className="font-body text-[10px] text-text-muted ml-1">Avance</span></div>
        <div className="flex items-center gap-1"><MarcaCell marca="pausa" /><span className="font-body text-[10px] text-text-muted ml-1">Pausa</span></div>
        <div className="flex items-center gap-1"><MarcaCell marca="nada" /><span className="font-body text-[10px] text-text-muted ml-1">Nada</span></div>
        {caminos.some(c => registros.filter(r => r.caminoId === c.id && r.marca === 'nada').length >= 3) && (
          <span className="font-body text-[10px] text-red-alert ml-auto">■ 3+ Nada</span>
        )}
      </div>
    </div>
  )
}
