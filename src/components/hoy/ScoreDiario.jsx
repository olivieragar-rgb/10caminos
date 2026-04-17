export default function ScoreDiario({ avances, total, pct }) {
  const mensaje = avances === 0
    ? "Hoy descansaste. Mañana vuelves."
    : avances < 3
    ? "Recuerda: un paso basta."
    : avances < 5
    ? "Día tranquilo, mañana avanzas."
    : "Buen equilibrio ✨"

  const barColor = pct >= 62 ? '#50c878' : pct >= 37 ? '#f0c040' : '#706060'

  return (
    <div className="mx-4 mt-2 mb-3 p-3"
         style={{ background: '#181726', border: '1px solid #302e4e', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-[13px] text-text-muted italic">{mensaje}</span>
        <span className="font-pixel text-[12px]" style={{ color: barColor }}>
          {avances}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden"
           style={{ background: '#302e4e', borderRadius: '100px' }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor,
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  )
}
