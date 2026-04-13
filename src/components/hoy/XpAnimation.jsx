export default function XpAnimation({ amount, animKey }) {
  if (!amount || amount <= 0) return null
  return (
    <span
      key={animKey}
      className="absolute -top-1 right-2 font-pixel font-bold text-[10px] text-xp-bar
                 pointer-events-none animate-xp-float z-10 text-pixel-outline"
    >
      +{amount} XP
    </span>
  )
}
