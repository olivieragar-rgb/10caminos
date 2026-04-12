export default function XpAnimation({ amount, animKey }) {
  if (!amount || amount <= 0) return null
  return (
    <span
      key={animKey}
      className="absolute -top-1 right-2 font-mono font-bold text-sm text-xp-bar pointer-events-none animate-xp-float z-10"
    >
      +{amount} XP
    </span>
  )
}
