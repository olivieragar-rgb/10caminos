export default function PlanBanner({ texto }) {
  if (!texto) return null
  return (
    <div className="mx-4 mb-3 px-3 py-2"
         style={{ background: 'rgba(233,69,96,0.08)', borderLeft: '3px solid #e94560', borderRadius: '0 2px 2px 0', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}>
      <div className="flex items-start gap-2">
        <span className="text-sm leading-none mt-0.5">📋</span>
        <p className="font-body text-sm text-text-secondary leading-snug">{texto}</p>
      </div>
    </div>
  )
}
