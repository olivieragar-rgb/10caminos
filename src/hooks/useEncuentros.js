// src/hooks/useEncuentros.js
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { hoyISO } from '../utils/dates'
import { nivelGlobal, xpANivel } from '../utils/xp'
import { v4 as uuidv4 } from 'uuid'
import { getEntidad } from '../entidades'

/** Retorna todos los encuentros ordenados por fecha desc */
export function useHistorialEncuentros() {
  return useLiveQuery(
    () => db.encuentros.orderBy('fecha').reverse().toArray(),
    [],
    []
  )
}

/** Retorna el encuentro de hoy si existe */
export function useEncuentroHoy() {
  const hoy = hoyISO()
  return useLiveQuery(
    () => db.encuentros.where('fecha').equals(hoy).first(),
    [hoy],
    undefined
  )
}

/** Verifica si el codex está desbloqueado */
export function useCodexDesbloqueado() {
  return useLiveQuery(
    () => db.configuracion.get('codexDesbloqueado').then(r => r?.value ?? false),
    [],
    false
  )
}

/** Días desde el último encuentro con una entidad */
async function diasDesdeUltimoEncuentro(entidadId) {
  const ultimo = await db.encuentros
    .where('entidadId').equals(entidadId)
    .reverse()
    .first()
  if (!ultimo) return Infinity
  const diff = new Date(hoyISO()) - new Date(ultimo.fecha + 'T00:00:00')
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Evalúa qué trigger se activa hoy.
 * Retorna el id de la entidad a disparar, o null si ninguno.
 * @param {object[]} caminos - todos los caminos
 * @param {object[]} registrosHoy - registros del día de hoy
 */
export async function evaluarTriggers(caminos, registrosHoy) {
  const hoy = hoyISO()

  // Solo un encuentro por día
  const encuentrosHoy = await db.encuentros.where('fecha').equals(hoy).count()
  if (encuentrosHoy > 0) return null

  const activos = caminos.filter(c => c.activo)
  const nadasHoy = registrosHoy.filter(r => r.marca === 'nada').length
  const avancesHoy = registrosHoy.filter(r => r.marca === 'avance').length
  const nivelG = nivelGlobal(caminos)

  // Joker: 3+ Nada en el mismo día
  if (nadasHoy >= 3 && (await diasDesdeUltimoEncuentro('joker')) >= 3) {
    return 'joker'
  }

  // Erwin: todos los caminos activos con racha >= 7
  const todosRacha7 = activos.length > 0 && activos.every(c => c.rachaActual >= 7)
  if (todosRacha7 && (await diasDesdeUltimoEncuentro('erwin')) >= 7) {
    return 'erwin'
  }

  // Esfinge: cualquier camino con racha >= 30
  const hayRacha30 = activos.some(c => c.rachaActual >= 30)
  if (hayRacha30 && (await diasDesdeUltimoEncuentro('esfinge')) >= 14) {
    return 'esfinge'
  }

  // GLaDOS: nivel global >= 10
  if (nivelG >= 10 && (await diasDesdeUltimoEncuentro('glados')) >= 30) {
    return 'glados'
  }

  // L Lawliet: 3+ avances hoy
  if (avancesHoy >= 3 && (await diasDesdeUltimoEncuentro('l_lawliet')) >= 7) {
    return 'l_lawliet'
  }

  // Shikamaru: cualquier camino con racha >= 5
  const hayRacha5 = activos.some(c => c.rachaActual >= 5)
  if (hayRacha5 && (await diasDesdeUltimoEncuentro('shikamaru')) >= 5) {
    return 'shikamaru'
  }

  // Uranai Baba: nivel global subió respecto a la última vez que apareció
  const nivelVisto = await db.configuracion.get('uranaiNivelVisto')
  if (nivelG > (nivelVisto?.value ?? -1)) {
    await db.configuracion.put({ key: 'uranaiNivelVisto', value: nivelG })
    return 'uranai_baba'
  }

  // Rick: pseudo-aleatorio 4% por día (determinístico por fecha)
  const rickSeed = parseInt(hoy.replace(/-/g, '')) % 100
  if (rickSeed < 4 && (await diasDesdeUltimoEncuentro('rick')) >= 14) {
    return 'rick'
  }

  return null
}

/**
 * Guarda un encuentro completado en DB y desbloquea el codex si es el primero.
 */
export async function guardarEncuentro({ entidadId, desafioIdx, respuesta, correcto, loreFragment }) {
  const hoy = hoyISO()

  await db.encuentros.add({
    id: uuidv4(),
    entidadId,
    fecha: hoy,
    desafioIdx,
    respuesta: respuesta ?? null,
    correcto: correcto ?? null,
    loreFragment,
    visto: false,
  })

  // Desbloquear codex si es el primer encuentro ever
  const total = await db.encuentros.count()
  if (total === 1) {
    await db.configuracion.put({ key: 'codexDesbloqueado', value: true })
  }
}

/**
 * Agrega XP al camino con menos XP entre los activos (mecánica de balanceo).
 */
export async function otorgarXpEncuentro(xpRecompensa) {
  const activos = await db.caminos.filter(c => c.activo).toArray()
  if (!activos.length) return
  const minCamino = activos.reduce((min, c) => (c.xp < min.xp ? c : min))
  const nuevoXp = (minCamino.xp ?? 0) + xpRecompensa
  const nuevoNivel = Math.floor(nuevoXp / 100)
  await db.caminos.update(minCamino.id, { xp: nuevoXp, nivel: nuevoNivel })
}
