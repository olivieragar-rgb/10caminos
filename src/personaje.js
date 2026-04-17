// Paletas de color para el avatar
export const PIEL_COLORES  = ['#FDDBB4', '#E8B88A', '#C68642', '#A0522D', '#5C3317']
export const PELO_COLORES  = ['#1A1A1A', '#5C3317', '#C8A850', '#8B2500', '#A0A0A0', '#F0F0F0', '#7B2D8B', '#2D6A8B']
export const OJOS_COLORES  = ['#6B3A2A', '#2D6A8B', '#3A8B3A', '#8B6C3A', '#1A1A1A']

export const PELO_ESTILOS  = ['Corto', 'Medio', 'Largo', 'Rizado', 'Rapado']
export const VELLO_OPCIONES = ['Ninguno', 'Barba corta', 'Barba']

export const PERSONALIDADES = {
  analitico:   { label: 'Analítico',   emoji: '🧠', desc: 'Piensa antes de actuar. Valora la lógica y los datos.' },
  creativo:    { label: 'Creativo',    emoji: '🎨', desc: 'Busca soluciones originales. Piensa fuera de la caja.' },
  aventurero:  { label: 'Aventurero',  emoji: '⚡', desc: 'Le gustan los retos. Actúa rápido y aprende en el camino.' },
  equilibrado: { label: 'Equilibrado', emoji: '☯️', desc: 'Busca armonía. Valora la constancia sobre los extremos.' },
  guerrero:    { label: 'Guerrero',    emoji: '🔥', desc: 'Determinado. No se rinde. La disciplina es su arma.' },
}

export const PERSONAJE_DEFAULT = {
  nombre: 'Viajero',
  bio: '',
  personalidad: 'equilibrado',
  piel: 2,
  peloCColor: 1,
  peloEstilo: 1,
  ojos: 0,
  vellos: 0,
}
