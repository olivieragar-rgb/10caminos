import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosHoy } from '../../hooks/useRegistros'
import { scoreDiario } from '../../utils/stats'
import { nivelGlobal, nombreNivel } from '../../utils/xp'
import { hoyISO, haceNDiasISO, formatearFechaLarga } from '../../utils/dates'
import { v4 as uuidv4 } from 'uuid'
import NavCards from './NavCards'
import { Sliders, CaretDown, CaretUp } from '@phosphor-icons/react'
import CaminoCard from './CaminoCard'
import SinFaltasButton from './SinFaltasButton'
import CaminoCompacto from './CaminoCompacto'
import PlanBanner from './PlanBanner'
import ScoreDiario from './ScoreDiario'
import XpBar from './XpBar'
import FraseIkigai from './FraseIkigai'
import CaminosManager from './CaminosManager'
import PersonajeHeader from './PersonajeHeader'
import AcertijoDelDia, { debeAparecerHoy } from './AcertijoDelDia'
import EventoDelDia from './EventoDelDia'
import EncuentroDelDia from './EncuentroDelDia'
import DashboardSemanal from './DashboardSemanal'

export default function HoyView({ onTabChange }) {
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
  const [caminosExpandidos, setCaminosExpandidos] = useState(true)

  useEffect(() => {
    db.configuracion.get('caminosExpandidos').then(rec => {
      if (rec?.value === false) setCaminosExpandidos(false)
    })
  }, [])

  const toggleCaminos = () => {
    const next = !caminosExpandidos
    setCaminosExpandidos(next)
    db.configuracion.put({ key: 'caminosExpandidos', value: next })
  }
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
            className="flex items-center gap-1.5 px-3 py-2 active:scale-[0.97] transition-transform"
            style={{
              background: '#2d2b47',
              border: '1px solid #4a4770',
              borderRadius: '8px',
              color: '#9590a8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
            title="Gestionar caminos"
          >
            <Sliders size={14} weight="duotone" />
            <span className="font-body text-xs font-semibold tracking-wide">CAMINOS</span>
          </button>
        </div>
        <XpBar xp={xpGlobal} />
      </div>

      {/* Sin Faltas de Hoy */}
      <SinFaltasButton
        caminos={todosCaminos}
        registrosHoy={registrosHoy}
        rutasActivas={rutasActivas}
      />

      {/* Navegación a otras secciones */}
      {onTabChange && <NavCards onNavigate={onTabChange} />}

      {/* Frase Ikigai del día */}
      <div className="mt-3">
        <FraseIkigai />
      </div>

      {/* Evento del día */}
      <EventoDelDia />

      {/* Encuentro secreto del día */}
      <EncuentroDelDia caminos={todosCaminos || []} registrosHoy={registrosHoy} />

      {/* Acertijo (cada 3 días) */}
      {debeAparecerHoy() && <AcertijoDelDia />}

      {/* Dashboard semanal */}
      <DashboardSemanal />

      {/* Plan banner */}
      <PlanBanner texto={planHoy?.texto} />

      {/* Caminos — colapsable */}
      <div className="flex-1">
        <button
          onClick={toggleCaminos}
          className="w-full flex items-center justify-between px-4 py-3 select-none"
          style={{ borderTop: '1px solid #302e4e', borderBottom: '1px solid #302e4e' }}
        >
          <span className="font-pixel text-xs text-text-muted tracking-wider">
            CAMINOS ({caminos.length})
          </span>
          {caminosExpandidos
            ? <CaretUp size={14} color="#5c5875" />
            : <CaretDown size={14} color="#5c5875" />
          }
        </button>

        {caminosExpandidos && caminos.map(camino => (
          <CaminoCard
            key={camino.id}
            camino={camino}
            registroHoy={getRegistroHoy(camino.id)}
            rutaActiva={getRutaActiva(camino.id)}
            onAbrirManager={() => setShowManager(true)}
          />
        ))}

        {!caminosExpandidos && (
          <div style={{ background: '#181726' }}>
            {caminos.map(camino => (
              <CaminoCompacto
                key={camino.id}
                camino={camino}
                registroHoy={getRegistroHoy(camino.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Score diario */}
      <ScoreDiario avances={score.avances} total={score.total} pct={score.pct} />

      {/* FAB planificar mañana */}
      <button
        onClick={abrirModal}
        className="fixed bottom-24 right-4 flex items-center gap-2 z-40
                   active:scale-[0.97] transition-transform duration-100"
        style={{
          background: 'linear-gradient(135deg, #e94560, #c03040)',
          border: 'none',
          borderRadius: '100px',
          boxShadow: '0 4px 20px rgba(233,69,96,0.4)',
          color: '#fff',
          padding: '12px 18px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.03em',
        }}
      >
        📋 Mañana
      </button>

      {/* Modal planificación */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4"
             onClick={e => e.target === e.currentTarget && setShowPlanModal(false)}>
          <div className="w-full max-w-[480px] p-5 mb-20 animate-fade-in-up"
               style={{ background: '#181726', border: '1px solid #302e4e', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
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
                style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
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
                style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 font-pixel text-[9px] text-text-muted"
                style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px', color: '#9590a8' }}>
                CANCELAR
              </button>
              <button onClick={guardarPlan} disabled={guardandoPlan}
                className="flex-1 py-2.5 font-pixel text-[9px] text-white disabled:opacity-50
                           active:translate-y-[1px] active:translate-x-[1px]"
                style={{ background: 'linear-gradient(135deg, #e94560, #c03040)', border: 'none', borderRadius: '8px' }}>
                GUARDAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
