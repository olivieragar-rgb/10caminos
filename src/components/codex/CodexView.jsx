// src/components/codex/CodexView.jsx
import { useState } from 'react'
import { useHistorialEncuentros } from '../../hooks/useEncuentros'
import { ENTIDADES, getEntidad } from '../../entidades'
import EntidadCard from './EntidadCard'
import EntidadDetalle from './EntidadDetalle'

export default function CodexView() {
  const historial = useHistorialEncuentros()
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null)

  const entidadesConEncuentros = new Set(historial.map(e => e.entidadId))

  if (entidadSeleccionada) {
    const entidad   = getEntidad(entidadSeleccionada)
    const encuentros = historial.filter(e => e.entidadId === entidadSeleccionada)
    return (
      <EntidadDetalle
        entidad={entidad}
        encuentros={encuentros}
        onBack={() => setEntidadSeleccionada(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #1e1830' }}>
        <p className="font-pixel text-[7px] text-text-muted mb-1">ARCHIVO OCULTO</p>
        <h1 className="font-pixel text-[14px]" style={{ color: '#d4a843' }}>CODEX DE LA PSIQUE</h1>
        <p className="font-body text-[12px] text-text-muted mt-1">
          {entidadesConEncuentros.size} de {ENTIDADES.length} entidades descubiertas
        </p>
      </div>

      {/* Lista de entidades */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-2">
        {/* Conocidas primero */}
        <p className="font-pixel text-[7px] text-text-muted mb-1">ENTIDADES CONOCIDAS</p>
        {ENTIDADES.filter(e => !e.secreto).map(entidad => {
          const encuentros = historial.filter(e => e.entidadId === entidad.id)
          return (
            <EntidadCard
              key={entidad.id}
              entidad={entidad}
              encuentros={encuentros}
              desbloqueada={entidadesConEncuentros.has(entidad.id)}
              onClick={() => entidadesConEncuentros.has(entidad.id) && setEntidadSeleccionada(entidad.id)}
            />
          )
        })}

        {/* Secretas */}
        <p className="font-pixel text-[7px] text-text-muted mb-1 mt-3">ENTIDADES OCULTAS</p>
        {ENTIDADES.filter(e => e.secreto).map(entidad => {
          const encuentros = historial.filter(e => e.entidadId === entidad.id)
          const desbloqueada = entidadesConEncuentros.has(entidad.id)
          return (
            <EntidadCard
              key={entidad.id}
              entidad={entidad}
              encuentros={encuentros}
              desbloqueada={desbloqueada}
              onClick={() => desbloqueada && setEntidadSeleccionada(entidad.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
