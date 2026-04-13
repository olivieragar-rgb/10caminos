import { TABS } from '../../constants'

export default function Navigation({ tabActivo, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex items-stretch"
         style={{ background: '#1a1520', borderTop: '2px solid #4a3860', boxShadow: '0 -2px 0 #0a0a0f' }}>
      {TABS.map(tab => {
        const activo = tab.id === tabActivo
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]
                       select-none transition-colors duration-100 relative"
            style={activo ? { borderBottom: '2px solid #ffd700' } : { borderBottom: '2px solid transparent' }}
          >
            <span className={`text-lg leading-none transition-transform duration-150 ${activo ? 'animate-pixel-bounce' : ''}`}>{tab.emoji}</span>
            <span
              className="font-pixel leading-none"
              style={{
                fontSize: '6px',
                color: activo ? '#ffd700' : '#6b5e52',
                letterSpacing: '0.02em',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
