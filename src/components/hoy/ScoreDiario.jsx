export default function ScoreDiario({ avances, total, pct }) {
  // Tono Hara Hachi Bu — sin juicio, con calma
  const mensaje = avances === 0
    ? "Hoy descansaste. Mañana vuelves."
    : avances < 3
    ? "Recuerda: un paso basta."
    : avances < 5
    ? "Día tranquilo, mañana avanzas."
    : "Buen equilibrio ✨"

  const barColor = pct >= 62 ? '#00e676' : pct >= 37 ? '#ffab00' : '#8a8690'

  return (
    <div className="mx-4 mt-2 mb-3 p-3 bg-bg-surface rounded-xl border border-border-dark">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-text-muted italic">{mensaje}</span>
        <span className="font-mono text-xs font-semibold" style={{ color: barColor }}>
          {avances}/{total}
        </span>
      </div>
      <div className="h-1.5 bg-bg-card rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}50` }}
        />
      </div>
    </div>
  )
}
