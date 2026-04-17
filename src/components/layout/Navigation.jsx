import { House, CalendarDots, MapTrifold, ChartLineUp, ChatDots } from '@phosphor-icons/react'

const TABS_CONFIG = [
  { id: 'hoy',      Icon: House,        label: 'Inicio'  },
  { id: 'semana',   Icon: CalendarDots, label: 'Semana'  },
  { id: 'rutas',    Icon: MapTrifold,   label: 'Rutas'   },
  { id: 'progreso', Icon: ChartLineUp,  label: 'Stats'   },
  { id: 'chat',     Icon: ChatDots,     label: 'Chat'    },
]

export default function Navigation({ tabActivo, onTabChange }) {
  // En HOY, las NavCards hacen la navegación — no mostrar pill
  if (tabActivo === 'hoy') return null

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2"
      style={{
        background: 'rgba(35,33,58,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid #4a4770',
        borderRadius: '100px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {TABS_CONFIG.map(({ id, Icon, label }) => {
        const activo = id === tabActivo
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            aria-label={label}
            className="flex items-center justify-center transition-all duration-150 select-none"
            style={{
              width: 48,
              height: 40,
              borderRadius: '100px',
              background: activo ? 'rgba(233,69,96,0.15)' : 'transparent',
              color: activo ? '#e94560' : '#5c5875',
              filter: activo ? 'drop-shadow(0 0 6px #e9456060)' : 'none',
            }}
          >
            <Icon size={22} weight="duotone" />
          </button>
        )
      })}
    </nav>
  )
}
