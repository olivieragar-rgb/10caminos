// src/components/codex/EntidadDetalle.jsx

export default function EntidadDetalle({ entidad, encuentros, onBack }) {
  const ordenados = [...encuentros].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #1e1830' }}>
        <button
          onClick={onBack}
          className="font-pixel text-[8px] text-text-muted mb-3 flex items-center gap-1"
        >
          ‹ VOLVER AL CODEX
        </button>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 36 }}>{entidad.icono}</span>
          <div>
            <p className="font-pixel text-[13px]" style={{ color: entidad.color }}>{entidad.nombre}</p>
            <p className="font-pixel text-[7px] mt-1 text-text-muted">
              {encuentros.length} encuentro{encuentros.length !== 1 ? 's' : ''} · {encuentros.filter(e => e.correcto).length} resueltos
            </p>
          </div>
        </div>
      </div>

      {/* Fragmentos de lore */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-3">
        {ordenados.length === 0 && (
          <p className="font-pixel text-[8px] text-text-muted text-center mt-8">
            Aún no hay encuentros registrados.
          </p>
        )}
        {ordenados.map(enc => (
          <div
            key={enc.id}
            style={{
              background: '#0c0a18',
              border: `2px solid ${enc.correcto ? entidad.color + '40' : '#2a1828'}`,
              borderLeft: `3px solid ${enc.correcto ? entidad.color : '#4a2038'}`,
              borderRadius: 2,
              padding: '10px 12px',
            }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-pixel text-[7px]" style={{ color: '#4a4654' }}>{enc.fecha}</span>
              <span className="font-pixel text-[7px]" style={{ color: enc.correcto ? '#00e676' : '#e94560' }}>
                {enc.correcto ? '✓ RESUELTO' : '✗ FALLIDO'}
              </span>
            </div>
            <p className="font-body text-[12px] leading-snug" style={{ color: '#c8c0b8', fontStyle: 'italic' }}>
              "{enc.loreFragment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
