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
  { id: 'hoy',      label: 'HOY',      emoji: '⚔️'  },
  { id: 'semana',   label: 'SEMANA',   emoji: '📅'  },
  { id: 'rutas',    label: 'RUTAS',    emoji: '🗺️'  },
  { id: 'progreso', label: 'STATS',    emoji: '📊'  },
  { id: 'chat',     label: 'CHAT',     emoji: '💬'  },
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

// Seed: Recompensas — hitos distribuidos por el camino como sorpresas
export const RECOMPENSAS_SEED = [
  // ── Hitos globales (nivel promedio de todos los caminos) ──────────────────
  { caminoId: null, nombre: 'Primer café especial del mes',    nivelRequerido: 1,  icono: '☕' },
  { caminoId: null, nombre: 'Tarde libre sin culpa',           nivelRequerido: 3,  icono: '🌅' },
  { caminoId: null, nombre: 'Cena especial en familia',        nivelRequerido: 5,  icono: '🍽️' },
  { caminoId: null, nombre: 'Un día de aventura con los niños',nivelRequerido: 8,  icono: '🎡' },
  { caminoId: null, nombre: 'Fin de semana de desconexión',    nivelRequerido: 10, icono: '🏕️' },
  { caminoId: null, nombre: 'Viaje de un día con Lou',         nivelRequerido: 15, icono: '🚗' },
  { caminoId: null, nombre: 'Gran celebración (tú decides)',   nivelRequerido: 20, icono: '🏆' },

  // ── Camino 1: Presente con mis hijos ─────────────────────────────────────
  { caminoId: 1, nombre: 'Juego de mesa especial juntos',      nivelRequerido: 3,  icono: '🎲' },
  { caminoId: 1, nombre: 'Excursión con los niños',            nivelRequerido: 7,  icono: '🌳' },

  // ── Camino 2: Feliz con Lou ───────────────────────────────────────────────
  { caminoId: 2, nombre: 'Cita sorpresa para Lou',             nivelRequerido: 3,  icono: '💛' },
  { caminoId: 2, nombre: 'Escapada de pareja (1 noche)',       nivelRequerido: 8,  icono: '🌙' },

  // ── Camino 3: Sano y en forma ─────────────────────────────────────────────
  { caminoId: 3, nombre: 'Zapatillas nuevas para entrenar',    nivelRequerido: 5,  icono: '👟' },
  { caminoId: 3, nombre: 'Inscripción a una carrera',          nivelRequerido: 10, icono: '🏃' },

  // ── Camino 4: Bienestar económico ─────────────────────────────────────────
  { caminoId: 4, nombre: 'Libro de finanzas que quieres',      nivelRequerido: 3,  icono: '📚' },
  { caminoId: 4, nombre: 'Inversión simbólica de celebración', nivelRequerido: 8,  icono: '📈' },

  // ── Camino 5: Niño interior ───────────────────────────────────────────────
  { caminoId: 5, nombre: 'Videojuego o juguete que te apetece',nivelRequerido: 4,  icono: '🎮' },

  // ── Camino 8: Gratitud y humildad ─────────────────────────────────────────
  { caminoId: 8, nombre: 'Carta escrita a alguien importante', nivelRequerido: 5,  icono: '✉️' },
]

// Acertijos del día
export const ACERTIJOS = [
  { pregunta: 'Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?', respuesta: 'Un mapa' },
  { pregunta: 'Cuanto más secas, más moja. ¿Qué es?', respuesta: 'Una toalla' },
  { pregunta: 'Soy ligero como una pluma, pero ni el hombre más fuerte puede sostenerme más de unos minutos. ¿Qué soy?', respuesta: 'El aliento' },
  { pregunta: 'Tengo manos pero no puedo aplaudir. ¿Qué soy?', respuesta: 'Un reloj' },
  { pregunta: 'Siempre delante de ti, pero nunca puedes verme. ¿Qué soy?', respuesta: 'El futuro' },
  { pregunta: 'Rompo al caer, pero no al hervir. ¿Qué soy?', respuesta: 'Un huevo' },
  { pregunta: 'Soy tuyo, pero los demás lo usan más que tú. ¿Qué soy?', respuesta: 'Tu nombre' },
  { pregunta: 'Entre más me quitas, más grande me hago. ¿Qué soy?', respuesta: 'Un hoyo' },
  { pregunta: 'Puedo volar sin alas, llorar sin ojos, y donde voy, oscurece todo. ¿Qué soy?', respuesta: 'Una nube' },
  { pregunta: 'Tengo cabeza y cola pero no tengo cuerpo. ¿Qué soy?', respuesta: 'Una moneda' },
  { pregunta: 'Dos hermanos somos, juntos vivimos, sin vernos estamos. ¿Qué somos?', respuesta: 'Los ojos' },
  { pregunta: 'Primero comes, luego te comes a mí. ¿Quién soy?', respuesta: 'El anzuelo' },
  { pregunta: 'Tengo hojas pero no soy árbol, tengo lomo pero no soy animal. ¿Qué soy?', respuesta: 'Un libro' },
  { pregunta: 'Voy y vengo todo el día, pero siempre en el mismo lugar. ¿Qué soy?', respuesta: 'Una puerta' },
  { pregunta: 'Sin que nadie me llame, vengo; sin que nadie me diga, hablo. ¿Qué soy?', respuesta: 'El eco' },
  { pregunta: 'Tengo patas pero no camino, tengo espalda pero no me doblo. ¿Qué soy?', respuesta: 'Una silla' },
  { pregunta: 'Me compras para comer, pero nunca me comes. ¿Qué soy?', respuesta: 'Un plato' },
  { pregunta: 'Soy redondo como el sol, blanco como la nieve y amargo como la hiel. ¿Qué soy?', respuesta: 'El ajo' },
  { pregunta: 'Tengo dientes pero no muerdo. ¿Qué soy?', respuesta: 'Un peine' },
  { pregunta: 'Cuantas más hay, menos ves. ¿Qué son?', respuesta: 'Las tinieblas' },
  { pregunta: 'Nací de madre que no tenía, vivo y no respiro, bebo sin sed y sin boca. ¿Qué soy?', respuesta: 'Un pez' },
  { pregunta: 'Soy invisible pero puedes sentirme, no tengo forma pero puedo doblar árboles. ¿Qué soy?', respuesta: 'El viento' },
  { pregunta: 'Tengo un ojo pero no veo. ¿Qué soy?', respuesta: 'Una aguja' },
  { pregunta: 'Soy tan frágil que al pronunciar mi nombre me rompo. ¿Qué soy?', respuesta: 'El silencio' },
  { pregunta: 'Vuelo sin alas, corro sin patas, siempre hacia adelante, nunca puedes atraparme. ¿Qué soy?', respuesta: 'El tiempo' },
  { pregunta: 'Tengo piel sin cuerpo, sin voz puedo hablar, viajo por el mundo y no me puedo parar. ¿Qué soy?', respuesta: 'Una carta' },
  { pregunta: 'Me ves una vez en un minuto, dos veces en un momento y nunca en cien años. ¿Qué soy?', respuesta: 'La letra M' },
  { pregunta: 'Soy más útil cuando estoy roto. ¿Qué soy?', respuesta: 'Un huevo' },
  { pregunta: 'Tengo raíces que nadie ve, soy más alta que los árboles, arriba no crece nada, pero nunca me iré. ¿Qué soy?', respuesta: 'Una montaña' },
  { pregunta: 'Corro, pero no tengo piernas. Tengo boca, pero no hablo. ¿Qué soy?', respuesta: 'Un río' },
  { pregunta: 'Lleno un cuarto pero no ocupo espacio. ¿Qué soy?', respuesta: 'La luz' },
  { pregunta: 'Soy el principio de todo, el final del tiempo y del espacio, el inicio de cada lugar. ¿Qué soy?', respuesta: 'La letra E' },
  { pregunta: 'Nací de padre y madre pero nunca nací. ¿Qué soy?', respuesta: 'Adán y Eva' },
  { pregunta: 'Puedo correr pero no caminar. ¿Dónde estoy siempre delante de ti pero nunca atrás?', respuesta: 'Tu nariz (cuando corres)' },
  { pregunta: 'Sin dinero, sin precio, te lo doy si eres mi amigo, lo pierdo si lo exijo. ¿Qué soy?', respuesta: 'El respeto' },
  { pregunta: 'Nace grande y muere pequeño. ¿Qué es?', respuesta: 'Una vela' },
  { pregunta: 'Estoy lleno de agujeros pero retengo el agua. ¿Qué soy?', respuesta: 'Una esponja' },
  { pregunta: 'Un hombre entra bajo la lluvia sin paraguas ni sombrero y no se moja ni un pelo. ¿Cómo?', respuesta: 'Porque es calvo' },
  { pregunta: '¿Qué empieza con "E", termina con "E" y solo tiene una letra?', respuesta: 'Un sobre' },
  { pregunta: '¿Cuántos meses del año tienen 28 días?', respuesta: 'Todos (todos los meses tienen al menos 28 días)' },
  { pregunta: 'Un gallo pone un huevo en lo más alto de un tejado. ¿Hacia qué lado cae?', respuesta: 'Los gallos no ponen huevos' },
  { pregunta: 'Si 5 gatos cazan 5 ratones en 5 minutos, ¿cuántos gatos necesitas para cazar 100 ratones en 100 minutos?', respuesta: '5 gatos' },
  { pregunta: 'Cuanto más rápido corres hacia ella, más rápido huye. ¿Qué es?', respuesta: 'El horizonte' },
  { pregunta: 'Puedo capturar recuerdos pero no tengo manos. Guardo momentos pero no tengo corazón. ¿Qué soy?', respuesta: 'Una fotografía' },
  { pregunta: 'Todos la buscan, nadie la quiere cuando la encuentra, y una vez que la tiene, no la cambia por nada. ¿Qué es?', respuesta: 'La vejez (la sabiduría del tiempo)' },
]
