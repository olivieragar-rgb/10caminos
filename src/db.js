import Dexie from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import { CAMINOS_SEED, RECOMPENSAS_SEED } from './constants'

export const db = new Dexie('10caminos')

// Ikigai por defecto para caminos existentes (migración v2)
const IKIGAI_DEFAULTS = {
  1: 'Estar presente es el regalo más grande que puedo dar.',
  2: 'El amor florece con pequeños gestos cada día.',
  3: 'Mi cuerpo es mi aliado más fiel. Lo cuido.',
  4: 'La libertad financiera es libertad de elección.',
  5: 'Jugar no es perder el tiempo, es recuperar la vida.',
  6: 'Las raíces fuertes permiten crecer hacia arriba.',
  7: 'Lo que resuelves hoy no te pesa mañana.',
  8: 'Agradecer lo que tienes multiplica lo que recibes.',
}

db.version(1).stores({
  caminos:       '++id, activo, orden',
  rutas:         'id, caminoId, estado',
  registros:     'id, fecha, caminoId',
  planificacion: 'id, fecha',
  recompensas:   'id, caminoId, desbloqueada',
  chatHistorial: 'id, fecha',
  configuracion: 'key',
})

db.version(2).stores({
  caminos:       '++id, activo, orden',
  rutas:         'id, caminoId, estado',
  registros:     'id, fecha, caminoId',
  planificacion: 'id, fecha',
  recompensas:   'id, caminoId, desbloqueada',
  chatHistorial: 'id, fecha',
  configuracion: 'key',
  reflexiones:   'id, fecha, tipo',
}).upgrade(async tx => {
  // Añadir campo ikigai a caminos existentes
  await tx.table('caminos').toCollection().modify(c => {
    if (!c.ikigai) c.ikigai = IKIGAI_DEFAULTS[c.id] || ''
  })
})

/** Seed inicial — solo se ejecuta si la DB está vacía */
export async function seedIfEmpty() {
  const count = await db.caminos.count()
  if (count > 0) return

  const ahora = new Date()

  // Caminos
  await db.caminos.bulkAdd(
    CAMINOS_SEED.map(c => ({
      ...c,
      xp: 0,
      nivel: 0,
      rachaActual: 0,
      rachaMejor: 0,
      createdAt: ahora,
    }))
  )

  // Recompensas de ejemplo
  await db.recompensas.bulkAdd(
    RECOMPENSAS_SEED.map(r => ({
      id: uuidv4(),
      ...r,
      desbloqueada: false,
      reclamada: false,
      desbloqueadaAt: null,
      createdAt: ahora,
    }))
  )

  // Configuración por defecto
  await db.configuracion.bulkPut([
    { key: 'minCaminosDiarios', value: 5 },
    { key: 'maxVaciosSemana',   value: 3 },
    { key: 'claudeApiKey',      value: null },
  ])
}
