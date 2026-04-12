export function scoreDiario(registrosHoy, caminosActivos) {
  const total = caminosActivos.length
  if (!total) return { avances: 0, pausas: 0, nadas: 0, total: 0, pct: 0 }
  const avances = registrosHoy.filter(r => r.marca === 'avance').length
  const pausas  = registrosHoy.filter(r => r.marca === 'pausa').length
  const nadas   = registrosHoy.filter(r => r.marca === 'nada').length
  return { avances, pausas, nadas, total, pct: Math.round((avances / total) * 100) }
}

export function scoresPorDia(registros, fechas, totalCaminos) {
  return fechas.map(fecha => {
    const avances = registros.filter(r => r.fecha === fecha && r.marca === 'avance').length
    return { fecha, avances, total: totalCaminos }
  })
}

export function scoreSemanalCamino(registros, caminoId) {
  return registros.filter(r => r.caminoId === caminoId && r.marca === 'avance').length
}

export function xpGanadoEnPeriodo(registros, caminoId, fechaInicio, fechaFin) {
  return registros
    .filter(r => r.caminoId === caminoId && r.fecha >= fechaInicio && r.fecha <= fechaFin)
    .reduce((sum, r) => sum + (r.xpGanado || 0), 0)
}
