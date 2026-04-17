// src/components/codex/EntidadCard.jsx

/**
 * Props:
 *   entidad        — objeto de entidades.js
 *   encuentros     — array de encuentros con esa entidad (puede ser [])
 *   desbloqueada   — boolean (false = silueta con ???)
 *   onClick        — fn()
 */
export default function EntidadCard({ entidad, encuentros, desbloqueada, onClick }) {
  const victorias = encuentros.filter(e => e.correcto).length
  const intentos  = encuentros.length

  if (!desbloqueada) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 p-3 w-full text-left"
        style={{
          background: '#0c0a18',
          border: '2px solid #1e1830',
          borderRadius: 2,
          opacity: 0.6,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 2,
          background: `${entidad.color}08`,
          border: `2px solid ${entidad.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: 'blur(1px) brightness(0.3)',
          fontSize: 24,
        }}>
          {entidad.icono}
        </div>
        <div>
          <p className="font-pixel text-[9px]" style={{ color: '#2a2838' }}>??? ??? ???</p>
          <p className="font-pixel text-[7px] mt-1" style={{ color: '#1e1830' }}>BLOQUEADO</p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 w-full text-left transition-all active:translate-y-[1px]"
      style={{
        background: `${entidad.color}08`,
        border: `2px solid ${entidad.color}40`,
        borderLeft: `3px solid ${entidad.color}`,
        borderRadius: 2,
        boxShadow: `0 0 12px ${entidad.color}10`,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 2,
        background: `${entidad.color}15`,
        border: `2px solid ${entidad.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>
        {entidad.icono}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-[10px]" style={{ color: entidad.color }}>{entidad.nombre}</p>
        <p className="font-pixel text-[7px] mt-1" style={{ color: '#6a5880' }}>
          {intentos} encuentro{intentos !== 1 ? 's' : ''} · {victorias} ✓
        </p>
      </div>
      <span className="font-pixel text-[10px]" style={{ color: `${entidad.color}80` }}>›</span>
    </button>
  )
}
