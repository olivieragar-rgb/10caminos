import { xpANivel, entradaNivel } from '../../utils/xp'

export default function LevelBadge({ xp, nivel, className = '' }) {
  const n = nivel ?? xpANivel(xp ?? 0)
  const entry = entradaNivel(n)
  return (
    <span className={`font-pixel text-[8px] text-accent flex items-center gap-1 ${className}`}>
      <span>{entry.emoji}</span>
      <span>Nv.{n}</span>
    </span>
  )
}
