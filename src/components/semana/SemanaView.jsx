import { useState } from 'react'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosSemana } from '../../hooks/useRegistros'
import { lunesDeSemana, diasDeSemana, diaSemanaCorto, formatearFechaCorta, hoyISO } from '../../utils/dates'
import { scoreSemanalCamino } from '../../utils/stats'

// ── Sprites RPG para marcas ──────────────────────────────────────────────────

function Estrella() {
  // Avance ✓ → estrella dorada
  return (
    <svg viewBox="0 0 7 7" width={14} height={14} style={{ imageRendering: 'pixelated', display: 'inline-block' }}>
      <rect x="3" y="0" width="1" height="2" fill="#FFD700"/>
      <rect x="0" y="2" width="7" height="2" fill="#FFD700"/>
      <rect x="1" y="1" width="1" height="1" fill="#FFD700"/>
      <rect x="5" y="1" width="1" height="1" fill="#FFD700"/>
      <rect x="1" y="4" width="2" height="2" fill="#FFD700"/>
      <rect x="4" y="4" width="2" height="2" fill="#FFD700"/>
      <rect x="2" y="5" width="1" height="2" fill="#FFD700"/>
      <rect x="4" y="5" width="1" height="2" fill="#FFD700"/>
    </svg>
  )
}

function Reloj() {
  // Pausa → → reloj de arena
  return (
    <svg viewBox="0 0 7 9" width={12} height={16} style={{ imageRendering: 'pixelated', display: 'inline-block' }}>
      <rect x="0" y="0" width="7" height="1" fill="#F0C040"/>
      <rect x="1" y="1" width="5" height="1" fill="#F0C040"/>
      <rect x="2" y="2" width="3" height="1" fill="#F0C040"/>
      <rect x="3" y="3" width="1" height="2" fill="#F0C040"/>
      <rect x="2" y="5" width="3" height="1" fill="#F0C040"/>
      <rect x="1" y="6" width="5" height="1" fill="#F0C040"/>
      <rect x="2" y="7" width="3" height="1" fill="#F0C040"/>
      <rect x="0" y="8" width="7" height="1" fill="#F0C040"/>
    </svg>
  )
}

function Calavera() {
  // Nada ○ → calavera cute (no agresiva)
  return (
    <svg viewBox="0 0 8 9" width={14} height={16} style={{ imageRendering: 'pixelated', display: 'inline-block' }}>
      {/* Cráneo */}
      <rect x="1" y="0" width="6" height="1" fill="#706060"/>
      <rect x="0" y="1" width="8" height="4" fill="#706060"/>
      <rect x="1" y="5" width="6" height="1" fill="#706060"/>
      {/* Ojos */}
      <rect x="1" y="2" width="2" height="2" fill="#1a1520"/>
      <rect x="5" y="2" width="2" height="2" fill="#1a1520"/>
      {/* Nariz */}
      <rect x="3" y="3" width="2" height="1" fill="#1a1520"/>
      {/* Mandíbula */}
      <rect x="2" y="6" width="1" height="3" fill="#706060"/>
      <rect x="4" y="6" width="1" height="3" fill="#706060"/>
      <rect x="6" y="6" width="1" height="3" fill="#706060"/>
    </svg>
  )
}

function PiedraPunto() {
  // Vacío → punto/piedra pixelado
  return (
    <svg viewBox="0 0 4 4" width={8} height={8} style={{ imageRendering: 'pixelated', display: 'inline-block' }}>
      <rect x="1" y="0" width="2" height="1" fill="#4a3860"/>
      <rect x="0" y="1" width="4" height="2" fill="#4a3860"/>
      <rect x="1" y="3" width="2" height="1" fill="#4a3860"/>
    </svg>
  )
}

const MARCA_SPRITE = {
  avance: <Estrella />,
  pausa:  <Reloj />,
  nada:   <Calavera />,
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
           style={{ borderBottom: '2px solid #4a3860' }}>
        <button
          onClick={() => setOffsetSemana(o => o + 1)}
          className="w-9 h-9 flex items-center justify-center font-pixel text-[10px] active:translate-y-[1px]"
          style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', color: '#a89b8c', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
          ←
        </button>
        <div className="text-center">
          <p className="font-pixel text-[8px] text-text-muted">
            {formatearFechaCorta(fechas[0])} – {formatearFechaCorta(fechas[6])}
          </p>
          {offsetSemana === 0 && (
            <p className="font-pixel text-[7px] text-accent mt-0.5">ESTA SEMANA</p>
          )}
        </div>
        <button
          onClick={() => setOffsetSemana(o => Math.max(0, o - 1))}
          disabled={offsetSemana === 0}
          className="w-9 h-9 flex items-center justify-center font-pixel text-[10px] active:translate-y-[1px] disabled:opacity-30"
          style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', color: '#a89b8c', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
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
                <th key={f} className="pb-2 font-pixel font-normal"
                    style={{ fontSize: 7, color: esHoy(f) ? '#e94560' : '#6b5e52' }}>
                  {diaSemanaCorto(f).toUpperCase().slice(0, 1)}
                </th>
              ))}
              <th className="pb-2 font-pixel text-[7px] text-xp-bar font-normal">⭐</th>
            </tr>
          </thead>

          <tbody>
            {caminos.map(camino => {
              const score = scoreSemanalCamino(registros, camino.id)
              const nadaCount = registros.filter(r => r.caminoId === camino.id && r.marca === 'nada').length
              const descuidado = nadaCount >= 3
              return (
                <tr key={camino.id}
                    style={{ borderTop: '1px solid #4a3860', background: descuidado ? 'rgba(232,48,48,0.05)' : 'transparent' }}>
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
                          {r?.marca
                            ? MARCA_SPRITE[r.marca] ?? <span style={{ fontSize: 10 }}>?</span>
                            : <PiedraPunto />
                          }
                        </div>
                      </td>
                    )
                  })}
                  <td className="py-1 font-pixel text-[9px] text-xp-bar">{score}</td>
                </tr>
              )
            })}
          </tbody>

          <tfoot>
            <tr style={{ borderTop: '2px solid #4a3860' }}>
              <td className="pt-2 pl-2 font-pixel text-[7px] text-text-muted text-left">SCORE</td>
              {scoresPorDia.map(s => (
                <td key={s.fecha} className="pt-2 font-pixel text-[9px] text-green-xp">{s.avances}</td>
              ))}
              <td/>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Leyenda */}
      <div className="px-4 py-2 flex items-center gap-4" style={{ borderTop: '1px solid #4a3860' }}>
        <div className="flex items-center gap-1"><Estrella /><span className="font-pixel text-[6px] text-text-muted ml-1">AVANCE</span></div>
        <div className="flex items-center gap-1"><Reloj /><span className="font-pixel text-[6px] text-text-muted ml-1">PAUSA</span></div>
        <div className="flex items-center gap-1"><Calavera /><span className="font-pixel text-[6px] text-text-muted ml-1">NADA</span></div>
        {caminos.some(c => registros.filter(r => r.caminoId === c.id && r.marca === 'nada').length >= 3) && (
          <span className="font-pixel text-[6px] text-red-alert ml-auto">■ 3+ NADA</span>
        )}
      </div>
    </div>
  )
}
