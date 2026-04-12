export default function PlanBanner({ texto }) {
  if (!texto) return null
  return (
    <div className="mx-4 mb-3 px-3 py-2 bg-bg-surface border-l-2 border-accent rounded-r-lg">
      <div className="flex items-start gap-2">
        <span className="text-sm leading-none mt-0.5">📋</span>
        <p className="text-sm text-text-secondary leading-snug">{texto}</p>
      </div>
    </div>
  )
}
