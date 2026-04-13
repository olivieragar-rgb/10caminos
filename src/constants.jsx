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
  { id:'gon',        nombre:'Gon',          nivelDesbloqueo:1,  glowColor:'#00a84a', rects: GON_RECTS },
  { id:'pikachu',    nombre:'Pikachu',       nivelDesbloqueo:2,  glowColor:'#f8d030', rects: PIKACHU_RECTS },
  { id:'killua',     nombre:'Killua',        nivelDesbloqueo:3,  glowColor:'#60b0e0', rects: KILLUA_RECTS },
  { id:'totoro',     nombre:'Totoro',        nivelDesbloqueo:4,  glowColor:'#7a8a94', rects: TOTORO_RECTS },
  { id:'goku',       nombre:'Goku',          nivelDesbloqueo:5,  glowColor:'#e06820', rects: GOKU_RECTS },
  { id:'naruto',     nombre:'Naruto',        nivelDesbloqueo:6,  glowColor:'#e06020', rects: NARUTO_RECTS },
  { id:'megaman',    nombre:'Megaman',       nivelDesbloqueo:7,  glowColor:'#2060d0', rects: MEGAMAN_RECTS },
  { id:'majinboo',   nombre:'Majin Boo',     nivelDesbloqueo:8,  glowColor:'#f080c0', rects: MAJINBOO_RECTS },
  { id:'sasuke',     nombre:'Sasuke',        nivelDesbloqueo:9,  glowColor:'#c83020', rects: SASUKE_RECTS },
  { id:'donkeykong', nombre:'Donkey Kong',   nivelDesbloqueo:10, glowColor:'#8a6040', rects: DONKEYKONG_RECTS },
  { id:'frieren',    nombre:'Frieren',       nivelDesbloqueo:11, glowColor:'#d0d0e0', rects: FRIEREN_RECTS },
  { id:'itadori',    nombre:'Itadori',       nivelDesbloqueo:12, glowColor:'#e060a0', rects: ITADORI_RECTS },
  { id:'jiraiya',    nombre:'Jiraiya',       nivelDesbloqueo:13, glowColor:'#e0e0e0', rects: JIRAIYA_RECTS },
  { id:'magmar',     nombre:'Magmar',        nivelDesbloqueo:14, glowColor:'#ff8c00', rects: MAGMAR_RECTS },
  { id:'donquijote', nombre:'Don Quijote',   nivelDesbloqueo:15, glowColor:'#c0c0c0', rects: DONQUIJOTE_RECTS },
  { id:'frieza',     nombre:'Frieza',        nivelDesbloqueo:16, glowColor:'#9050d0', rects: FRIEZA_RECTS },
  { id:'hisoka',     nombre:'Hisoka',        nivelDesbloqueo:17, glowColor:'#e040a0', rects: HISOKA_RECTS },
  { id:'chainsawman',nombre:'Chainsaw Man',  nivelDesbloqueo:18, glowColor:'#cc2020', rects: CHAINSAWMAN_RECTS },
  { id:'susuwatari', nombre:'Susuwatari',    nivelDesbloqueo:19, glowColor:'#404050', rects: SUSUWATARI_RECTS },
  { id:'leyenda',    nombre:'???',           nivelDesbloqueo:20, glowColor:'#ffd700', rects: LEYENDA_RECTS },
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
