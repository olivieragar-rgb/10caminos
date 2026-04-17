export default function PlanBanner({ texto }) {
  if (!texto) return null
  return (
    <div className="mx-4 mb-3 px-3 py-2"
         style={{ background: 'rgba(24,23,38,0.8)', borderLeft: '3px solid #e94560', border: '1px solid #302e4e', borderRadius: '8px' }}>
      <div className="flex items-start gap-2">
        <span className="text-sm leading-none mt-0.5">📋</span>
        <p className="font-body text-sm text-text-secondary leading-snug">{texto}</p>
      </div>
    </div>
  )
}
