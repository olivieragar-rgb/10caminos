import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { hoyISO } from '../utils/dates'
import { calcularXpMarca, xpANivel } from '../utils/xp'
import { v4 as uuidv4 } from 'uuid'

export function useRegistrosHoy() {
  const hoy = hoyISO()
  return useLiveQuery(() => db.registros.where('fecha').equals(hoy).toArray(), [hoy], [])
}

export function useRegistrosSemana(fechas) {
  const key = fechas.join(',')
  return useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).toArray(),
    [key], []
  )
}

export function useRegistros30Dias() {
  const fechas = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })
  return useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).toArray(),
    [fechas[0]], []
  )
}

async function recalcularRacha(caminoId) {
  const todos = await db.registros.where('caminoId').equals(caminoId).toArray()
  const byFecha = {}
  for (const r of todos) byFecha[r.fecha] = r.marca

  let racha = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const fecha = d.toISOString().slice(0, 10)
    const marca = byFecha[fecha]
    if (marca === 'avance') racha++
    else if (marca === 'pausa') continue
    else break
  }
  return racha
}

export async function marcarCamino(caminoId, marca, nota = null, rutaId = null) {
  const hoy = hoyISO()
  const camino = await db.caminos.get(caminoId)
  if (!camino) return null

  const existing = await db.registros
    .where('fecha').equals(hoy)
    .filter(r => r.caminoId === caminoId)
    .first()

  const nuevoXpGanado = calcularXpMarca(marca, camino.rachaActual)
  const anteriorXpGanado = existing?.xpGanado ?? 0
  const delta = existing ? nuevoXpGanado - anteriorXpGanado : nuevoXpGanado

  const nivelAnterior = camino.nivel
  const nuevoXp = Math.max(0, camino.xp + delta)
  const nuevoNivel = xpANivel(nuevoXp)

  await db.transaction('rw', db.caminos, db.registros, async () => {
    if (existing) {
      await db.registros.update(existing.id, { marca, nota, xpGanado: nuevoXpGanado, rutaId })
    } else {
      await db.registros.add({
        id: uuidv4(), fecha: hoy, caminoId, marca, nota, rutaId, xpGanado: nuevoXpGanado,
      })
    }
    await db.caminos.update(caminoId, { xp: nuevoXp, nivel: nuevoNivel })
  })

  const rachaActual = await recalcularRacha(caminoId)
  const rachaMejor = Math.max(rachaActual, camino.rachaMejor)
  await db.caminos.update(caminoId, { rachaActual, rachaMejor })

  return { xpGanado: delta, nivelAnterior, nuevoNivel, subioNivel: nuevoNivel > nivelAnterior }
}

export async function agregarNotaRegistro(caminoId, nota) {
  const hoy = hoyISO()
  const existing = await db.registros
    .where('fecha').equals(hoy)
    .filter(r => r.caminoId === caminoId)
    .first()
  if (existing) await db.registros.update(existing.id, { nota })
}
