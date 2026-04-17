import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import AvatarPersonaje from './AvatarPersonaje'
import { guardarPersonaje } from '../../hooks/usePersonaje'
import {
  PIEL_COLORES, PELO_COLORES, OJOS_COLORES,
  PELO_ESTILOS, VELLO_OPCIONES, PERSONALIDADES, PERSONAJE_DEFAULT
} from '../../personaje'

function SectionLabel({ children }) {
  return (
    <p className="font-pixel text-xs text-text-muted tracking-wider mb-2 mt-4">
      {children}
    </p>
  )
}

function ColorDots({ opciones, seleccionado, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((color, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="transition-transform active:scale-90"
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: color,
            border: seleccionado === i ? '2px solid #ede9e1' : '2px solid transparent',
            boxShadow: seleccionado === i ? `0 0 8px ${color}80` : 'none',
          }}
        />
      ))}
    </div>
  )
}

function PillOptions({ opciones, seleccionado, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((op, i) => {
        const label = typeof op === 'object' ? `${op.emoji} ${op.label}` : op
        const activo = seleccionado === i
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="px-3 py-1.5 font-body text-sm font-semibold transition-colors"
            style={{
              borderRadius: '100px',
              background: activo ? '#e94560' : '#2d2b47',
              border: `1px solid ${activo ? '#e94560' : '#4a4770'}`,
              color: activo ? '#fff' : '#9590a8',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function PersonajeEditor({ config, nivel = 0, onClose }) {
  const [draft, setDraft] = useState({ ...PERSONAJE_DEFAULT, ...config })
  const [guardando, setGuardando] = useState(false)

  const set = (campo, valor) => setDraft(prev => ({ ...prev, [campo]: valor }))

  const handleGuardar = async () => {
    setGuardando(true)
    await guardarPersonaje(draft)
    setGuardando(false)
    onClose()
  }

  const personalidadKeys = Object.keys(PERSONALIDADES)
  const personalidadIdx = personalidadKeys.indexOf(draft.personalidad)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div
        className="w-full max-w-[480px] mx-auto flex flex-col"
        style={{
          background: '#0e0e1a',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #302e4e',
          borderBottom: 'none',
          maxHeight: '92vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4"
             style={{ borderBottom: '1px solid #302e4e' }}>
          <h2 className="font-pixel text-base text-text-primary">MI PERSONAJE</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: '#2d2b47', color: '#9590a8' }}
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-4">
          {/* Preview del avatar */}
          <div className="flex justify-center py-6">
            <AvatarPersonaje config={draft} nivel={nivel} size={96} />
          </div>

          {/* Nombre */}
          <SectionLabel>NOMBRE</SectionLabel>
          <input
            value={draft.nombre}
            onChange={e => set('nombre', e.target.value.slice(0, 20))}
            placeholder="¿Cómo te llamas?"
            className="w-full px-3 py-2.5 font-body text-sm text-text-primary
                       placeholder-text-muted outline-none"
            style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
          />

          {/* Bio */}
          <SectionLabel>BIO</SectionLabel>
          <textarea
            value={draft.bio}
            onChange={e => set('bio', e.target.value.slice(0, 120))}
            placeholder="Cuéntame algo de ti... (120 chars)"
            rows={3}
            className="w-full px-3 py-2.5 font-body text-sm text-text-primary
                       placeholder-text-muted outline-none resize-none"
            style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
          />
          <p className="text-right font-body text-xs text-text-muted mt-1">
            {draft.bio.length}/120
          </p>

          {/* Personalidad */}
          <SectionLabel>PERSONALIDAD</SectionLabel>
          <PillOptions
            opciones={Object.values(PERSONALIDADES)}
            seleccionado={personalidadIdx >= 0 ? personalidadIdx : 3}
            onChange={i => set('personalidad', personalidadKeys[i])}
          />

          {/* Piel */}
          <SectionLabel>TONO DE PIEL</SectionLabel>
          <ColorDots opciones={PIEL_COLORES} seleccionado={draft.piel} onChange={v => set('piel', v)} />

          {/* Color pelo */}
          <SectionLabel>COLOR DE PELO</SectionLabel>
          <ColorDots opciones={PELO_COLORES} seleccionado={draft.peloCColor} onChange={v => set('peloCColor', v)} />

          {/* Estilo pelo */}
          <SectionLabel>ESTILO DE PELO</SectionLabel>
          <PillOptions opciones={PELO_ESTILOS} seleccionado={draft.peloEstilo} onChange={v => set('peloEstilo', v)} />

          {/* Ojos */}
          <SectionLabel>COLOR DE OJOS</SectionLabel>
          <ColorDots opciones={OJOS_COLORES} seleccionado={draft.ojos} onChange={v => set('ojos', v)} />

          {/* Vello */}
          <SectionLabel>VELLO FACIAL</SectionLabel>
          <PillOptions opciones={VELLO_OPCIONES} seleccionado={draft.vellos} onChange={v => set('vellos', v)} />

          {/* Botón guardar */}
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="w-full py-3.5 font-body font-semibold text-base text-white mt-6 mb-2
                       active:scale-[0.98] transition-transform disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #e94560, #c03040)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(233,69,96,0.35)',
            }}
          >
            {guardando ? 'Guardando...' : 'GUARDAR PERSONAJE'}
          </button>
        </div>
      </div>
    </div>
  )
}
