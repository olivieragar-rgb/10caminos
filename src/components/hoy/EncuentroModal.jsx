// src/components/hoy/EncuentroModal.jsx
import { useState } from 'react'

const BOX_BG = '#0c0a18'
const BORDER_C = '#c8c0a8'

/**
 * Modal que presenta el desafío de una entidad.
 * Props:
 *   entidad   — objeto entidad de entidades.js
 *   desafio   — objeto desafio del array entidad.desafios
 *   desafioIdx — number
 *   onResult  — fn({ respuesta, correcto, loreFragment })
 */
export default function EncuentroModal({ entidad, desafio, desafioIdx, onResult }) {
  const [seleccionada, setSeleccionada] = useState(null)
  const [confirmada, setConfirmada]   = useState(false)

  const esCorrecta = (idx) => {
    if (desafio.respuestaCorrecta === null) return true // Joker: siempre correcto
    return String(idx) === String(desafio.respuestaCorrecta)
  }

  const handleConfirmar = () => {
    if (seleccionada === null) return
    setConfirmada(true)
    const correcto = esCorrecta(seleccionada)

    let lore = desafio.loreFragment
    if (desafio.loreFragmentOpciones) {
      lore = desafio.loreFragmentOpciones[seleccionada] ?? desafio.loreFragment
    }

    setTimeout(() => {
      onResult({ respuesta: String(seleccionada), correcto, loreFragment: lore })
    }, 1200)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Header entidad */}
      <div className="mb-4 flex items-center gap-2">
        <span style={{ fontSize: 28 }}>{entidad.icono}</span>
        <span className="font-pixel text-[10px]" style={{ color: entidad.color }}>
          {entidad.nombre.toUpperCase()}
        </span>
      </div>

      {/* Caja de desafío estilo Pokémon dialog */}
      <div style={{
        width: '100%', maxWidth: 420,
        border: `3px solid ${BORDER_C}`, background: BORDER_C, padding: 2, borderRadius: 2,
        marginBottom: 16,
      }}>
        <div style={{ background: BOX_BG, padding: '12px 14px', minHeight: 72 }}>
          <p className="font-body text-[13px] leading-relaxed" style={{ color: '#e8e0c8' }}>
            {desafio.enunciado}
          </p>
        </div>
      </div>

      {/* Opciones */}
      {desafio.tipo === 'opciones' && (
        <div className="w-full max-w-[420px] flex flex-col gap-2 mb-4">
          {desafio.opciones.map((op, idx) => {
            const esSel = seleccionada === idx
            const esCorr = confirmada && esCorrecta(idx)
            const esErr  = confirmada && esSel && !esCorrecta(idx)
            return (
              <button
                key={idx}
                disabled={confirmada}
                onClick={() => !confirmada && setSeleccionada(idx)}
                className="w-full text-left px-3 py-2.5 font-body text-[12px] transition-all active:translate-y-[1px]"
                style={{
                  background: esCorr ? '#0d2010' : esErr ? '#1a0505' : esSel ? `${entidad.color}18` : '#0c0a18',
                  border: `2px solid ${esCorr ? '#00e676' : esErr ? '#e94560' : esSel ? entidad.color : '#2a2838'}`,
                  borderRadius: 2,
                  color: esCorr ? '#00e676' : esErr ? '#e94560' : esSel ? entidad.color : '#a0989c',
                  boxShadow: esSel && !confirmada ? `0 0 8px ${entidad.color}30` : 'none',
                  cursor: confirmada ? 'default' : 'pointer',
                }}
              >
                {op}
                {esCorr && ' ✓'}
                {esErr  && ' ✗'}
              </button>
            )
          })}
        </div>
      )}

      {/* Botón confirmar */}
      {!confirmada && (
        <button
          onClick={handleConfirmar}
          disabled={seleccionada === null}
          className="w-full max-w-[420px] py-3 font-pixel text-[9px] disabled:opacity-30 active:translate-y-[1px]"
          style={{
            background: seleccionada !== null ? `${entidad.color}20` : '#1a1520',
            border: `2px solid ${seleccionada !== null ? entidad.color : '#2a2838'}`,
            borderRadius: 2,
            color: seleccionada !== null ? entidad.color : '#4a4654',
            boxShadow: seleccionada !== null ? `0 0 10px ${entidad.color}20` : 'none',
          }}
        >
          CONFIRMAR RESPUESTA
        </button>
      )}

      {confirmada && (
        <p className="font-pixel text-[8px] animate-pulse" style={{ color: entidad.color }}>
          {esCorrecta(seleccionada) ? '✓ CORRECTO' : '✗ INCORRECTO'}
        </p>
      )}
    </div>
  )
}
