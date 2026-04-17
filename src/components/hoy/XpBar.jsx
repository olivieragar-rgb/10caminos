import { xpEnNivelActual, porcentajeNivel } from '../../utils/xp'

export default function XpBar({ xp, className = '' }) {
  const enNivel = xpEnNivelActual(xp)
  const pct = porcentajeNivel(xp)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Barra exterior con borde dorado */}
      <div className="flex-1" style={{ border: '1px solid #b8960c', borderRadius: '100px', padding: '1px', background: '#302e4e' }}>
        <div
          className="h-2 transition-all duration-500 relative overflow-hidden xp-shimmer"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #f0c040, #ffec80)',
            borderRadius: '100px',
            minWidth: pct > 0 ? '4px' : '0',
          }}
        />
      </div>
      <span className="font-pixel text-[8px] text-text-muted whitespace-nowrap leading-none">
        {enNivel}<span className="text-text-muted opacity-60">/100</span>
      </span>
    </div>
  )
}
