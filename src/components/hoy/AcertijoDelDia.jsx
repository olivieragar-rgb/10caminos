import { useState } from 'react'
import { ACERTIJOS } from '../../constants'
import { hoyISO } from '../../utils/dates'

function diaDelAno(fechaISO) {
  const d = new Date(fechaISO)
  const inicio = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - inicio) / (1000 * 60 * 60 * 24))
}

// Aparece solo ciertos días (cada ~3 días)
export function debeAparecerHoy() {
  return diaDelAno(hoyISO()) % 3 === 0
}

export default function AcertijoDelDia() {
  const idx = diaDelAno(hoyISO()) % ACERTIJOS.length
  const acertijo = ACERTIJOS[idx]
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false)
  const [cerrado, setCerrado] = useState(false)

  if (cerrado) return null

  return (
    <div
      className="mx-4 mb-3 p-3 animate-card-entrance"
      style={{
        background: 'linear-gradient(180deg, #2a2035 0%, #1e1530 100%)',
        border: '2px solid #4488cc',
        borderRadius: '2px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[7px] text-blue-mana">🧩 ACERTIJO DEL DÍA</span>
        <button
          onClick={() => setCerrado(true)}
          className="font-pixel text-[8px] text-text-muted px-1"
        >✕</button>
      </div>

      {/* Pregunta */}
      <p className="font-body text-[12px] text-text-primary leading-relaxed mb-3">
        {acertijo.pregunta}
      </p>

      {/* Respuesta */}
      {mostrarRespuesta ? (
        <div className="animate-respuesta pt-2" style={{ borderTop: '1px solid #4488cc40' }}>
          <p className="font-pixel text-[7px] text-text-muted mb-1">RESPUESTA:</p>
          <p className="font-body text-[13px] font-bold" style={{ color: '#50c878' }}>
            {acertijo.respuesta}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setMostrarRespuesta(true)}
          className="w-full py-2 font-pixel text-[8px] text-blue-mana active:translate-y-[1px]"
          style={{
            background: 'rgba(68,136,204,0.1)',
            border: '2px solid #4488cc60',
            borderRadius: '2px',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
          }}
        >
          VER RESPUESTA
        </button>
      )}
    </div>
  )
}
