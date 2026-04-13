import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosHoy } from '../../hooks/useRegistros'
import { scoreDiario } from '../../utils/stats'
import { nivelGlobal, nombreNivel } from '../../utils/xp'
import { hoyISO, haceNDiasISO, formatearFechaLarga } from '../../utils/dates'
import { v4 as uuidv4 } from 'uuid'
import CaminoCard from './CaminoCard'
import PlanBanner from './PlanBanner'
import ScoreDiario from './ScoreDiario'
import XpBar from './XpBar'
import FraseIkigai from './FraseIkigai'
import CaminosManager from './CaminosManager'
import PersonajeHeader from './PersonajeHeader'
import AcertijoDelDia, { debeAparecerHoy } from './AcertijoDelDia'
import EventoDelDia from './EventoDelDia'
import DashboardSemanal from './DashboardSemanal'

export default function HoyView() {
  // ── TODOS los hooks primero, sin excepciones ──────────────────────────────
  const hoy = hoyISO()
  const caminos      = useCaminosActivos()
  const registrosHoy = useRegistrosHoy()
  const planHoy      = useLiveQuery(() => db.planificacion.where('fecha').equals(hoy).first(), [hoy])
  const rutasActivas = useLiveQuery(() => db.rutas.where('estado').equals('activa').toArray(), [], [])
  const todosCaminos = useLiveQuery(() => db.caminos.toArray(), [], [])

  const [showManager,    setShowManager]    = useState(false)
  const [showPlanModal,  setShowPlanModal]  = useState(false)
  const [planTexto,      setPlanTexto]      = useState('')
  const [gratitudTexto,  setGratitudTexto]  = useState('')
  const [guardandoPlan,  setGuardandoPlan]  = useState(false)
  // ─────────────────────────────────────────────────────────────────────────

  if (showManager) {
    return <CaminosManager onClose={() => setShowManager(false)} />
  }

  const score   = scoreDiario(registrosHoy, caminos)
  const nivelG  = nivelGlobal(todosCaminos)
  const xpGlobal = todosCaminos.filter(c => c.activo).reduce((s, c) => s + (c.xp || 0), 0)

  const getRutaActiva  = (caminoId) => (rutasActivas || []).find(r => r.caminoId === caminoId) || null
  const getRegistroHoy = (caminoId) => registrosHoy.find(r => r.caminoId === caminoId) || null

  const abrirModal = () => {
    setPlanTexto('')
    setGratitudTexto('')
    setShowPlanModal(true)
  }

  const guardarPlan = async () => {
    setGuardandoPlan(true)
    const manana = haceNDiasISO(-1)

    if (planTexto.trim()) {
      const existing = await db.planificacion.where('fecha').equals(manana).first()
      if (existing) {
        await db.planificacion.update(existing.id, { texto: planTexto.trim() })
      } else {
        await db.planificacion.add({ id: uuidv4(), fecha: manana, texto: planTexto.trim(), creadoAt: new Date() })
      }
    }

    if (gratitudTexto.trim()) {
      await db.reflexiones.add({
        id: uuidv4(), fecha: hoy, tipo: 'gratitud',
        texto: gratitudTexto.trim(), creadoAt: new Date(),
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
        <p className="font-body text-xs text-text-muted capitalize mb-1.5">{formatearFechaLarga(hoy)}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PersonajeHeader nivel={nivelG} />
            <div>
              <span className="font-pixel text-sm text-xp-bar text-glow-xp">
                {nombreNivel(nivelG)}
              </span>
              <span className="ml-2 font-pixel text-[10px] text-text-muted">Nv.{nivelG}</span>
            </div>
          </div>
          <button
            onClick={() => setShowManager(true)}
            className="font-pixel text-[8px] px-3 py-2 active:translate-y-[1px] active:translate-x-[1px]"
            style={{
              background: 'linear-gradient(180deg, #342848, #2a2035)',
              border: '2px solid #6a5880',
              borderRadius: '2px',
              color: '#c4a882',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.6)',
            }}
            title="Gestionar caminos"
          >⚙ CAMINOS</button>
        </div>
        <XpBar xp={xpGlobal} />
      </div>

      {/* Frase Ikigai del día */}
      <div className="mt-3">
        <FraseIkigai />
      </div>

      {/* Evento del día */}
      <EventoDelDia />

      {/* Acertijo (cada 3 días) */}
      {debeAparecerHoy() && <AcertijoDelDia />}

      {/* Dashboard semanal */}
      <DashboardSemanal />

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
            onAbrirManager={() => setShowManager(true)}
          />
        ))}
      </div>

      {/* Score diario */}
      <ScoreDiario avances={score.avances} total={score.total} pct={score.pct} />

      {/* FAB planificar mañana */}
      <button
        onClick={abrirModal}
        className="fixed bottom-20 right-4 font-pixel text-[9px] z-40
                   active:translate-y-[1px] active:translate-x-[1px] transition-transform"
        style={{
          background: 'linear-gradient(180deg, #e94560, #c03040)',
          border: '2px solid #ff6080',
          borderRadius: '2px',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '10px 14px',
        }}
      >
        📋 MAÑANA
      </button>

      {/* Modal planificación */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4"
             onClick={e => e.target === e.currentTarget && setShowPlanModal(false)}>
          <div className="w-full max-w-[480px] p-4 mb-16 animate-fade-in-up"
               style={{ background: 'linear-gradient(180deg, #2a2035 0%, #1a1520 100%)', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}>
            <h3 className="font-pixel text-[11px] text-text-primary mb-4">PLANIFICAR MAÑANA</h3>

            <div className="mb-4">
              <label className="block font-pixel text-[7px] text-text-muted uppercase tracking-wider mb-2">
                ✦ Intención para mañana
              </label>
              <textarea
                autoFocus
                value={planTexto}
                onChange={e => setPlanTexto(e.target.value)}
                placeholder="¿Qué quieres lograr mañana?"
                rows={3}
                className="w-full px-3 py-2 font-body text-sm text-text-primary
                           placeholder-text-muted outline-none resize-none"
                style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}
              />
            </div>

            <div className="mb-4">
              <label className="block font-pixel text-[7px] text-text-muted uppercase tracking-wider mb-2">
                🙏 Gratitud de hoy
              </label>
              <textarea
                value={gratitudTexto}
                onChange={e => setGratitudTexto(e.target.value)}
                placeholder="¿Por qué estás agradecido hoy?"
                rows={2}
                className="w-full px-3 py-2 font-body text-sm text-text-primary
                           placeholder-text-muted outline-none resize-none"
                style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 font-pixel text-[9px] text-text-muted"
                style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                CANCELAR
              </button>
              <button onClick={guardarPlan} disabled={guardandoPlan}
                className="flex-1 py-2.5 font-pixel text-[9px] text-white disabled:opacity-50
                           active:translate-y-[1px] active:translate-x-[1px]"
                style={{ background: 'linear-gradient(180deg, #e94560, #c03040)', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
