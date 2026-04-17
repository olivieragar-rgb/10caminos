import { useCaminos } from '../../hooks/useCaminos'
import { useCodexDesbloqueado } from '../../hooks/useEncuentros'
import { useRegistros30Dias } from '../../hooks/useRegistros'
import { scoresPorDia, xpGanadoEnPeriodo } from '../../utils/stats'
import { xpANivel, nivelGlobal, nombreNivel } from '../../utils/xp'
import { haceNDiasISO } from '../../utils/dates'
import Heatmap from './Heatmap'
import RecompensasList from './RecompensasList'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts'

const CHART_STYLE = {
  background: 'transparent',
  border: 'none',
}

export default function ProgresoView({ onAbrirCodex }) {
  const caminos = useCaminos()
  const registros30 = useRegistros30Dias()
  const activos = caminos.filter(c => c.activo)
  const codexDesbloqueado = useCodexDesbloqueado()

  // Score diario últimos 30 días
  const fechas30 = Array.from({ length: 30 }, (_, i) => haceNDiasISO(29 - i))
  const datosScore = scoresPorDia(registros30, fechas30, activos.length).map(d => ({
    ...d,
    pct: d.total ? Math.round((d.avances / d.total) * 100) : 0,
    label: d.fecha.slice(5), // MM-DD
  }))

  // XP por camino en últimas 4 semanas
  const hace28 = haceNDiasISO(28)
  const hoy = haceNDiasISO(0)
  const datosXp = activos.map(c => ({
    nombre: c.nombre.split(' ')[0],
    icono: c.icono,
    xp: xpGanadoEnPeriodo(registros30, c.id, hace28, hoy),
  })).sort((a, b) => b.xp - a.xp)

  // Stats generales
  const nivelG = nivelGlobal(caminos)
  const mejorRacha = Math.max(0, ...activos.map(c => c.rachaMejor))
  const rachaActual = Math.max(0, ...activos.map(c => c.rachaActual))
  const camMasDescuidado = activos.reduce((worst, c) => {
    const nadas = registros30.filter(r => r.caminoId === c.id && r.marca === 'nada').length
    return nadas > (worst.nadas ?? 0) ? { camino: c, nadas } : worst
  }, {})

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-bg-card border border-border-dark rounded-[2px] px-2 py-1">
        <p className="text-xs text-text-primary">{payload[0]?.value}%</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full px-4 pt-4 pb-4 space-y-5">
      {codexDesbloqueado && (
        <button
          onClick={() => onAbrirCodex && onAbrirCodex()}
          className="mx-4 mt-4 mb-2 w-full py-3 font-pixel text-[9px] active:translate-y-[1px] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(180deg, #1a1228, #0c0a18)',
            border: '2px solid #d4a84370',
            borderRadius: 2,
            color: '#d4a843',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.6), 0 0 16px #d4a84320',
          }}
        >
          📜 CODEX DE LA PSIQUE
        </button>
      )}
      <h2 className="font-pixel text-[10px] text-xp-bar">PROGRESO</h2>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Nivel global', val: nivelG, sub: nombreNivel(nivelG) },
          { label: 'Racha actual', val: `${rachaActual}d`, sub: '🔥' },
          { label: 'Récord racha', val: `${mejorRacha}d`, sub: '🏆' },
        ].map(s => (
          <div key={s.label} className="bg-bg-surface border border-border-dark rounded-[2px] p-2.5 text-center">
            <p className="font-pixel text-sm text-xp-bar">{s.val}</p>
            <p className="font-pixel text-[7px] text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Línea: score 30 días */}
      <div className="bg-bg-surface border border-border-dark rounded-[2px] p-3">
        <p className="font-pixel text-[7px] text-text-muted mb-3">Score diario (30 días)</p>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={datosScore} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#4a4654' }} tickLine={false}
              interval={6} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#4a4654' }} tickLine={false}
              axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="pct" stroke="#e94560" strokeWidth={2}
              dot={false} activeDot={{ r: 3, fill: '#e94560' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Barras: XP por camino 4 semanas */}
      {datosXp.some(d => d.xp > 0) && (
        <div className="bg-bg-surface border border-border-dark rounded-[2px] p-3">
          <p className="font-pixel text-[7px] text-text-muted mb-3">XP últimas 4 semanas</p>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={datosXp} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="icono" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 8, fill: '#4a4654' }} tickLine={false} axisLine={false} />
              <Tooltip content={({ active, payload }) =>
                active && payload?.length
                  ? <div className="bg-bg-card border border-border-dark rounded-[2px] px-2 py-1">
                      <p className="text-xs text-xp-bar">{payload[0]?.payload?.nombre}</p>
                      <p className="text-xs text-text-primary">{payload[0]?.value} XP</p>
                    </div>
                  : null
              } />
              <Bar dataKey="xp" radius={[0, 0, 0, 0]}>
                {datosXp.map((_, i) => (
                  <Cell key={i} fill="#ffd700" fillOpacity={0.7 - i * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Heatmap */}
      <div className="bg-bg-surface border border-border-dark rounded-[2px] p-3">
        <Heatmap registros={registros30} totalCaminos={activos.length} />
      </div>

      {/* Camino más descuidado */}
      {camMasDescuidado.camino && camMasDescuidado.nadas > 0 && (
        <div className="bg-red-alert/5 border border-red-alert/20 rounded-[2px] p-3">
          <p className="font-pixel text-[7px] text-text-muted mb-1">CAMINO MÁS DESCUIDADO (30D)</p>
          <p className="font-body text-sm text-text-primary">
            {camMasDescuidado.camino.icono} {camMasDescuidado.camino.nombre}
          </p>
          <p className="font-pixel text-[8px] text-red-alert mt-1">{camMasDescuidado.nadas} DÍAS CON ○</p>
        </div>
      )}

      {/* Recompensas */}
      <RecompensasList caminos={caminos} />
    </div>
  )
}
