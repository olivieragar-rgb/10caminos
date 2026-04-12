import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { v4 as uuidv4 } from 'uuid'

export function useRutas(estado = null) {
  return useLiveQuery(
    () => estado
      ? db.rutas.where('estado').equals(estado).toArray()
      : db.rutas.toArray(),
    [estado], []
  )
}

export function useTodasRutas() {
  return useLiveQuery(() => db.rutas.toArray(), [], [])
}

export function useRutasCamino(caminoId) {
  return useLiveQuery(
    () => caminoId ? db.rutas.where('caminoId').equals(caminoId).toArray() : Promise.resolve([]),
    [caminoId], []
  )
}

export async function crearRuta(caminoId, nombre, pasosTexto) {
  const ruta = {
    id: uuidv4(),
    caminoId,
    nombre,
    pasos: pasosTexto.map(p => ({ texto: p, completado: false })),
    pasoActual: 0,
    estado: 'activa',
    pausaMotivo: null,
    pausaDesde: null,
    notas: [],
    createdAt: new Date(),
    completadaAt: null,
  }
  await db.rutas.add(ruta)
  return ruta
}

export async function avanzarPaso(rutaId) {
  const ruta = await db.rutas.get(rutaId)
  if (!ruta) return
  const nuevoPaso = ruta.pasoActual + 1
  const pasos = ruta.pasos.map((p, i) =>
    i === ruta.pasoActual ? { ...p, completado: true } : p
  )
  const completada = nuevoPaso >= ruta.pasos.length
  await db.rutas.update(rutaId, {
    pasoActual: nuevoPaso,
    pasos,
    estado: completada ? 'completada' : 'activa',
    completadaAt: completada ? new Date() : null,
  })
}

export async function pausarRuta(rutaId, motivo) {
  await db.rutas.update(rutaId, { estado: 'pausa', pausaMotivo: motivo, pausaDesde: new Date() })
}

export async function reanudarRuta(rutaId) {
  await db.rutas.update(rutaId, { estado: 'activa', pausaMotivo: null, pausaDesde: null })
}

export async function completarRuta(rutaId) {
  await db.rutas.update(rutaId, { estado: 'completada', completadaAt: new Date() })
}

export async function agregarNotaRuta(rutaId, texto, viaVoz = false) {
  const ruta = await db.rutas.get(rutaId)
  if (!ruta) return
  await db.rutas.update(rutaId, {
    notas: [...(ruta.notas || []), { texto, fecha: new Date(), viaVoz }],
  })
}

export async function editarRuta(rutaId, cambios) {
  await db.rutas.update(rutaId, cambios)
}

export async function eliminarRuta(rutaId) {
  await db.rutas.delete(rutaId)
}
