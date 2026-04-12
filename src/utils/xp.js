import { XP_AVANCE_BASE, XP_RACHA_BONUS_PER_DAY, XP_RACHA_BONUS_CAP, XP_NADA_PENALTY, XP_PER_NIVEL, NIVEL_NOMBRES } from '../constants'

/** Calcula XP ganado por una marca */
export function calcularXpMarca(marca, rachaActual) {
  if (marca === 'avance') {
    const bonus = Math.min(rachaActual * XP_RACHA_BONUS_PER_DAY, XP_RACHA_BONUS_CAP)
    return XP_AVANCE_BASE + bonus
  }
  if (marca === 'nada') return XP_NADA_PENALTY
  return 0 // pausa
}

/** Nivel a partir de XP total */
export function xpANivel(xp) {
  return Math.floor(Math.max(0, xp) / XP_PER_NIVEL)
}

/** XP dentro del nivel actual (para barra de progreso) */
export function xpEnNivelActual(xp) {
  return Math.max(0, xp) % XP_PER_NIVEL
}

/** Porcentaje de progreso al siguiente nivel (0-100) */
export function porcentajeNivel(xp) {
  return (xpEnNivelActual(xp) / XP_PER_NIVEL) * 100
}

/** Entrada de nivel con emoji + nombre */
export function entradaNivel(nivel) {
  return NIVEL_NOMBRES.find(n => nivel >= n.min && nivel <= n.max) ?? NIVEL_NOMBRES[NIVEL_NOMBRES.length - 1]
}

/** Nombre del nivel según el número (incluye emoji) */
export function nombreNivel(nivel) {
  const entry = entradaNivel(nivel)
  return `${entry.emoji} ${entry.nombre}`
}

/** Solo el nombre sin emoji */
export function soloNombreNivel(nivel) {
  return entradaNivel(nivel).nombre
}

/** Nivel global: promedio de niveles de caminos activos */
export function nivelGlobal(caminos) {
  const activos = caminos.filter(c => c.activo)
  if (!activos.length) return 0
  const suma = activos.reduce((acc, c) => acc + xpANivel(c.xp), 0)
  return Math.floor(suma / activos.length)
}

/** Actualiza racha tras una marca */
export function actualizarRacha(marca, rachaActual, rachaMejor) {
  if (marca === 'avance') {
    const nueva = rachaActual + 1
    return { rachaActual: nueva, rachaMejor: Math.max(nueva, rachaMejor) }
  }
  if (marca === 'nada') {
    return { rachaActual: 0, rachaMejor }
  }
  // pausa: no rompe racha
  return { rachaActual, rachaMejor }
}
