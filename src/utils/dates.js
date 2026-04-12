/** Fecha de hoy en formato "YYYY-MM-DD" */
export function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}

/** Fecha ISO de hace N días */
export function haceNDiasISO(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

/** Lunes de la semana que contiene la fecha dada */
export function lunesDeSemana(fecha = new Date()) {
  const d = new Date(fecha)
  const dia = d.getDay() // 0=Dom, 1=Lun...
  const diff = (dia === 0 ? -6 : 1 - dia)
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Array de 7 fechas ISO de la semana (Lun-Dom) a partir del lunes dado */
export function diasDeSemana(lunes) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

/** Formatea fecha ISO como "lunes 12 de abril" */
export function formatearFechaLarga(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

/** Formatea fecha ISO como "12 abr" */
export function formatearFechaCorta(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

/** Nombre del día de la semana corto (Lun, Mar...) para fecha ISO */
export function diaSemanaCorto(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short' })
    .replace('.', '')
    .slice(0, 3)
}

/** ¿Dos fechas ISO son el mismo día? */
export function mismodia(a, b) {
  return a === b
}
