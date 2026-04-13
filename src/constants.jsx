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

// ── PERSONAJES DESBLOQUEABLES ─────────────────────────────────────────────

const GON_RECTS = [
  [4,0,8,1,'#111100'],[3,1,10,3,'#1a1a00'],[2,2,2,3,'#1a1a00'],[12,2,2,3,'#1a1a00'],
  [4,4,8,5,'#d4996a'],[3,5,1,3,'#d4996a'],[12,5,1,3,'#d4996a'],
  [5,6,2,1,'#111100'],[9,6,2,1,'#111100'],[6,8,4,1,'#7a3020'],[6,9,4,1,'#d4996a'],
  [4,10,8,4,'#2a7a20'],[3,11,1,3,'#2a7a20'],[12,11,1,3,'#2a7a20'],
  [5,10,6,1,'#e0e0e0'],[4,14,3,2,'#1a1a60'],[9,14,3,2,'#1a1a60'],
]
const PIKACHU_RECTS = [
  [3,0,2,3,'#1a1a00'],[11,0,2,3,'#1a1a00'],[3,3,2,2,'#f8d030'],[11,3,2,2,'#f8d030'],
  [4,4,8,6,'#f8d030'],[3,5,10,5,'#f8d030'],[2,6,12,3,'#f8d030'],
  [5,6,2,2,'#1a1a00'],[9,6,2,2,'#1a1a00'],[7,7,2,1,'#1a1a00'],
  [3,8,3,2,'#e03020'],[10,8,3,2,'#e03020'],[6,9,4,1,'#1a1a00'],
  [4,10,8,3,'#f8d030'],[3,10,10,2,'#f8d030'],[4,10,8,1,'#c0901a'],
  [4,13,3,2,'#f8d030'],[9,13,3,2,'#f8d030'],
  [13,9,2,1,'#f8d030'],[14,8,2,1,'#f8d030'],[13,7,2,1,'#f8d030'],
]
const KILLUA_RECTS = [
  [3,0,10,4,'#e8e8f0'],[2,2,2,3,'#e8e8f0'],[12,2,2,4,'#e8e8f0'],
  [4,4,8,5,'#ddd8d0'],[3,5,1,3,'#ddd8d0'],[12,5,1,3,'#ddd8d0'],
  [5,6,2,1,'#60b0e0'],[9,6,2,1,'#60b0e0'],[7,8,2,1,'#907070'],
  [4,10,8,4,'#1a2040'],[3,11,1,3,'#1a2040'],[12,11,1,3,'#1a2040'],
  [5,10,6,1,'#2a3060'],[4,14,3,2,'#2a3060'],[9,14,3,2,'#2a3060'],
]
const TOTORO_RECTS = [
  [3,0,3,3,'#606870'],[10,0,3,3,'#606870'],[4,1,2,2,'#80909a'],[10,1,2,2,'#80909a'],
  [2,3,12,6,'#7a8a94'],[1,4,14,4,'#7a8a94'],
  [4,5,3,3,'#f0f0f0'],[9,5,3,3,'#f0f0f0'],
  [5,6,2,2,'#1a2a10'],[10,6,2,2,'#1a2a10'],[5,6,1,1,'#ffffff'],[10,6,1,1,'#ffffff'],
  [7,7,2,1,'#4a3a3a'],[2,7,4,1,'#4a3a3a'],[10,7,4,1,'#4a3a3a'],
  [3,9,10,6,'#d8d0c0'],[2,10,12,4,'#d8d0c0'],[1,9,2,4,'#7a8a94'],[13,9,2,4,'#7a8a94'],
  [6,11,4,1,'#b0a898'],[5,12,6,1,'#b0a898'],
  [3,13,4,3,'#7a8a94'],[9,13,4,3,'#7a8a94'],
]
const GOKU_RECTS = [
  [5,0,6,1,'#080808'],[4,1,8,1,'#080808'],[3,2,10,2,'#080808'],[2,3,12,1,'#080808'],
  [2,1,1,3,'#080808'],[13,1,1,3,'#080808'],
  [4,4,8,5,'#c87040'],[3,5,1,3,'#c87040'],[12,5,1,3,'#c87040'],
  [5,6,2,1,'#080808'],[9,6,2,1,'#080808'],[6,8,4,1,'#7a4030'],[6,9,4,1,'#c87040'],
  [3,10,10,3,'#e06820'],[3,12,10,1,'#1a40a0'],[4,13,8,1,'#e06820'],
  [2,10,1,4,'#e06820'],[13,10,1,4,'#e06820'],
  [4,14,3,2,'#e06820'],[9,14,3,2,'#e06820'],
]
const NARUTO_RECTS = [
  [4,0,8,1,'#f0c020'],[3,1,10,3,'#f0c020'],[2,2,2,4,'#f0c020'],[12,2,2,4,'#f0c020'],[1,3,1,3,'#f0c020'],
  [4,4,8,5,'#e8a060'],[3,5,1,3,'#e8a060'],[12,5,1,3,'#e8a060'],
  [5,6,2,1,'#2060d0'],[9,6,2,1,'#2060d0'],
  [3,7,3,1,'#c07040'],[10,7,3,1,'#c07040'],[7,8,2,1,'#904030'],
  [3,4,10,1,'#6a6a6a'],[6,3,4,2,'#a0a0a0'],[7,3,2,2,'#c0c0c0'],
  [3,10,10,4,'#e06020'],[2,11,1,3,'#e06020'],[13,11,1,3,'#e06020'],
  [7,9,2,1,'#e8a060'],[4,14,3,2,'#2040a0'],[9,14,3,2,'#2040a0'],
]
const MEGAMAN_RECTS = [
  [4,1,8,7,'#2060d0'],[3,2,10,5,'#2060d0'],[2,3,12,3,'#2060d0'],
  [4,5,8,4,'#80c0f0'],[3,6,10,3,'#80c0f0'],
  [5,6,2,2,'#1a1a1a'],[9,6,2,2,'#1a1a1a'],[5,6,1,1,'#ffffff'],[9,6,1,1,'#ffffff'],
  [6,8,4,1,'#2060d0'],
  [4,9,8,5,'#2060d0'],[3,10,10,3,'#2060d0'],
  [1,10,3,3,'#2060d0'],[0,11,2,2,'#4080e0'],
  [4,14,3,2,'#1040a0'],[9,14,3,2,'#1040a0'],
]
const MAJINBOO_RECTS = [
  [7,0,2,3,'#e060a0'],[6,2,4,1,'#e060a0'],
  [3,3,10,6,'#f080c0'],[2,4,12,4,'#f080c0'],
  [4,5,3,2,'#f0f0f0'],[9,5,3,2,'#f0f0f0'],[5,6,1,1,'#1a0a10'],[10,6,1,1,'#1a0a10'],
  [4,8,8,1,'#c04080'],
  [2,9,12,5,'#f080c0'],[1,10,14,3,'#f080c0'],
  [3,13,10,1,'#1a1a1a'],[3,14,4,2,'#f0f0f0'],[9,14,4,2,'#f0f0f0'],
]
const SASUKE_RECTS = [
  [3,0,10,5,'#0a0a14'],[2,1,12,4,'#0a0a14'],[1,2,2,3,'#0a0a14'],[13,1,2,5,'#0a0a14'],
  [4,5,8,5,'#e8d8c8'],[3,6,1,3,'#e8d8c8'],[12,6,1,3,'#e8d8c8'],
  [5,7,2,1,'#c83020'],[9,7,2,1,'#c83020'],[7,9,2,1,'#906050'],
  [3,10,10,4,'#1a1a40'],[2,11,1,3,'#1a1a40'],[13,11,1,3,'#1a1a40'],
  [7,10,2,1,'#c83020'],[4,14,3,2,'#0a0a20'],[9,14,3,2,'#0a0a20'],
]
const DONKEYKONG_RECTS = [
  [3,2,10,5,'#3a2010'],[2,3,12,4,'#3a2010'],
  [4,4,8,5,'#5a3520'],[3,5,10,3,'#5a3520'],
  [5,7,6,3,'#c8a080'],
  [5,5,2,2,'#f0f0f0'],[9,5,2,2,'#f0f0f0'],[5,5,1,1,'#1a1a1a'],[9,5,1,1,'#1a1a1a'],
  [7,8,2,1,'#2a1808'],[6,9,4,1,'#2a1808'],
  [7,10,2,4,'#c82020'],[6,10,4,1,'#c82020'],
  [3,9,10,5,'#3a2010'],[2,10,12,3,'#3a2010'],
  [0,9,3,4,'#3a2010'],[13,9,3,4,'#3a2010'],
  [4,14,3,2,'#3a2010'],[9,14,3,2,'#3a2010'],
]
const FRIEREN_RECTS = [
  [4,0,8,2,'#d0d0e0'],[3,1,10,4,'#d0d0e0'],[2,2,2,10,'#d0d0e0'],[12,2,2,10,'#d0d0e0'],
  [1,5,2,1,'#e8c8a0'],[13,5,2,1,'#e8c8a0'],[0,4,2,1,'#e8c8a0'],[14,4,2,1,'#e8c8a0'],
  [4,4,8,5,'#f0e0d0'],[3,5,10,3,'#f0e0d0'],
  [5,6,2,1,'#60a060'],[9,6,2,1,'#60a060'],[7,8,2,1,'#c09080'],
  [3,9,10,5,'#4a7a40'],[2,10,12,3,'#4a7a40'],[3,9,10,1,'#1a2a18'],
  [14,7,1,8,'#8a6040'],[13,6,3,1,'#c0a060'],
  [5,14,2,2,'#2a5020'],[9,14,2,2,'#2a5020'],
]
const ITADORI_RECTS = [
  [4,0,8,4,'#e060a0'],[3,1,10,3,'#e060a0'],[2,2,2,2,'#e060a0'],[12,2,2,2,'#e060a0'],
  [4,4,8,5,'#e0b890'],[3,5,1,3,'#e0b890'],[12,5,1,3,'#e0b890'],
  [5,6,2,1,'#603020'],[9,6,2,1,'#603020'],
  [4,5,2,1,'#1a0808'],[10,5,2,1,'#1a0808'],[6,8,4,1,'#904040'],
  [3,10,10,4,'#1a1a2a'],[2,11,12,3,'#1a1a2a'],
  [6,9,4,2,'#f0f0f0'],[7,9,2,2,'#1a1a2a'],
  [4,14,3,2,'#0a0a1a'],[9,14,3,2,'#0a0a1a'],
]
const JIRAIYA_RECTS = [
  [3,0,10,4,'#e0e0e0'],[2,1,12,3,'#e0e0e0'],[1,2,2,8,'#e0e0e0'],[13,2,2,8,'#e0e0e0'],
  [4,4,8,5,'#c08050'],[3,5,10,3,'#c08050'],
  [3,6,3,1,'#c03030'],[10,6,3,1,'#c03030'],
  [5,6,2,1,'#1a1a00'],[9,6,2,1,'#1a1a00'],[5,8,6,1,'#808080'],
  [3,9,10,5,'#4a8030'],[2,10,12,3,'#4a8030'],
  [5,9,6,4,'#c03030'],[4,14,3,2,'#2a5020'],[9,14,3,2,'#2a5020'],
]
const MAGMAR_RECTS = [
  [5,0,6,2,'#ff8c00'],[6,0,4,1,'#ffc040'],[4,1,8,3,'#e05020'],
  [3,4,10,6,'#c83020'],[2,5,12,4,'#c83020'],
  [5,5,6,4,'#f0c040'],[4,4,8,4,'#e05020'],[5,5,6,3,'#f0c040'],
  [5,5,2,2,'#f0f080'],[9,5,2,2,'#f0f080'],[5,5,1,1,'#c03020'],[9,5,1,1,'#c03020'],
  [6,7,4,1,'#c08020'],
  [1,5,2,4,'#c83020'],[13,5,2,4,'#c83020'],[0,7,2,1,'#ff8c00'],[14,7,2,1,'#ff8c00'],
  [6,10,4,2,'#ff8c00'],[7,12,2,2,'#ffc040'],
  [4,10,3,4,'#c83020'],[9,10,3,4,'#c83020'],
]
const DONQUIJOTE_RECTS = [
  [4,0,8,6,'#909090'],[3,1,10,5,'#a0a0a0'],[2,2,12,3,'#b0b0b0'],
  [4,4,8,2,'#707070'],[5,5,6,1,'#505050'],
  [11,0,1,4,'#e04040'],[10,1,3,1,'#e04040'],
  [5,6,6,3,'#d4a070'],[5,8,6,1,'#8a6040'],
  [5,9,6,5,'#909090'],[4,10,8,3,'#a0a0a0'],
  [7,10,2,3,'#c0c0c0'],[5,11,6,1,'#c0c0c0'],
  [13,0,1,16,'#8a6040'],[13,0,2,2,'#c0c0c0'],
  [5,14,2,2,'#808080'],[9,14,2,2,'#808080'],
]
const FRIEZA_RECTS = [
  [4,0,8,6,'#e8e0f0'],[3,1,10,5,'#e8e0f0'],
  [3,0,2,3,'#8040c0'],[11,0,2,3,'#8040c0'],
  [3,3,3,2,'#9050d0'],[10,3,3,2,'#9050d0'],
  [5,4,2,1,'#d02020'],[9,4,2,1,'#d02020'],[6,6,4,1,'#c0b0e0'],
  [4,7,8,5,'#e8e0f0'],[3,8,10,4,'#e8e0f0'],
  [3,7,4,3,'#9050d0'],[9,7,4,3,'#9050d0'],
  [7,12,2,3,'#9050d0'],[8,14,3,1,'#9050d0'],
  [4,12,3,3,'#e8e0f0'],[9,12,3,3,'#e8e0f0'],
]
const HISOKA_RECTS = [
  [5,0,6,1,'#e040a0'],[4,1,8,3,'#e040a0'],[3,2,2,4,'#e040a0'],[11,1,3,4,'#e040a0'],
  [4,4,8,5,'#f0e8e0'],[3,5,10,3,'#f0e8e0'],
  [4,6,2,1,'#e03060'],[10,5,2,2,'#40a0c0'],[11,6,1,1,'#40a0c0'],
  [5,6,2,1,'#d0a020'],[9,6,2,1,'#d0a020'],[6,8,4,1,'#c06040'],
  [3,9,5,5,'#c02020'],[8,9,5,5,'#2060c0'],
  [3,11,5,1,'#2060c0'],[8,11,5,1,'#c02020'],
  [4,14,3,2,'#1a1a40'],[9,14,3,2,'#1a1a40'],
]
const CHAINSAWMAN_RECTS = [
  [3,0,10,6,'#808090'],[2,1,12,4,'#9090a0'],
  [3,0,2,2,'#c0c0c0'],[7,0,2,2,'#c0c0c0'],[11,0,2,2,'#c0c0c0'],
  [6,2,4,2,'#cc2020'],[5,3,2,1,'#ff2020'],[9,3,2,1,'#ff2020'],
  [3,6,10,6,'#1a1a2a'],[2,7,12,4,'#1a1a2a'],
  [5,7,2,2,'#aa1010'],[9,8,3,1,'#aa1010'],
  [0,7,3,2,'#808090'],[13,7,3,2,'#1a1a2a'],
  [0,6,1,1,'#c0c0c0'],[0,8,1,1,'#c0c0c0'],
  [4,12,3,4,'#0a0a1a'],[9,12,3,4,'#0a0a1a'],
]
const SUSUWATARI_RECTS = [
  [6,4,5,5,'#1a1a20'],[5,5,7,3,'#1a1a20'],
  [5,3,1,2,'#1a1a20'],[7,3,1,2,'#1a1a20'],[9,3,1,2,'#1a1a20'],
  [11,4,1,2,'#1a1a20'],[4,5,1,2,'#1a1a20'],
  [6,5,2,2,'#f0f0f0'],[9,5,2,2,'#f0f0f0'],[7,6,1,1,'#1a1a20'],[10,6,1,1,'#1a1a20'],
  [2,8,3,3,'#1a1a20'],[1,9,5,2,'#1a1a20'],
  [2,7,1,2,'#1a1a20'],[4,7,1,1,'#1a1a20'],
  [2,9,1,1,'#f0f0f0'],[4,9,1,1,'#f0f0f0'],
  [11,9,3,3,'#1a1a20'],[10,10,5,2,'#1a1a20'],
  [11,8,1,2,'#1a1a20'],[13,8,1,2,'#1a1a20'],
  [11,10,1,1,'#f0f0f0'],[13,10,1,1,'#f0f0f0'],
]
const LEYENDA_RECTS = [
  [4,2,8,12,'#0a0a14'],[3,4,10,8,'#0a0a14'],
  [7,7,2,2,'#ffd700'],[6,6,4,4,'#ffd700'],
  [7,5,2,1,'#ffd700'],[7,11,2,1,'#ffd700'],
  [5,7,2,1,'#ffd700'],[9,7,2,1,'#ffd700'],
]

export const PERSONAJES = [
  { id:'gon', nombre:'Gon', nivelDesbloqueo:1, glowColor:'#00a84a', rects: GON_RECTS, frases: [
    "¡Si me esfuerzo, lo consigo! ¡Siempre!",
    "El miedo no existe si quieres de verdad.",
    "¿Por qué preocuparte? ¡Solo hazlo!",
    "Los amigos son más importantes que ganar.",
    "Cada día es una nueva aventura esperando.",
    "¡La dificultad hace que valga más!",
    "No finjas. Siente. Actúa desde ahí.",
    "El cuerpo sabe más que la mente a veces.",
    "Cuando te caes, te levantas. Así es.",
    "Lo que amas hacer, hazlo con todo.",
    "No necesitas razones para ser bueno.",
    "La fuerza real viene del corazón.",
    "Disfruta el camino, no solo la meta.",
    "¡Un día más es un día ganado!",
    "Si lo decides de verdad, pasa.",
  ]},
  { id:'pikachu', nombre:'Pikachu', nivelDesbloqueo:2, glowColor:'#f8d030', rects: PIKACHU_RECTS, frases: [
    "¡La lealtad vale más que mil victorias!",
    "Pequeño pero constante: así gano yo.",
    "Cada chispa cuenta. No desestimes la tuya.",
    "El equipo que te apoya te hace más fuerte.",
    "Hoy también puedes sorprenderte a ti mismo.",
    "La energía no falta cuando hay propósito.",
    "Lo que proteges crece. ¿Qué proteges hoy?",
    "Un paso pequeño también hace historia.",
    "No necesitas ser el más grande. Sé el más fiel.",
    "La confianza se construye con actos, no palabras.",
    "¡Tu potencial aún no ha explotado del todo!",
    "Cada relámpago empieza con una chispa.",
    "Hoy haz algo que mañana te alegre.",
    "La persistencia supera al talento.",
    "¡Vamos! No hay tiempo para rendirse.",
  ]},
  { id:'killua', nombre:'Killua', nivelDesbloqueo:3, glowColor:'#60b0e0', rects: KILLUA_RECTS, frases: [
    "Para. Respira. Piensa. Ahora actúa.",
    "El miedo es información. Úsalo.",
    "Quejarse no te acerca a ninguna meta.",
    "Si no puedes cambiarlo, deja de pensar en ello.",
    "La intensidad sin dirección es ruido.",
    "No necesitas aprobación para avanzar.",
    "Ser eficiente no es ser frío. Es respetar tu tiempo.",
    "Lo que no practicas, lo pierdes. Simple.",
    "¿Cuánto tiempo le dedicas a lo que importa?",
    "El talento sin trabajo es solo potencial.",
    "No te cuentes historias. Solo actúa.",
    "La velocidad es inútil sin dirección correcta.",
    "Conocerte bien es tu mayor arma.",
    "Deja de esperar el momento perfecto.",
    "Lo que decides hoy define quién eres mañana.",
  ]},
  { id:'totoro', nombre:'Totoro', nivelDesbloqueo:4, glowColor:'#7a8a94', rects: TOTORO_RECTS, frases: [
    "Los árboles crecen lento. Son los más fuertes.",
    "El silencio también es una respuesta.",
    "La naturaleza no se apresura. Y sin embargo, llega.",
    "Lo que cuidas con amor, florece sin prisa.",
    "Hay sabiduría en el descanso consciente.",
    "Las raíces invisibles sostienen todo lo visible.",
    "Cada pequeño ser merece ser visto.",
    "El viento no se ve. Pero mueve el mundo.",
    "Algunas cosas toman su tiempo. Y está bien.",
    "Hoy también hay maravillas si sabes mirar.",
    "La paciencia es la forma más activa de esperar.",
    "Cada estación tiene su regalo particular.",
    "Lo que perdura fue sembrado con tiempo.",
    "Un bosque empieza con una sola semilla.",
    "La calma por dentro crea calma por fuera.",
  ]},
  { id:'goku', nombre:'Goku', nivelDesbloqueo:5, glowColor:'#e06820', rects: GOKU_RECTS, frases: [
    "¡Siempre hay un nivel más! ¡Sube!",
    "El entrenamiento de hoy es la fuerza de mañana.",
    "Los límites están para superarlos. Así de simple.",
    "Come bien, duerme bien, entrena fuerte.",
    "La batalla más importante es contra ti mismo.",
    "No importa cuántas veces caigas. ¡Levántate!",
    "Un guerrero no busca la pelea. Busca el crecimiento.",
    "¡Tu potencial no tiene techo si no se lo pones tú!",
    "El esfuerzo honesto siempre da frutos.",
    "Ser fuerte es proteger lo que amas.",
    "Nada es imposible si tienes determinación real.",
    "Cada día que entrenas es un día ganado.",
    "La fuerza sin corazón no sirve de nada.",
    "¡Hoy supera al de ayer! Solo eso.",
    "El camino del guerrero es el camino del crecimiento.",
  ]},
  { id:'naruto', nombre:'Naruto', nivelDesbloqueo:6, glowColor:'#e06020', rects: NARUTO_RECTS, frases: [
    "¡No me rindo! ¡Esa es mi forma de vivir!",
    "Camina hacia tu sueño aunque nadie crea en él.",
    "Quien no cree en ti no te conoce aún.",
    "El dolor te enseña. No te detiene.",
    "Protege lo que amas. Ese es el verdadero poder.",
    "La soledad también es parte del camino.",
    "Los que te subestiman no saben lo que viene.",
    "¡Trabaja duro y el reconocimiento llega solo!",
    "Creer en ti mismo es el primer paso de todo.",
    "No hay nadie en el mundo exactamente como tú.",
    "Tu historia no ha terminado. Sigue escribiéndola.",
    "Ser diferente no es una debilidad. Es tu fuerza.",
    "¡Haz que hoy merezca ser recordado!",
    "La persistencia vence a todos los obstáculos.",
    "Tu mayor rival eres tú. Y puedes superarte.",
  ]},
  { id:'megaman', nombre:'Megaman', nivelDesbloqueo:7, glowColor:'#2060d0', rects: MEGAMAN_RECTS, frases: [
    "Analiza, planifica, ejecuta. En ese orden.",
    "Cada sistema puede mejorarse. Incluido tú.",
    "La consistencia es el algoritmo del éxito.",
    "Un error no es fallo. Es un dato para mejorar.",
    "Optimiza tus rutinas y multiplica tus resultados.",
    "La precisión requiere práctica sostenida.",
    "Cada pequeña mejora se acumula con el tiempo.",
    "¿Cuál es el siguiente paso lógico? Hazlo.",
    "El sistema que construyes hoy trabaja mañana.",
    "Mide, ajusta, mejora. Repite.",
    "La disciplina es el código que no falla.",
    "Los hábitos son programas. Elige los tuyos bien.",
    "No improvises lo que puedes sistematizar.",
    "Una tarea a la vez, completada al 100%.",
    "El progreso constante supera al genio esporádico.",
  ]},
  { id:'majinboo', nombre:'Majin Boo', nivelDesbloqueo:8, glowColor:'#f080c0', rects: MAJINBOO_RECTS, frases: [
    "¡Boo feliz cuando tú haces cosas buenas!",
    "Comer bien es importante. Para todo.",
    "A veces la respuesta más simple es la mejor.",
    "¡Jugar también es trabajar! ¡En serio!",
    "Si algo no te gusta, cámbialo. Ya.",
    "Boo sabe que el corazón manda más que la cabeza.",
    "Las cosas simples son las más valiosas.",
    "¿Eres feliz hoy? Si no, ¿qué puedes cambiar?",
    "No compliques lo que puede ser sencillo.",
    "El amor se nota en lo que haces, no en lo que dices.",
    "¡Boo dice: descansa cuando necesites descansar!",
    "La alegría pequeña también cuenta como alegría.",
    "¿Por qué esperar para ser feliz? ¡Ahora!",
    "Las grandes decisiones vienen del corazón.",
    "Boo aprendió: el bien regresa siempre.",
  ]},
  { id:'sasuke', nombre:'Sasuke', nivelDesbloqueo:9, glowColor:'#c83020', rects: SASUKE_RECTS, frases: [
    "La soledad también puede ser una fortaleza.",
    "Conoce tu objetivo. Todo lo demás es ruido.",
    "No necesitas que nadie te entienda. Solo actúa.",
    "Los que fueron heridos pueden proteger mejor.",
    "El poder sin propósito es vacío.",
    "No sigas a la multitud. Sigue tu camino.",
    "La oscuridad no te define. Lo que haces con ella, sí.",
    "Fortaleza real: seguir después de romper.",
    "Aprende de los errores. Pero no te quedes ahí.",
    "El pasado explica. No justifica.",
    "Quien no puede estar solo, depende de los demás.",
    "La frialdad a veces es claridad mal entendida.",
    "Un objetivo claro supera a toda la motivación.",
    "No necesitas aprobación para avanzar en tu camino.",
    "Quien más avanza es quien menos se queja.",
  ]},
  { id:'donkeykong', nombre:'Donkey Kong', nivelDesbloqueo:10, glowColor:'#8a6040', rects: DONKEYKONG_RECTS, frases: [
    "¡La fuerza viene de proteger lo que amas!",
    "¡Simple y directo: trabaja, descansa, repite!",
    "La familia es el tesoro más grande.",
    "¡No te rindas! ¡Tú puedes más de lo que crees!",
    "A veces la solución está en ir directo al problema.",
    "¡La naturaleza sana lo que el mundo rompe!",
    "Un gorila no se rinde. Tú tampoco.",
    "¡Hoy protege lo que mañana agradecerás!",
    "La fuerza física y la mental van de la mano.",
    "¡Celebra los logros pequeños también!",
    "¡Los obstáculos son trampolines si los ves bien!",
    "El ritmo constante vence a la velocidad caótica.",
    "¡Tus raíces son tu fuerza! No las olvides.",
    "A veces hay que golpear fuerte. Pero con propósito.",
    "¡Hoy también puedes ser el héroe de tu historia!",
  ]},
  { id:'frieren', nombre:'Frieren', nivelDesbloqueo:11, glowColor:'#d0d0e0', rects: FRIEREN_RECTS, frases: [
    "Lo que parece lento desde dentro es veloz desde afuera.",
    "Mil años de práctica empezaron con un día.",
    "El tiempo es el recurso más subestimado.",
    "Algunos frutos tardan décadas. Vale la pena esperar.",
    "Lo que aprendes hoy lo usarás cuando menos lo esperes.",
    "La perspectiva cambia todo. Amplía la tuya.",
    "Lo que parece insignificante puede ser decisivo.",
    "No tengas prisa. Tienes más tiempo del que crees.",
    "El aprendizaje lento es el más duradero.",
    "Cada persona que encuentras te enseña algo.",
    "El pasado no se borra. Se integra y se supera.",
    "Lo que haces con constancia define tu legado.",
    "No subestimes los momentos tranquilos. Forman carácter.",
    "La magia no es instantánea. Se construye.",
    "Haz hoy lo que dentro de 10 años agradecerás.",
  ]},
  { id:'itadori', nombre:'Itadori', nivelDesbloqueo:12, glowColor:'#e060a0', rects: ITADORI_RECTS, frases: [
    "El dolor de los demás también es tuyo si eliges cargarlo.",
    "Ser humano es la decisión más difícil y la más importante.",
    "No perder lo que te importa: esa es la verdadera fuerza.",
    "La empatía no es debilidad. Es tu mayor poder.",
    "Cada persona merece morir rodeada de amor.",
    "Lo que proteges hoy se convierte en tu legado.",
    "Sentir profundamente es un regalo, no una carga.",
    "La humanidad no es perfecta. Es valiosa.",
    "El corazón fuerte es el que también siente el dolor ajeno.",
    "¿Por qué actúas? Eso define lo que eres.",
    "No necesitas ser indestructible. Solo resiliente.",
    "Las cicatrices muestran que seguiste adelante.",
    "Ayudar a uno es cambiar el mundo de ese uno.",
    "El miedo a perder te hace luchar más fuerte.",
    "Ser ordinario y dar el 100% es extraordinario.",
  ]},
  { id:'jiraiya', nombre:'Jiraiya', nivelDesbloqueo:13, glowColor:'#e0e0e0', rects: JIRAIYA_RECTS, frases: [
    "El mejor maestro es la vida vivida sin miedo.",
    "Escribe tu historia. Nadie más lo hará por ti.",
    "El amor y el dolor son los mejores maestros.",
    "Creer en alguien es a veces el empuje que necesita.",
    "No te avergüences de haber fallado. Avergüénzate de no intentarlo.",
    "La sabiduría no se busca. Se construye con errores.",
    "Un buen maestro ve el potencial antes que el alumno.",
    "Vive de forma que valga la pena escribirla.",
    "Las grandes historias tienen grandes caídas y grandes alzas.",
    "El ego es el enemigo de todo aprendizaje real.",
    "Aprende de cada persona que encuentres. Todas saben algo.",
    "La valentía no es ausencia de miedo. Es actuar con él.",
    "Los mejores momentos no se planean. Se viven.",
    "Nunca dejes de preguntarte. La curiosidad es vida.",
    "El legado real es lo que haces por los que vienen después.",
  ]},
  { id:'magmar', nombre:'Magmar', nivelDesbloqueo:14, glowColor:'#ff8c00', rects: MAGMAR_RECTS, frases: [
    "¡Sin fuego no hay forja! ¡Arde hoy!",
    "La pasión sin dirección quema. Con dirección, crea.",
    "¡El calor del esfuerzo derrite todos los obstáculos!",
    "Quien teme el fuego nunca verá la luz.",
    "¡Intensidad total o no empieces!",
    "El volcán que explota liberó siglos de presión.",
    "¡Que tu energía de hoy sea leyenda mañana!",
    "No hay llama pequeña cuando el combustible es pasión.",
    "¡Arde! Pero arde con propósito.",
    "La temperatura del alma define los resultados.",
    "¡Hoy no es día de tibiezas! ¡Fuego total!",
    "El calor interno calienta todo lo que rodeas.",
    "¡Tu entusiasmo es contagioso! Úsalo.",
    "No apagues tu fuego por el miedo de otros.",
    "¡Cada gran obra nació del calor de la dedicación!",
  ]},
  { id:'donquijote', nombre:'Don Quijote', nivelDesbloqueo:15, glowColor:'#c0c0c0', rects: DONQUIJOTE_RECTS, frases: [
    "Los imposibles son solo sueños con más obstáculos.",
    "Quien no tiene sueños, ya está dormido.",
    "La aventura no espera al momento perfecto.",
    "Un libro abierto es un mundo sin fronteras.",
    "No importa si eres el único que cree en tu causa.",
    "Los gigantes son a veces molinos. Y los molinos, gigantes.",
    "El caballero que cae se levanta con más honor.",
    "Imagina el mejor tú posible. Luego persíguele.",
    "El ideal perfecto guía mejor que la realidad imperfecta.",
    "El ridículo es el precio de la grandeza.",
    "¿Qué harías si supieras que no puedes fallar?",
    "Las hazañas más grandes empezaron con un loco.",
    "Nunca abandones lo que crees verdadero.",
    "La locura con propósito es la más lúcida de las decisiones.",
    "Tu historia es épica si decides escribirla así.",
  ]},
  { id:'frieza', nombre:'Frieza', nivelDesbloqueo:16, glowColor:'#9050d0', rects: FRIEZA_RECTS, frases: [
    "La eficiencia es la forma más elegante de dominar.",
    "El poder no se pide. Se construye en silencio.",
    "La debilidad es una elección, no un destino.",
    "Mientras otros duermen, los grandes se preparan.",
    "El mérito no espera; él avanza solo.",
    "Controla tus emociones y controlarás tu destino.",
    "No se trata de ser cruel. Se trata de ser imparable.",
    "El que no evoluciona, es superado. Así de simple.",
    "La ambición bien dirigida es combustible puro.",
    "Nunca subestimes el valor de la preparación.",
    "Un plan ejecutado supera a mil ideas flotantes.",
    "El universo premia a los que actúan con precisión.",
    "La excelencia no es arrogancia. Es estándar.",
    "Quien no se exige a sí mismo, no puede exigir nada.",
    "Cada límite superado abre el siguiente nivel.",
  ]},
  { id:'hisoka', nombre:'Hisoka', nivelDesbloqueo:17, glowColor:'#e040a0', rects: HISOKA_RECTS, frases: [
    "La vida es el juego más emocionante que existe.",
    "Lo interesante sucede en el límite del riesgo.",
    "Conoce tu valor. Nadie más te lo dará.",
    "El destino favorece a los que hacen movidas audaces.",
    "La previsibilidad es el enemigo del progreso.",
    "¿Cuándo fue la última vez que te sorprendiste a ti mismo?",
    "Los mejores momentos no son seguros. Son intensos.",
    "Quien no arriesga nada, no gana nada real.",
    "Lo que te incomoda es exactamente donde debes mirar.",
    "El aburrimiento es una señal de que necesitas un cambio.",
    "No temas el caos. A veces viene con oportunidades.",
    "La incertidumbre es el hogar del valiente.",
    "¿Qué pasaría si lo intentaras sin garantías?",
    "El potencial sin riesgo es solo una idea sin vida.",
    "Juega tu propio juego. No el de los demás.",
  ]},
  { id:'chainsawman', nombre:'Chainsaw Man', nivelDesbloqueo:18, glowColor:'#cc2020', rects: CHAINSAWMAN_RECTS, frases: [
    "A veces la respuesta más honesta es la más bruta.",
    "¿Qué quieres realmente? Eso. Ve por eso.",
    "No te hagas complicado. Siente, decide, actúa.",
    "El instinto también es sabiduría. Escúchalo.",
    "La supervivencia requiere claridad sobre lo importante.",
    "Los sueños pequeños también merecen lucha total.",
    "No finjas que no quieres lo que quieres.",
    "A veces hay que romper algo para avanzar.",
    "La honestidad bruta supera a la diplomacia vacía.",
    "¿Estás vivo de verdad o solo existiendo?",
    "El dolor te avisa que algo importa. Escúchalo.",
    "Lo crudo y lo real tienen su propia belleza.",
    "Hoy: una cosa. Hazla con todo.",
    "No necesitas aprobación para perseguir lo tuyo.",
    "Quien sabe lo que quiere, llega más lejos.",
  ]},
  { id:'susuwatari', nombre:'Susuwatari', nivelDesbloqueo:19, glowColor:'#404050', rects: SUSUWATARI_RECTS, frases: [
    "Los pequeños también importan. Tú también importas.",
    "La presencia silenciosa puede ser el mayor apoyo.",
    "No hace falta hablar para estar ahí.",
    "Hay fuerza en la ternura. No la subestimes.",
    "Los pequeños gestos mueven mundos enteros.",
    "Estar presente es suficiente. No siempre necesitas más.",
    "La gentileza no es debilidad. Es elección.",
    "Cuida a los pequeños. Ellos ven lo que los grandes ignoran.",
    "Un abrazo a tiempo vale más que mil palabras.",
    "Lo que parece insignificante sostiene lo que parece grande.",
    "La calma también es una forma de acompañar.",
    "Hoy cuida algo pequeño con atención total.",
    "Los momentos silenciosos también forman vínculos.",
    "La delicadeza y la fortaleza pueden coexistir.",
    "Un pequeño acto de amor cambia el día de alguien.",
  ]},
  { id:'leyenda', nombre:'???', nivelDesbloqueo:20, glowColor:'#ffd700', rects: LEYENDA_RECTS, frases: [
    "Quien llega aquí sabe que el camino es infinito.",
    "La leyenda no es el destino. Es la decisión de seguir.",
    "Todo lo que buscabas estaba dentro de ti.",
    "El poder más grande es el que se usa para dar.",
    "Ya no necesitas pruebas. Solo presencia.",
    "Lo que construiste con paciencia, nadie te lo quita.",
    "El tiempo revela lo que el esfuerzo sembró.",
    "Los que llegan lejos no corrieron más. Pararon menos.",
    "La verdadera victoria no tiene testigos. Solo tú la sabes.",
    "Ahora eres el ejemplo que alguna vez buscaste.",
    "Lo que dejaste atrás te hizo quien eres aquí.",
    "La leyenda no se declara. Se vive.",
    "El mayor nivel siempre es el siguiente.",
    "Has llegado lejos. Pero lo más importante fue el viaje.",
    "Tu historia inspira aunque nunca la cuentes.",
  ]},
]

export function PersonajeSprite({ personaje, size = 32 }) {
  if (!personaje) return null
  return (
    <svg width={size} height={size} viewBox="0 0 16 16"
         style={{ imageRendering: 'pixelated', display: 'block' }}>
      {personaje.rects.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  )
}

/** Devuelve el personaje de mayor nivel desbloqueado dado un nivelGlobal */
export function getPersonajeActivo(nivelGlobalActual) {
  const desbloqueados = PERSONAJES.filter(p => p.nivelDesbloqueo <= nivelGlobalActual)
  return desbloqueados.length > 0 ? desbloqueados[desbloqueados.length - 1] : PERSONAJES[0]
}

/** Devuelve el personaje que se desbloquea al pasar de nivelAnterior a nivelNuevo */
export function detectarPersonajeDesbloqueado(nivelAnterior, nivelNuevo) {
  return PERSONAJES.find(p => p.nivelDesbloqueo > nivelAnterior && p.nivelDesbloqueo <= nivelNuevo) || null
}
