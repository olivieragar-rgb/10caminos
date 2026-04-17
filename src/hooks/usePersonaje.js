import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { PERSONAJE_DEFAULT } from '../personaje'

export function usePersonaje() {
  const registro = useLiveQuery(
    () => db.configuracion.get('personaje'),
    [],
    null
  )
  if (registro === null) return PERSONAJE_DEFAULT
  return registro?.value ?? PERSONAJE_DEFAULT
}

export async function guardarPersonaje(datos) {
  await db.configuracion.put({ key: 'personaje', value: datos })
}
