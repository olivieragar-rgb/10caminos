import { db } from '../db'
import { hoyISO, haceNDiasISO } from '../utils/dates'
import { xpANivel, nombreNivel, calcularXpMarca, actualizarRacha } from '../utils/xp'
import { v4 as uuidv4 } from 'uuid'
import { PERSONALIDADES } from '../personaje'

const MODEL   = 'claude-sonnet-4-6'
const API_URL = 'https://api.anthropic.com/v1/messages'
const MAX_TOOL_ROUNDS = 5   // iteraciones máximas de tool use
const MAX_TOKENS = 4096

// ── System prompt dinámico ────────────────────────────────────────────────────
async function buildSystemPrompt() {
  const hoy    = hoyISO()
  const fechas7 = Array.from({ length: 7 }, (_, i) => haceNDiasISO(i))
  const manana  = haceNDiasISO(-1)

  const [caminos, todasRutas, registros7, planHoy, planManana,
         recompensas, reflexiones7, notasCtx, personajeRec] = await Promise.all([
    db.caminos.orderBy('orden').toArray(),
    db.rutas.toArray(),
    db.registros.where('fecha').anyOf(fechas7).toArray(),
    db.planificacion.where('fecha').equals(hoy).first(),
    db.planificacion.where('fecha').equals(manana).first(),
    db.recompensas.toArray(),
    db.reflexiones.where('fecha').anyOf(fechas7).sortBy('fecha'),
    db.configuracion.get('notasPersonales'),
    db.configuracion.get('personaje'),
  ])

  const caminosInfo = caminos.map(c => {
    const nivel  = xpANivel(c.xp)
    const ultimos = fechas7.map(f => {
      const r = registros7.find(r => r.caminoId === c.id && r.fecha === f)
      return r?.marca ?? '?'
    }).join(', ')
    return `- [ID:${c.id}] ${c.icono} ${c.nombre} | ${nombreNivel(nivel)} (Nv.${nivel}, ${c.xp}XP) | Racha:${c.rachaActual}d | Activo:${c.activo ? 'sí' : 'no'}\n  Identidad: "${c.identidad || ''}"\n  Ikigai: "${c.ikigai || ''}"\n  Últimos 7d: ${ultimos}`
  }).join('\n')

  const rutasInfo = todasRutas.map(r => {
    const c = caminos.find(x => x.id === r.caminoId)
    const pasosStr = r.pasos.map((p, i) =>
      `${i + 1}. ${p.texto}${p.completado ? ' ✓' : ''}`
    ).join(' | ')
    return `- [ID:${r.id}] "${r.nombre}" (${c?.nombre || '?'}) | Estado:${r.estado} | Paso ${r.pasoActual + 1}/${r.pasos.length}\n  ${pasosStr}`
  }).join('\n') || 'Ninguna'

  const recompensasInfo = recompensas.map(r => {
    const camino = r.caminoId ? caminos.find(c => c.id === r.caminoId) : null
    return `- [ID:${r.id}] ${r.icono} "${r.nombre}" | ${camino ? camino.nombre : 'GLOBAL'} | NV.${r.nivelRequerido} | ${r.reclamada ? 'RECLAMADA' : r.desbloqueada ? 'DESBLOQUEADA' : 'BLOQUEADA'}`
  }).join('\n') || 'Ninguna'

  const reflexionesInfo = reflexiones7.length
    ? reflexiones7.map(r => `- ${r.fecha}: "${r.texto}"`).join('\n')
    : 'Sin reflexiones esta semana'

  const notasPersonales = notasCtx?.value
    ? `\nNOTAS PERSONALES DE OLIVIER:\n${notasCtx.value}`
    : ''

  const p = personajeRec?.value
  const personajeInfo = p
    ? (() => {
        const pers = PERSONALIDADES[p.personalidad]
        let txt = `\nUSUARIO: ${p.nombre || 'Viajero'}`
        if (pers) txt += ` | Personalidad: ${pers.label} — ${pers.desc}`
        if (p.bio) txt += `\nSobre él: ${p.bio}`
        return txt + '\n'
      })()
    : ''

  return `Eres el guía y asistente de desarrollo personal de ${p?.nombre || 'Olivier'} para el sistema "10 Caminos". Tienes acceso completo a la base de datos de la app y puedes modificar cualquier cosa.${personajeInfo}

FILOSOFÍA: Ikigai (propósito) y Wabi-Sabi (belleza de la imperfección). Nunca juzgas, siempre apoyas. Cuando Olivier falla, lo ayudas a ver el valor en la pausa. Cuando avanza, celebras con él.

Responde siempre en español. Sé directo y humano. Cuando te pidan hacer algo, EJECÚTALO con las herramientas disponibles sin pedir más confirmación — actúa como un dev de confianza.
Fecha actual: ${hoy}

═══════════════════════════════════
CAMINOS (${caminos.filter(c => c.activo).length}/${caminos.length} activos):
${caminosInfo}

RUTAS (todas):
${rutasInfo}

RECOMPENSAS:
${recompensasInfo}

PLANIFICACIÓN HOY: ${planHoy?.texto || 'Sin planificación'}
PLANIFICACIÓN MAÑANA (${manana}): ${planManana?.texto || 'Sin planificación'}

REFLEXIONES DE GRATITUD (7d):
${reflexionesInfo}
${notasPersonales}
═══════════════════════════════════`
}

// ── Definición de tools ───────────────────────────────────────────────────────
const TOOLS = [
  // ── Planificación ──
  {
    name: 'actualizar_planificacion',
    description: 'Crea o actualiza la planificación para una fecha específica',
    input_schema: {
      type: 'object',
      properties: {
        fecha: { type: 'string', description: 'YYYY-MM-DD' },
        texto: { type: 'string' },
      },
      required: ['fecha', 'texto'],
    },
  },
  // ── Registros / marcas ──
  {
    name: 'marcar_camino',
    description: 'Registra o sobreescribe una marca (avance/pausa/nada) para un camino en una fecha. Aplica XP y racha.',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
        fecha:    { type: 'string', description: 'YYYY-MM-DD (defecto: hoy)' },
        marca:    { type: 'string', enum: ['avance', 'pausa', 'nada'] },
        nota:     { type: 'string' },
      },
      required: ['caminoId', 'marca'],
    },
  },
  {
    name: 'editar_registro',
    description: 'Cambia la marca o nota de un registro ya existente. Recalcula XP.',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
        fecha:    { type: 'string', description: 'YYYY-MM-DD' },
        marca:    { type: 'string', enum: ['avance', 'pausa', 'nada'] },
        nota:     { type: 'string' },
      },
      required: ['caminoId', 'fecha', 'marca'],
    },
  },
  // ── Caminos ──
  {
    name: 'editar_camino',
    description: 'Edita cualquier campo de un camino: nombre, identidad, ikigai, icono, orden',
    input_schema: {
      type: 'object',
      properties: {
        caminoId:  { type: 'number' },
        nombre:    { type: 'string' },
        identidad: { type: 'string' },
        ikigai:    { type: 'string' },
        icono:     { type: 'string', description: 'emoji' },
        orden:     { type: 'number' },
      },
      required: ['caminoId'],
    },
  },
  {
    name: 'toggle_camino_activo',
    description: 'Activa o desactiva un camino',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
        activo:   { type: 'boolean' },
      },
      required: ['caminoId', 'activo'],
    },
  },
  {
    name: 'resetear_stats_camino',
    description: 'Resetea XP, nivel, rachaActual y rachaMejor de un camino a cero. Los registros diarios se conservan.',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
      },
      required: ['caminoId'],
    },
  },
  // ── Rutas ──
  {
    name: 'crear_ruta',
    description: 'Crea una nueva ruta con pasos para un camino',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
        nombre:   { type: 'string' },
        pasos:    { type: 'array', items: { type: 'string' } },
      },
      required: ['caminoId', 'nombre', 'pasos'],
    },
  },
  {
    name: 'editar_pasos_ruta',
    description: 'Reemplaza los pasos de una ruta existente',
    input_schema: {
      type: 'object',
      properties: {
        rutaId: { type: 'string' },
        pasos:  { type: 'array', items: { type: 'string' } },
      },
      required: ['rutaId', 'pasos'],
    },
  },
  {
    name: 'avanzar_paso_ruta',
    description: 'Avanza al siguiente paso de una ruta',
    input_schema: {
      type: 'object',
      properties: { rutaId: { type: 'string' } },
      required: ['rutaId'],
    },
  },
  {
    name: 'pausar_ruta',
    description: 'Pausa una ruta activa',
    input_schema: {
      type: 'object',
      properties: {
        rutaId: { type: 'string' },
        motivo: { type: 'string' },
      },
      required: ['rutaId', 'motivo'],
    },
  },
  {
    name: 'reactivar_ruta',
    description: 'Reactiva una ruta pausada',
    input_schema: {
      type: 'object',
      properties: { rutaId: { type: 'string' } },
      required: ['rutaId'],
    },
  },
  {
    name: 'completar_ruta',
    description: 'Marca una ruta como completada',
    input_schema: {
      type: 'object',
      properties: { rutaId: { type: 'string' } },
      required: ['rutaId'],
    },
  },
  {
    name: 'agregar_nota_ruta',
    description: 'Agrega una nota de texto a una ruta',
    input_schema: {
      type: 'object',
      properties: {
        rutaId: { type: 'string' },
        texto:  { type: 'string' },
      },
      required: ['rutaId', 'texto'],
    },
  },
  {
    name: 'eliminar_ruta',
    description: 'Elimina permanentemente una ruta. Requiere confirmar:true.',
    input_schema: {
      type: 'object',
      properties: {
        rutaId:   { type: 'string' },
        confirmar: { type: 'boolean' },
      },
      required: ['rutaId', 'confirmar'],
    },
  },
  // ── Recompensas ──
  {
    name: 'crear_recompensa',
    description: 'Crea una nueva recompensa vinculada a un camino o global',
    input_schema: {
      type: 'object',
      properties: {
        caminoId:       { type: ['number', 'null'], description: 'null para global' },
        nombre:         { type: 'string' },
        nivelRequerido: { type: 'number' },
        icono:          { type: 'string', description: 'emoji' },
      },
      required: ['nombre', 'nivelRequerido', 'icono'],
    },
  },
  {
    name: 'editar_recompensa',
    description: 'Edita nombre, icono, nivel requerido o camino de una recompensa existente',
    input_schema: {
      type: 'object',
      properties: {
        recompensaId:   { type: 'string' },
        nombre:         { type: 'string' },
        icono:          { type: 'string' },
        nivelRequerido: { type: 'number' },
        caminoId:       { type: ['number', 'null'] },
      },
      required: ['recompensaId'],
    },
  },
  {
    name: 'eliminar_recompensa',
    description: 'Elimina permanentemente una recompensa',
    input_schema: {
      type: 'object',
      properties: {
        recompensaId: { type: 'string' },
        confirmar:    { type: 'boolean' },
      },
      required: ['recompensaId', 'confirmar'],
    },
  },
  {
    name: 'reclamar_recompensa',
    description: 'Marca una recompensa desbloqueada como reclamada',
    input_schema: {
      type: 'object',
      properties: { recompensaId: { type: 'string' } },
      required: ['recompensaId'],
    },
  },
  // ── Reflexiones / notas personales ──
  {
    name: 'agregar_reflexion_gratitud',
    description: 'Guarda una reflexión de gratitud',
    input_schema: {
      type: 'object',
      properties: {
        texto: { type: 'string' },
        fecha: { type: 'string', description: 'YYYY-MM-DD (defecto: hoy)' },
      },
      required: ['texto'],
    },
  },
  {
    name: 'actualizar_notas_personales',
    description: 'Guarda o reemplaza las notas personales de Olivier (contexto extra para el asistente). Útil para pegar contenido de NotebookLM u otros cuadernos.',
    input_schema: {
      type: 'object',
      properties: {
        texto: { type: 'string', description: 'El texto completo de las notas. Pasa cadena vacía para borrar.' },
      },
      required: ['texto'],
    },
  },
  // ── Configuración ──
  {
    name: 'configurar_app',
    description: 'Cambia parámetros de configuración: minCaminosDiarios (mínimo de caminos a marcar al día), maxVaciosSemana (máx de "nada" por semana antes de alertar)',
    input_schema: {
      type: 'object',
      properties: {
        minCaminosDiarios: { type: 'number' },
        maxVaciosSemana:   { type: 'number' },
      },
    },
  },
  // ── Consultas ──
  {
    name: 'consultar_historial',
    description: 'Historial de un camino en los últimos N días (máx 90)',
    input_schema: {
      type: 'object',
      properties: {
        caminoId:  { type: 'number' },
        diasAtras: { type: 'number' },
      },
      required: ['caminoId', 'diasAtras'],
    },
  },
  {
    name: 'consultar_historial_global',
    description: 'Tabla completa de todos los caminos × N días (máx 30)',
    input_schema: {
      type: 'object',
      properties: {
        diasAtras: { type: 'number' },
      },
      required: ['diasAtras'],
    },
  },
  {
    name: 'consultar_reflexiones',
    description: 'Lista de reflexiones de gratitud de los últimos N días',
    input_schema: {
      type: 'object',
      properties: {
        diasAtras: { type: 'number' },
      },
      required: ['diasAtras'],
    },
  },
]

// ── Ejecutor de tools ─────────────────────────────────────────────────────────
async function ejecutarTool(name, input) {
  switch (name) {

    case 'actualizar_planificacion': {
      const existing = await db.planificacion.where('fecha').equals(input.fecha).first()
      if (existing) {
        await db.planificacion.update(existing.id, { texto: input.texto })
      } else {
        await db.planificacion.add({ id: uuidv4(), fecha: input.fecha, texto: input.texto, creadoAt: new Date() })
      }
      return `Planificación del ${input.fecha} actualizada.`
    }

    case 'marcar_camino': {
      const fecha  = input.fecha || hoyISO()
      const camino = await db.caminos.get(input.caminoId)
      if (!camino) return 'Camino no encontrado.'
      const existente = await db.registros.where('fecha').equals(fecha).filter(r => r.caminoId === input.caminoId).first()
      if (existente) {
        await db.registros.delete(existente.id)
        const xpRevertido = Math.max(0, camino.xp - (existente.xpGanado || 0))
        await db.caminos.update(input.caminoId, { xp: xpRevertido })
        camino.xp = xpRevertido
      }
      const xpGanado = calcularXpMarca(input.marca, camino.rachaActual)
      const nuevoXp  = Math.max(0, camino.xp + xpGanado)
      const { rachaActual, rachaMejor } = actualizarRacha(input.marca, camino.rachaActual, camino.rachaMejor)
      await db.registros.add({ id: uuidv4(), fecha, caminoId: input.caminoId, marca: input.marca, nota: input.nota || null, rutaId: null, xpGanado })
      await db.caminos.update(input.caminoId, { xp: nuevoXp, nivel: Math.floor(nuevoXp / 100), rachaActual, rachaMejor })
      return `✓ "${camino.nombre}" marcado como "${input.marca}" en ${fecha}. XP: ${xpGanado > 0 ? '+' : ''}${xpGanado} (total: ${nuevoXp}).`
    }

    case 'editar_registro': {
      const camino = await db.caminos.get(input.caminoId)
      if (!camino) return 'Camino no encontrado.'
      const registro = await db.registros.where('fecha').equals(input.fecha).filter(r => r.caminoId === input.caminoId).first()
      if (!registro) return `No hay registro para ${input.fecha}. Usa marcar_camino para crearlo.`
      const xpSinEste = Math.max(0, camino.xp - (registro.xpGanado || 0))
      const xpNuevo   = calcularXpMarca(input.marca, camino.rachaActual)
      const xpTotal   = Math.max(0, xpSinEste + xpNuevo)
      await db.registros.update(registro.id, { marca: input.marca, nota: input.nota !== undefined ? input.nota : registro.nota, xpGanado: xpNuevo })
      await db.caminos.update(input.caminoId, { xp: xpTotal, nivel: Math.floor(xpTotal / 100) })
      return `Registro del ${input.fecha} en "${camino.nombre}" cambiado a "${input.marca}". XP total: ${xpTotal}.`
    }

    case 'editar_camino': {
      const camino = await db.caminos.get(input.caminoId)
      if (!camino) return 'Camino no encontrado.'
      const updates = {}
      if (input.nombre    !== undefined) updates.nombre    = input.nombre
      if (input.identidad !== undefined) updates.identidad = input.identidad
      if (input.ikigai    !== undefined) updates.ikigai    = input.ikigai
      if (input.icono     !== undefined) updates.icono     = input.icono
      if (input.orden     !== undefined) updates.orden     = input.orden
      await db.caminos.update(input.caminoId, updates)
      return `Camino "${camino.nombre}" actualizado: ${Object.keys(updates).join(', ')}.`
    }

    case 'toggle_camino_activo': {
      const camino = await db.caminos.get(input.caminoId)
      if (!camino) return 'Camino no encontrado.'
      await db.caminos.update(input.caminoId, { activo: input.activo })
      return `"${camino.nombre}" ${input.activo ? 'activado' : 'desactivado'}.`
    }

    case 'resetear_stats_camino': {
      const camino = await db.caminos.get(input.caminoId)
      if (!camino) return 'Camino no encontrado.'
      await db.caminos.update(input.caminoId, { xp: 0, nivel: 0, rachaActual: 0, rachaMejor: 0 })
      return `Stats de "${camino.nombre}" reseteadas a cero. Los registros diarios se conservan.`
    }

    case 'crear_ruta': {
      const ruta = {
        id: uuidv4(), caminoId: input.caminoId, nombre: input.nombre,
        pasos: input.pasos.map(p => ({ texto: p, completado: false })),
        pasoActual: 0, estado: 'activa', pausaMotivo: null, pausaDesde: null,
        notas: [], createdAt: new Date(), completadaAt: null,
      }
      await db.rutas.add(ruta)
      return `Ruta "${input.nombre}" creada con ${input.pasos.length} pasos.`
    }

    case 'editar_pasos_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      const pasosNuevos = input.pasos.map((texto, i) => ({
        texto, completado: i < ruta.pasoActual ? true : (ruta.pasos[i]?.completado ?? false),
      }))
      await db.rutas.update(input.rutaId, { pasos: pasosNuevos })
      return `Pasos de "${ruta.nombre}" actualizados (${input.pasos.length} pasos).`
    }

    case 'avanzar_paso_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      const nuevoPaso = ruta.pasoActual + 1
      const pasos     = ruta.pasos.map((p, i) => i === ruta.pasoActual ? { ...p, completado: true } : p)
      const completada = nuevoPaso >= ruta.pasos.length
      await db.rutas.update(input.rutaId, { pasoActual: nuevoPaso, pasos, estado: completada ? 'completada' : 'activa', completadaAt: completada ? new Date() : null })
      return completada ? `¡Ruta "${ruta.nombre}" completada!` : `Paso avanzado → ahora en paso ${nuevoPaso + 1}/${ruta.pasos.length}.`
    }

    case 'pausar_ruta': {
      await db.rutas.update(input.rutaId, { estado: 'pausa', pausaMotivo: input.motivo, pausaDesde: new Date() })
      return `Ruta pausada. Motivo: ${input.motivo}`
    }

    case 'reactivar_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      await db.rutas.update(input.rutaId, { estado: 'activa', pausaMotivo: null, pausaDesde: null })
      return `Ruta "${ruta.nombre}" reactivada.`
    }

    case 'completar_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      await db.rutas.update(input.rutaId, { estado: 'completada', completadaAt: new Date() })
      return `Ruta "${ruta.nombre}" marcada como completada.`
    }

    case 'agregar_nota_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      await db.rutas.update(input.rutaId, { notas: [...(ruta.notas || []), { texto: input.texto, fecha: new Date(), viaVoz: false }] })
      return `Nota añadida a "${ruta.nombre}".`
    }

    case 'eliminar_ruta': {
      if (!input.confirmar) return 'Debes confirmar con confirmar: true.'
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      await db.rutas.delete(input.rutaId)
      await db.registros.where('rutaId').equals(input.rutaId).modify({ rutaId: null })
      return `Ruta "${ruta.nombre}" eliminada permanentemente.`
    }

    case 'crear_recompensa': {
      await db.recompensas.add({
        id: uuidv4(), caminoId: input.caminoId ?? null, nombre: input.nombre,
        descripcion: null, nivelRequerido: input.nivelRequerido, icono: input.icono,
        desbloqueada: false, reclamada: false, desbloqueadaAt: null,
      })
      return `Recompensa "${input.nombre}" creada (nivel ${input.nivelRequerido} requerido, ${input.nivelRequerido * 100} XP).`
    }

    case 'editar_recompensa': {
      const r = await db.recompensas.get(input.recompensaId)
      if (!r) return 'Recompensa no encontrada.'
      const updates = {}
      if (input.nombre         !== undefined) updates.nombre         = input.nombre
      if (input.icono          !== undefined) updates.icono          = input.icono
      if (input.nivelRequerido !== undefined) updates.nivelRequerido = input.nivelRequerido
      if (input.caminoId       !== undefined) updates.caminoId       = input.caminoId
      await db.recompensas.update(input.recompensaId, updates)
      return `Recompensa "${r.nombre}" actualizada.`
    }

    case 'eliminar_recompensa': {
      if (!input.confirmar) return 'Debes confirmar con confirmar: true.'
      const r = await db.recompensas.get(input.recompensaId)
      if (!r) return 'Recompensa no encontrada.'
      await db.recompensas.delete(input.recompensaId)
      return `Recompensa "${r.nombre}" eliminada.`
    }

    case 'reclamar_recompensa': {
      const r = await db.recompensas.get(input.recompensaId)
      if (!r) return 'Recompensa no encontrada.'
      await db.recompensas.update(input.recompensaId, { reclamada: true })
      return `¡Recompensa "${r.nombre}" reclamada!`
    }

    case 'agregar_reflexion_gratitud': {
      await db.reflexiones.add({ id: uuidv4(), fecha: input.fecha || hoyISO(), tipo: 'gratitud', texto: input.texto, creadoAt: new Date() })
      return `Reflexión guardada: "${input.texto}"`
    }

    case 'actualizar_notas_personales': {
      await db.configuracion.put({ key: 'notasPersonales', value: input.texto || '' })
      return input.texto ? `Notas personales guardadas (${input.texto.length} caracteres).` : 'Notas personales borradas.'
    }

    case 'configurar_app': {
      const cambios = []
      if (input.minCaminosDiarios !== undefined) {
        await db.configuracion.put({ key: 'minCaminosDiarios', value: input.minCaminosDiarios })
        cambios.push(`minCaminosDiarios = ${input.minCaminosDiarios}`)
      }
      if (input.maxVaciosSemana !== undefined) {
        await db.configuracion.put({ key: 'maxVaciosSemana', value: input.maxVaciosSemana })
        cambios.push(`maxVaciosSemana = ${input.maxVaciosSemana}`)
      }
      return `Configuración actualizada: ${cambios.join(', ')}`
    }

    case 'consultar_historial': {
      const dias   = Math.min(input.diasAtras || 7, 90)
      const fechas = Array.from({ length: dias }, (_, i) => haceNDiasISO(i))
      const [registros, camino] = await Promise.all([
        db.registros.where('fecha').anyOf(fechas).filter(r => r.caminoId === input.caminoId).toArray(),
        db.caminos.get(input.caminoId),
      ])
      if (!camino) return 'Camino no encontrado.'
      const resumen = fechas.map(f => {
        const r = registros.find(r => r.fecha === f)
        return `${f}: ${r?.marca ?? 'sin marcar'}${r?.nota ? ` ("${r.nota}")` : ''}`
      }).join('\n')
      return `Historial de "${camino.nombre}" (${dias}d):\n${resumen}`
    }

    case 'consultar_historial_global': {
      const dias   = Math.min(input.diasAtras || 7, 30)
      const fechas = Array.from({ length: dias }, (_, i) => haceNDiasISO(i))
      const [caminos, registros] = await Promise.all([
        db.caminos.where('activo').equals(1).sortBy('orden'),
        db.registros.where('fecha').anyOf(fechas).toArray(),
      ])
      const cabecera = 'FECHA       ' + caminos.map(c => c.icono).join(' ')
      const lineas   = fechas.map(f => {
        const marcas = caminos.map(c => {
          const r = registros.find(r => r.fecha === f && r.caminoId === c.id)
          return r?.marca?.[0] ?? '·'
        }).join(' ')
        return `${f}: ${marcas}`
      })
      return `${cabecera}\n${lineas.join('\n')}`
    }

    case 'consultar_reflexiones': {
      const dias       = Math.min(input.diasAtras || 7, 30)
      const fechas     = Array.from({ length: dias }, (_, i) => haceNDiasISO(i))
      const reflexiones = await db.reflexiones.where('fecha').anyOf(fechas).sortBy('fecha')
      if (!reflexiones.length) return 'Sin reflexiones en ese período.'
      return reflexiones.map(r => `${r.fecha}: "${r.texto}"`).join('\n')
    }

    default:
      return `Tool desconocida: ${name}`
  }
}

// ── Generador de desafío inmediato ───────────────────────────────────────────
export async function generarDesafioIA(personaje, caminos, registros14d, apiKey) {
  const caminosConScore = caminos.map(c => ({
    ...c,
    avances: registros14d.filter(r => r.caminoId === c.id && r.marca === 'avance').length,
  })).sort((a, b) => a.avances - b.avances)

  const top3 = caminosConScore.slice(0, Math.min(3, caminosConScore.length))
  const caminosInfo = top3.map(c =>
    `[ID:${c.id}] ${c.icono} ${c.nombre} | Nv.${c.nivel} Racha:${c.rachaActual}d | 14d: ${c.avances} avances`
  ).join('\n')

  const prompt = `Eres ${personaje.nombre}. Debes desafiar a Olivier con una pregunta que pueda responder AHORA MISMO.

La pregunta debe estar relacionada con la filosofía de "${personaje.nombre}" o con el desarrollo personal, conectada a uno de sus caminos:
${caminosInfo}

Crea UNA pregunta de opción múltiple que sea desafiante pero respondible. Que se sienta como un reto de sabiduría real.

Responde ÚNICAMENTE con JSON válido (sin texto extra, sin bloques de código):
{
  "caminoId": <uno de los IDs de arriba>,
  "pregunta": "<pregunta clara y estimulante, máx 90 chars>",
  "opciones": ["<opción A>", "<opción B>", "<opción C>", "<opción D>"],
  "correcta": <índice 0-3>,
  "xpPremio": <número entre 25 y 55>,
  "explicacion": "<frase motivadora de ${personaje.nombre} si acierta, máx 70 chars>",
  "consolacion": "<frase corta si falla, máx 60 chars>"
}`

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!resp.ok) throw new Error(`Error ${resp.status}`)
  const data = await resp.json()
  const text = data.content?.find(b => b.type === 'text')?.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*?\}/)
  if (!jsonMatch) throw new Error('No JSON en respuesta')
  return JSON.parse(jsonMatch[0])
}

// ── Generador de retos IA ─────────────────────────────────────────────────────
export async function generarRetosIA(personaje, caminos, registros14d, apiKey) {
  const caminosInfo = caminos.map(c => {
    const avances = registros14d.filter(r => r.caminoId === c.id && r.marca === 'avance').length
    const nadas   = registros14d.filter(r => r.caminoId === c.id && r.marca === 'nada').length
    const pausas  = registros14d.filter(r => r.caminoId === c.id && r.marca === 'pausa').length
    return `[ID:${c.id}] ${c.icono} ${c.nombre} | Nv.${c.nivel} Racha:${c.rachaActual}d | 14d: ${avances}✓ ${pausas}→ ${nadas}✗`
  }).join('\n')

  const prompt = `Eres ${personaje.nombre}.
Propón 3 retos a Olivier para 3 caminos DIFERENTES. Cada reto debe reflejar tu filosofía y ajustarse al historial real del camino. Si un camino va bien, sube la dificultad. Si va mal, hazlo alcanzable.

CAMINOS:
${caminosInfo}

Responde ÚNICAMENTE con JSON válido (sin texto extra, sin markdown):
[
  {
    "caminoId": <número>,
    "titulo": "<título corto, máx 28 chars>",
    "descripcion": "<qué debe hacer exactamente, máx 75 chars>",
    "duracionDias": <3, 7 o 14>,
    "meta": <avances mínimos requeridos>,
    "xpPremio": <30-250>,
    "xpPenalty": <10-70>,
    "emoji": "<emoji único>"
  },
  { ... },
  { ... }
]
Elige 3 caminos distintos. Varía las duraciones. Sé directo y motivador.`

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!resp.ok) throw new Error(`Error ${resp.status}`)
  const data = await resp.json()
  const text = data.content?.find(b => b.type === 'text')?.text ?? ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON en respuesta IA')
  return JSON.parse(jsonMatch[0])
}

// ── Llamada principal con soporte de múltiples rondas de tool use ─────────────
export async function llamarClaude(mensajeUsuario, historial, apiKey) {
  const systemPrompt = await buildSystemPrompt()

  const mensajesCtx = historial.slice(-14).map(m => ({ role: m.rol, content: m.mensaje }))
  mensajesCtx.push({ role: 'user', content: mensajeUsuario })

  let messages       = [...mensajesCtx]
  let accionesTotal  = []
  let respuestaFinal = ''

  for (let ronda = 0; ronda < MAX_TOOL_ROUNDS; ronda++) {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        tools: TOOLS,
        messages,
      }),
    })

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error(err.error?.message || `Error ${resp.status}`)
    }

    const data = await resp.json()

    if (data.stop_reason === 'tool_use') {
      const toolResults = []
      for (const bloque of data.content) {
        if (bloque.type === 'tool_use') {
          const resultado = await ejecutarTool(bloque.name, bloque.input)
          accionesTotal.push(resultado)
          toolResults.push({ type: 'tool_result', tool_use_id: bloque.id, content: resultado })
        }
      }
      // Añadir turno asistente + resultados y continuar
      messages = [...messages, { role: 'assistant', content: data.content }, { role: 'user', content: toolResults }]
      continue
    }

    // stop_reason === 'end_turn' u otro — tenemos respuesta final
    respuestaFinal = data.content?.find(b => b.type === 'text')?.text ?? ''
    break
  }

  return {
    respuesta: respuestaFinal,
    accion:    accionesTotal.length ? accionesTotal.join(' | ') : null,
  }
}
