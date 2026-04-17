import { CalendarDots, MapTrifold, ChartLineUp, ChatDots } from '@phosphor-icons/react'

const CARDS = [
  { id: 'semana',   Icon: CalendarDots, label: 'SEMANA',  color: '#60a5fa' },
  { id: 'rutas',    Icon: MapTrifold,   label: 'RUTAS',   color: '#4ade80' },
  { id: 'progreso', Icon: ChartLineUp,  label: 'STATS',   color: '#f0c040' },
  { id: 'chat',     Icon: ChatDots,     label: 'CHAT',    color: '#e94560' },
]

export default function NavCards({ onNavigate }) {
  return (
    <div className="px-4 py-3 grid grid-cols-2 gap-2.5">
      {CARDS.map(({ id, Icon, label, color }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="flex flex-col items-center justify-center gap-2 py-4 select-none
                     active:scale-[0.97] transition-transform duration-100"
          style={{
            background: 'linear-gradient(160deg, #181726 0%, #23213a 100%)',
            border: '1px solid #302e4e',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={26} weight="duotone" color={color} />
          </div>
          <span className="font-body font-semibold text-xs tracking-wide"
                style={{ color: '#9590a8' }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
