import { xpEnNivelActual, porcentajeNivel } from '../../utils/xp'

export default function XpBar({ xp, className = '' }) {
  const enNivel = xpEnNivelActual(xp)
  const pct = porcentajeNivel(xp)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full glow-xp transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #ffd700, #ffab00)',
          }}
        />
      </div>
      <span className="font-mono text-[10px] text-text-muted whitespace-nowrap">
        {enNivel}<span className="text-text-muted">/100</span>
      </span>
    </div>
  )
}
