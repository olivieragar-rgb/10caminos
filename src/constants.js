// XP mechanics
export const XP_AVANCE_BASE = 10
export const XP_RACHA_BONUS_PER_DAY = 2
export const XP_RACHA_BONUS_CAP = 20
export const XP_NADA_PENALTY = -5
export const XP_PER_NIVEL = 100
export const BONUS_GRATITUD = 5

// Level names — organic growth metaphors
export const NIVEL_NOMBRES = [
  { min: 0,  max: 2,         nombre: 'Semilla',     emoji: '🌱' },
  { min: 3,  max: 5,         nombre: 'Brote',        emoji: '🌿' },
  { min: 6,  max: 9,         nombre: 'Árbol Joven', emoji: '🌳' },
  { min: 10, max: 14,        nombre: 'Explorador',  emoji: '⛰️' },
  { min: 15, max: 19,        nombre: 'Guerrero',    emoji: '🔥' },
  { min: 20, max: 24,        nombre: 'Maestro',     emoji: '🏯' },
  { min: 25, max: Infinity,  nombre: 'Leyenda',     emoji: '🐉' },
]

// Marca types
export const MARCAS = {
  AVANCE: 'avance',
  PAUSA: 'pausa',
  NADA: 'nada',
}

// Colores de marca
export const MARCA_COLORES = {
  avance: '#00e676',
  pausa:  '#ffab00',
  nada:   '#616161',
}

export const MARCA_SIMBOLOS = {
  avance: '✓',
  pausa:  '→',
  nada:   '○',
}

// Tabs
export const TABS = [
  { id: 'hoy',      label: 'Hoy',      emoji: '☀️'  },
  { id: 'semana',   label: 'Semana',   emoji: '📅'  },
  { id: 'rutas',    label: 'Rutas',    emoji: '🗺️'  },
  { id: 'progreso', label: 'Progreso', emoji: '📊'  },
  { id: 'chat',     label: 'Chat IA',  emoji: '🤖'  },
]

// Frases Ikigai — rotación diaria (fácil de editar)
export const FRASES_IKIGAI = [
  "El camino se hace al andar, un paso a la vez.",
  "Lo que cuidas hoy florecerá mañana.",
  "Pequeños actos de presencia construyen grandes vidas.",
  "No hace falta perfección, hace falta continuidad.",
  "Quien cuida su interior, cuida todo lo demás.",
  "La fuerza real es volver, no no caer nunca.",
  "Un minuto de conexión genuina vale más que horas de presencia vacía.",
  "El cuerpo que entrenas hoy es el que te lleva mañana.",
  "Gratitud y orgullo no se excluyen, se alimentan.",
  "Hacer poco con atención vale más que hacer mucho con prisa.",
  "Tu energía es finita. Úsala en lo que amas.",
  "El descanso no es rendirse. Es prepararse.",
  "Las raíces invisibles sostienen los árboles más altos.",
  "No compitas con nadie. Solo con quien fuiste ayer.",
  "La imperfección honesta supera la perfección fingida.",
  "Estar presente es el regalo más radical que puedes dar.",
  "El caos exterior cede cuando el interior está en orden.",
  "Cada hábito pequeño es un voto por quien quieres ser.",
  "Lo que no resuelves hoy, lo cargas mañana.",
  "Jugar no es lujo. Es necesidad del alma.",
  "Amar bien requiere cuidarte bien primero.",
  "La libertad financiera se construye con decisiones diarias, no con suerte.",
  "Agradecer no es ingenuo. Es poderoso.",
  "Un paso imperfecto avanza más que ningún paso perfecto.",
  "Tu familia no necesita tu mejor versión. Necesita tu presencia real.",
  "La salud no se compra. Se elige cada día.",
  "Soltar lo que no sirve es hacer espacio para lo que importa.",
  "Lo que practicas se convierte en lo que eres.",
  "El progreso lento también es progreso.",
  "Hoy es el único día en el que puedes actuar.",
]

// Mensajes Wabi-Sabi — para cuando marcas ○ (fácil de editar)
export const MENSAJES_WABI_SABI = [
  "Un día tranquilo también forma parte del camino.",
  "La imperfección es humana. Mañana vuelves.",
  "Descansar no es fallar. Es recuperarse.",
  "Todo árbol tiene temporadas sin frutos.",
  "Un paso atrás no borra los que diste.",
  "Hoy fue así. Mañana puede ser diferente.",
  "El río que se detiene vuelve a fluir.",
  "Recuerda: un paso basta para avanzar.",
]

// Seed: 10 Caminos (con ikigai — fácil de editar)
export const CAMINOS_SEED = [
  {
    id: 1, nombre: 'Presente con mis hijos',
    identidad: 'Padre que prioriza la conexión',
    ikigai: 'Estar presente es el regalo más grande que puedo dar.',
    icono: '👨‍👧‍👦', activo: true, orden: 1,
  },
  {
    id: 2, nombre: 'Feliz con Lou',
    identidad: 'Quien cuida y construye felicidad',
    ikigai: 'El amor florece con pequeños gestos cada día.',
    icono: '💛', activo: true, orden: 2,
  },
  {
    id: 3, nombre: 'Sano y en forma',
    identidad: 'Atleta que entrena su cuerpo',
    ikigai: 'Mi cuerpo es mi aliado más fiel. Lo cuido.',
    icono: '💪', activo: true, orden: 3,
  },
  {
    id: 4, nombre: 'Bienestar económico',
    identidad: 'Quien construye libertad financiera',
    ikigai: 'La libertad financiera es libertad de elección.',
    icono: '📈', activo: true, orden: 4,
  },
  {
    id: 5, nombre: 'Niño interior',
    identidad: 'Quien juega y se divierte',
    ikigai: 'Jugar no es perder el tiempo, es recuperar la vida.',
    icono: '🎮', activo: true, orden: 5,
  },
  {
    id: 6, nombre: 'Familia',
    identidad: 'Quien une y mantiene lazos',
    ikigai: 'Las raíces fuertes permiten crecer hacia arriba.',
    icono: '🏠', activo: true, orden: 6,
  },
  {
    id: 7, nombre: 'Sin mochila',
    identidad: 'Quien resuelve, no acumula',
    ikigai: 'Lo que resuelves hoy no te pesa mañana.',
    icono: '🎒', activo: true, orden: 7,
  },
  {
    id: 8, nombre: 'Gratitud y humildad',
    identidad: 'Quien agradece y aprende',
    ikigai: 'Agradecer lo que tienes multiplica lo que recibes.',
    icono: '🙏', activo: true, orden: 8,
  },
  {
    id: 9, nombre: '(Por definir)',
    identidad: '—', ikigai: '',
    icono: '⭐', activo: false, orden: 9,
  },
  {
    id: 10, nombre: '(Por definir)',
    identidad: '—', ikigai: '',
    icono: '⭐', activo: false, orden: 10,
  },
]

// Seed: Recompensas
export const RECOMPENSAS_SEED = [
  {
    caminoId: 3,
    nombre: 'Date un capricho fitness',
    descripcion: null,
    nivelRequerido: 5,
    icono: '👟',
  },
  {
    caminoId: null,
    nombre: 'Cena de celebración',
    descripcion: null,
    nivelRequerido: 10,
    icono: '🎉',
  },
]
