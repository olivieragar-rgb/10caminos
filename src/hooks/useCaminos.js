import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export function useCaminos() {
  return useLiveQuery(() => db.caminos.orderBy('orden').toArray(), [], [])
}

export function useCaminosActivos() {
  return useLiveQuery(
    () => db.caminos.orderBy('orden').filter(c => c.activo).toArray(),
    [], []
  )
}

export async function updateCamino(id, updates) {
  await db.caminos.update(id, updates)
}

export async function resetCaminoStats(id) {
  await db.caminos.update(id, { xp: 0, nivel: 0, rachaActual: 0, rachaMejor: 0 })
}
