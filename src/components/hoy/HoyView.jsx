import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosHoy } from '../../hooks/useRegistros'
import { scoreDiario } from '../../utils/stats'
import { nivelGlobal, xpANivel, nombreNivel } from '../../utils/xp'
import { hoyISO, haceNDiasISO, formatearFechaLarga } from '../../utils/dates'
import { v4 as uuidv4 } from 'uuid'
import CaminoCard from './CaminoCard'
import PlanBanner from './PlanBanner'
import ScoreDiario from './ScoreDiario'
import XpBar from './XpBar'
import FraseIkigai from './FraseIkigai'

export default function HoyView() {
  const hoy = hoyISO()
  const caminos = useCaminosActivos()
  const registrosHoy = useRegistrosHoy()
  const planHoy = useLiveQuery(() => db.planificacion.where('fecha').equals(hoy).first(), [hoy])
  const rutasActivas = useLiveQuery(() => db.rutas.where('estado').equals('activa').toArray(), [], [])
  const todosCaminos = useLiveQuery(() => db.caminos.toArray(), [], [])

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planTexto, setPlanTexto] = useState('')
  const [gratitudTexto, setGratitudTexto] = useState('')
  const [guardandoPlan, setGuardandoPlan] = useState(false)

  const score = scoreDiario(registrosHoy, caminos)
  const nivelG = nivelGlobal(todosCaminos)
  const xpGlobal = todosCaminos.filter(c => c.activo).reduce((s, c) => s + (c.xp || 0), 0)

  const getRutaActiva = (caminoId) =>
    (rutasActivas || []).find(r => r.caminoId === caminoId) || null

  const getRegistroHoy = (caminoId) =>
    registrosHoy.find(r => r.caminoId === caminoId) || null

  const abrirModal = () => {
    setPlanTexto('')
    setGratitudTexto('')
    setShowPlanModal(true)
  }

  const guardarPlan = async () => {
    setGuardandoPlan(true)
    const manana = haceNDiasISO(-1)

    // Guardar planificación de mañana
    if (planTexto.trim()) {
      const existing = await db.planificacion.where('fecha').equals(manana).first()
      if (existing) {
        await db.planificacion.update(existing.id, { texto: planTexto.trim() })
      } else {
        await db.planificacion.add({ id: uuidv4(), fecha: manana, texto: planTexto.trim(), creadoAt: new Date() })
      }
    }

    // Guardar reflexión de gratitud de hoy
    if (gratitudTexto.trim()) {
      await db.reflexiones.add({
        id: uuidv4(),
        fecha: hoy,
        tipo: 'gratitud',
        texto: gratitudTexto.trim(),
        creadoAt: new Date(),
      })
    }

    setPlanTexto('')
    setGratitudTexto('')
    setShowPlanModal(false)
    setGuardandoPlan(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-bg-deep">
        <p className="text-xs text-text-muted capitalize mb-1.5">{formatearFechaLarga(hoy)}</p>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-mono text-xl font-bold text-xp-bar text-glow-xp">
              {nombreNivel(nivelG)}
            </span>
            <span className="ml-2 text-sm text-text-muted font-mono">Nv.{nivelG}</span>
          </div>
        </div>
        <XpBar xp={xpGlobal} />
      </div>

      {/* Frase Ikigai del día */}
      <div className="mt-3">
        <FraseIkigai />
      </div>

      {/* Plan banner */}
      <PlanBanner texto={planHoy?.texto} />

      {/* Camino cards */}
      <div className="flex-1 pt-1">
        {caminos.map(camino => (
          <CaminoCard
            key={camino.id}
            camino={camino}
            registroHoy={getRegistroHoy(camino.id)}
            rutaActiva={getRutaActiva(camino.id)}
          />
        ))}
      </div>

      {/* Score diario */}
      <ScoreDiario avances={score.avances} total={score.total} pct={score.pct} />

      {/* FAB planificar mañana */}
      <button
        onClick={abrirModal}
        className="fixed bottom-20 right-4 bg-accent text-white rounded-full px-4 py-2.5
                   text-sm font-medium shadow-lg active:scale-95 transition-transform z-40
                   glow-accent"
      >
        📋 Mañana
      </button>

      {/* Modal planificación */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4"
             onClick={e => e.target === e.currentTarget && setShowPlanModal(false)}>
          <div className="w-full max-w-[480px] bg-bg-card border border-border-dark rounded-2xl p-4 mb-16 animate-fade-in-up">
            <h3 className="text-base font-semibold text-text-primary mb-4">Planificar mañana</h3>

            {/* Sección 1: Intención */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                ✦ Intención para mañana
              </label>
              <textarea
                autoFocus
                value={planTexto}
                onChange={e => setPlanTexto(e.target.value)}
                placeholder="¿Qué quieres lograr mañana?"
                rows={3}
                className="w-full bg-bg-surface border border-border-dark rounded-xl px-3 py-2
                           text-sm text-text-primary placeholder-text-muted outline-none
                           focus:border-accent/50 resize-none"
              />
            </div>

            {/* Sección 2: Gratitud */}
            <div className="mb-4">
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
                🙏 Gratitud de hoy
              </label>
              <textarea
                value={gratitudTexto}
                onChange={e => setGratitudTexto(e.target.value)}
                placeholder="¿Por qué estás agradecido hoy?"
                rows={2}
                className="w-full bg-bg-surface border border-border-dark rounded-xl px-3 py-2
                           text-sm text-text-primary placeholder-text-muted outline-none
                           focus:border-xp-bar/50 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border-dark text-text-muted text-sm">
                Cancelar
              </button>
              <button onClick={guardarPlan} disabled={guardandoPlan}
                className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium
                           disabled:opacity-50">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
