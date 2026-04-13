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
         style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-[11px] text-text-muted italic">{mensaje}</span>
        <span className="font-pixel text-[10px]" style={{ color: barColor }}>
          {avances}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden"
           style={{ background: '#1a1520', border: '2px solid #4a3860', borderRadius: '1px' }}>
        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 6px ${barColor}60`,
          }}
        />
      </div>
    </div>
  )
}
