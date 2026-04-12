import { useState } from 'react'
import { agregarNotaRuta } from '../../hooks/useRutas'

export default function NotasRuta({ rutaId, notas = [] }) {
  const [texto, setTexto] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleAgregar = async () => {
    if (!texto.trim()) return
    setGuardando(true)
    await agregarNotaRuta(rutaId, texto.trim())
    setTexto('')
    setGuardando(false)
  }

  return (
    <div className="mt-3">
      <p className="text-xs text-text-muted mb-2">Notas ({notas.length})</p>
      {notas.length > 0 && (
        <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
          {notas.slice().reverse().map((nota, i) => (
            <div key={i} className="bg-bg-surface rounded-lg px-3 py-1.5">
              <p className="text-xs text-text-secondary leading-snug">{nota.texto}</p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {new Date(nota.fecha).toLocaleDateString('es-ES', { day:'numeric', month:'short' })}
                {nota.viaVoz && ' 🎤'}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAgregar()}
          placeholder="Añadir nota..."
          className="flex-1 bg-bg-surface border border-border-dark rounded-lg px-3 py-1.5
                     text-xs text-text-primary placeholder-text-muted outline-none
                     focus:border-accent/50 min-h-[36px]"
        />
        <button onClick={handleAgregar} disabled={guardando || !texto.trim()}
          className="px-3 py-1.5 bg-accent/20 border border-accent/40 rounded-lg
                     text-xs text-accent disabled:opacity-40 min-h-[36px]">
          +
        </button>
      </div>
    </div>
  )
}
