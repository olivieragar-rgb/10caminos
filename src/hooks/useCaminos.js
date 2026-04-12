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
