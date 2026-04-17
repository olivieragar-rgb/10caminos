export default function CaminoCompacto({ camino, registroHoy }) {
  const marca = registroHoy?.marca
  const dotColor = marca === 'avance' ? '#4ade80'
    : marca === 'pausa' ? '#fbbf24'
    : marca === 'nada' ? '#6b7280'
    : '#302e4e'
  const marcaSym = marca === 'avance' ? '✓' : marca === 'pausa' ? '→' : marca === 'nada' ? '○' : null

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: '1px solid #1e1c30' }}
    >
      <div style={{
        width: 9, height: 9, borderRadius: '50%',
        background: dotColor, flexShrink: 0,
        boxShadow: marca ? `0 0 6px ${dotColor}60` : 'none',
      }} />
      <span className="text-base leading-none flex-shrink-0">{camino.icono}</span>
      <span className="font-body text-sm text-text-primary flex-1 truncate">
        {camino.nombre}
      </span>
      {marcaSym && (
        <span className="font-body text-sm font-bold" style={{ color: dotColor }}>
          {marcaSym}
        </span>
      )}
    </div>
  )
}
