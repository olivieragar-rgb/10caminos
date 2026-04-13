import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { v4 as uuidv4 } from 'uuid'
import { hoyISO } from '../utils/dates'

export function useRetoCamino(caminoId) {
  return useLiveQuery(
    () => db.retos
      .where('caminoId').equals(caminoId)
      .filter(r => r.estado === 'activo')
      .first(),
    [caminoId]
  )
}

export function useRetosActivos() {
  return useLiveQuery(
    () => db.retos.where('estado').equals('activo').toArray(),
    [], []
  )
}

export async function crearReto({ caminoId, titulo, descripcion, duracionDias, xpPremio, xpPenalty, meta, personajeId }) {
  const hoy = hoyISO()
  const fechaFin = (() => {
    const d = new Date(hoy + 'T00:00:00')
    d.setDate(d.getDate() + duracionDias - 1)
    return d.toISOString().split('T')[0]
  })()
  await db.retos.add({
    id: uuidv4(),
    caminoId,
    titulo,
    descripcion,
    duracionDias,
    xpPremio,
    xpPenalty,
    meta,
    totalDias: duracionDias,
    estado: 'activo',
    fechaInicio: hoy,
    fechaFin,
    personajeId,
    creadoAt: new Date(),
  })
}

export async function evaluarRetosExpirados() {
  // Llamar esto periódicamente desde la UI para evaluar retos vencidos
  const hoy = hoyISO()
  const retosActivos = await db.retos.where('estado').equals('activo').toArray()

  for (const reto of retosActivos) {
    if (reto.fechaFin >= hoy) continue // No ha vencido aún

    // Contar avances en el período del reto
    const registros = await db.registros
      .where('caminoId').equals(reto.caminoId)
      .filter(r => r.fecha >= reto.fechaInicio && r.fecha <= reto.fechaFin && r.marca === 'avance')
      .toArray()

    const avances = registros.length
    const completado = avances >= reto.meta

    await db.retos.update(reto.id, { estado: completado ? 'completado' : 'fallido' })

    // Aplicar XP
    const camino = await db.caminos.get(reto.caminoId)
    if (camino) {
      const delta = completado ? reto.xpPremio : -reto.xpPenalty
      const nuevoXp = Math.max(0, camino.xp + delta)
      const nuevoNivel = Math.floor(nuevoXp / 100)
      await db.caminos.update(reto.caminoId, { xp: nuevoXp, nivel: nuevoNivel })
    }
  }
}

export async function abandonarReto(retoId) {
  const reto = await db.retos.get(retoId)
  if (!reto) return
  await db.retos.update(retoId, { estado: 'fallido' })
  const camino = await db.caminos.get(reto.caminoId)
  if (camino) {
    const nuevoXp = Math.max(0, camino.xp - reto.xpPenalty)
    const nuevoNivel = Math.floor(nuevoXp / 100)
    await db.caminos.update(reto.caminoId, { xp: nuevoXp, nivel: nuevoNivel })
  }
}
