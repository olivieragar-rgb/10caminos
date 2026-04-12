import { useState, useEffect } from 'react'
import { seedIfEmpty } from './db'
import Navigation    from './components/layout/Navigation'
import HoyView       from './components/hoy/HoyView'
import SemanaView    from './components/semana/SemanaView'
import RutasView     from './components/rutas/RutasView'
import ProgresoView  from './components/progreso/ProgresoView'
import ChatView      from './components/chat/ChatView'

const VISTAS = {
  hoy:      HoyView,
  semana:   SemanaView,
  rutas:    RutasView,
  progreso: ProgresoView,
  chat:     ChatView,
}

export default function App() {
  const [tabActivo, setTabActivo] = useState('hoy')
  const [dbLista, setDbLista] = useState(false)

  useEffect(() => {
    seedIfEmpty()
      .then(() => setDbLista(true))
      .catch(err => {
        console.error('Error inicializando DB:', err)
        setDbLista(true)
      })
  }, [])

  if (!dbLista) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-deep min-h-dvh">
        <span className="text-text-muted font-mono text-sm">Iniciando...</span>
      </div>
    )
  }

  const Vista = VISTAS[tabActivo]

  return (
    <div className="flex flex-col flex-1 bg-bg-deep min-h-dvh">
      <main className="flex-1 flex flex-col pb-14 overflow-y-auto">
        <Vista />
      </main>
      <Navigation tabActivo={tabActivo} onTabChange={setTabActivo} />
    </div>
  )
}
