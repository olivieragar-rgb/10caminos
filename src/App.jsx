import { useState, useEffect, useRef } from 'react'
import { seedIfEmpty } from './db'
import Navigation    from './components/layout/Navigation'
import HoyView       from './components/hoy/HoyView'
import SemanaView    from './components/semana/SemanaView'
import RutasView     from './components/rutas/RutasView'
import ProgresoView  from './components/progreso/ProgresoView'
import ChatView      from './components/chat/ChatView'
import IntroScene    from './components/intro/IntroScene'

const VISTAS = {
  hoy:      HoyView,
  semana:   SemanaView,
  rutas:    RutasView,
  progreso: ProgresoView,
  chat:     ChatView,
}

export default function App() {
  const [tabActivo, setTabActivo]   = useState('hoy')
  const [dbLista, setDbLista]       = useState(false)
  const [introDone, setIntroDone]   = useState(false)
  const [curtain, setCurtain]       = useState(null) // null | 'out' | 'in'
  const pendingTab = useRef(null)

  useEffect(() => {
    seedIfEmpty()
      .then(() => setDbLista(true))
      .catch(err => { console.error('Error inicializando DB:', err); setDbLista(true) })
  }, [])

  const handleTabChange = (newTab) => {
    if (newTab === tabActivo || curtain) return
    pendingTab.current = newTab
    setCurtain('out')
    setTimeout(() => {
      setTabActivo(pendingTab.current)
      setCurtain('in')
      setTimeout(() => setCurtain(null), 200)
    }, 200)
  }

  if (dbLista && !introDone) {
    return <IntroScene onComplete={() => setIntroDone(true)} />
  }

  if (!dbLista) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-deep min-h-dvh">
        <span className="font-pixel text-[10px] text-text-muted">INICIANDO...</span>
      </div>
    )
  }

  const Vista = VISTAS[tabActivo]

  return (
    <div className="flex flex-col flex-1 bg-bg-deep min-h-dvh">
      <main
        className={`flex-1 flex flex-col pb-14 overflow-y-auto
          ${curtain === 'out' ? 'animate-curtain-out' : ''}
          ${curtain === 'in'  ? 'animate-curtain-in'  : ''}`}
      >
        <Vista />
      </main>
      <Navigation tabActivo={tabActivo} onTabChange={handleTabChange} />
    </div>
  )
}
