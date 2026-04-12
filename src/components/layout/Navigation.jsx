import { TABS } from '../../constants'

export default function Navigation({ tabActivo, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50
                    bg-bg-card border-t border-border-dark flex items-stretch">
      {TABS.map(tab => {
        const activo = tab.id === tabActivo
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px]
                        transition-colors duration-150 select-none
                        ${activo
                          ? 'text-accent'
                          : 'text-text-muted active:text-text-secondary'
                        }`}
          >
            <span className={`text-xl leading-none ${activo ? 'drop-shadow-[0_0_6px_#e9456080]' : ''}`}>
              {tab.emoji}
            </span>
            <span className={`text-[10px] font-body font-medium leading-none mt-0.5
                              ${activo ? 'text-accent' : 'text-text-muted'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
