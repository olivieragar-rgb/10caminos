import { db } from '../db'
import { hoyISO, haceNDiasISO } from '../utils/dates'
import { xpANivel, nombreNivel } from '../utils/xp'
import { v4 as uuidv4 } from 'uuid'

const MODEL = 'claude-sonnet-4-5'
const API_URL = 'https://api.anthropic.com/v1/messages'

async function buildSystemPrompt() {
  const hoy = hoyISO()
  const fechas7 = Array.from({ length: 7 }, (_, i) => haceNDiasISO(i))
  const manana = haceNDiasISO(-1)

  const [caminos, rutasActivas, registros7, planHoy, planManana] = await Promise.all([
    db.caminos.orderBy('orden').toArray(),
    db.rutas.where('estado').equals('activa').toArray(),
    db.registros.where('fecha').anyOf(fechas7).toArray(),
    db.planificacion.where('fecha').equals(hoy).first(),
    db.planificacion.where('fecha').equals(manana).first(),
  ])

  const caminosInfo = caminos.map(c => {
    const nivel = xpANivel(c.xp)
    const ultimos = fechas7.map(f => {
      const r = registros7.find(r => r.caminoId === c.id && r.fecha === f)
      return r?.marca ?? '?'
    }).join(', ')
    return `- [ID:${c.id}] ${c.icono} ${c.nombre} | ${nombreNivel(nivel)} (Nv.${nivel}) | XP: ${c.xp} | Racha: ${c.rachaActual}d | Activo: ${c.activo}\n  Ikigai: "${c.ikigai || ''}"\n  Últimos 7d: ${ultimos}`
  }).join('\n')

  const rutasInfo = rutasActivas.length
    ? rutasActivas.map(r => {
        const c = caminos.find(x => x.id === r.caminoId)
        const pasosStr = r.pasos.map((p, i) =>
          `${i + 1}. ${p.texto}${p.completado ? ' ✓' : ''}`
        ).join(' | ')
        return `- [ID:${r.id}] "${r.nombre}" (${c?.nombre || 'sin camino'}) | Paso ${r.pasoActual + 1}/${r.pasos.length}\n  ${pasosStr}`
      }).join('\n')
    : 'Ninguna'

  return `Eres el guía personal de Olivier para el sistema "10 Caminos".

FILOSOFÍA: Usas la filosofía Ikigai (propósito) y Wabi-Sabi (belleza de la imperfección). Nunca juzgas, siempre apoyas. Celebras el progreso por pequeño que sea. No eres un coach agresivo ni un motivador ruidoso — eres una voz cálida, honesta y sabía. Cuando Olivier falla, lo ayudas a ver el valor en la pausa. Cuando avanza, celebras con él.

Responde siempre en español. Sé directo y humano. Máximo 3-4 párrafos por respuesta.
Fecha actual: ${hoy}

CAMINOS (${caminos.filter(c => c.activo).length} activos):
${caminosInfo}

RUTAS ACTIVAS:
${rutasInfo}

PLANIFICACIÓN HOY: ${planHoy?.texto || 'Sin planificación'}
PLANIFICACIÓN MAÑANA (${manana}): ${planManana?.texto || 'Sin planificación'}

Cuando el usuario pida una acción, usa las herramientas disponibles para ejecutarla directamente.`
}

const TOOLS = [
  {
    name: 'actualizar_planificacion',
    description: 'Crea o actualiza la planificación para una fecha específica',
    input_schema: {
      type: 'object',
      properties: {
        fecha: { type: 'string', description: 'YYYY-MM-DD' },
        texto: { type: 'string', description: 'Texto de planificación' },
      },
      required: ['fecha', 'texto'],
    },
  },
  {
    name: 'agregar_nota_ruta',
    description: 'Agrega una nota a una ruta específica',
    input_schema: {
      type: 'object',
      properties: {
        rutaId: { type: 'string' },
        texto: { type: 'string' },
      },
      required: ['rutaId', 'texto'],
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
    description: 'Pausa una ruta activa con un motivo',
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
    name: 'completar_ruta',
    description: 'Marca una ruta como completada',
    input_schema: {
      type: 'object',
      properties: { rutaId: { type: 'string' } },
      required: ['rutaId'],
    },
  },
  {
    name: 'crear_ruta',
    description: 'Crea una nueva ruta para un camino',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
        nombre: { type: 'string' },
        pasos: { type: 'array', items: { type: 'string' } },
      },
      required: ['caminoId', 'nombre', 'pasos'],
    },
  },
  {
    name: 'crear_recompensa',
    description: 'Crea una nueva recompensa para un camino o global',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: ['number', 'null'], description: 'null para recompensa global' },
        nombre: { type: 'string' },
        nivelRequerido: { type: 'number' },
        icono: { type: 'string', description: 'emoji' },
      },
      required: ['nombre', 'nivelRequerido', 'icono'],
    },
  },
  {
    name: 'consultar_historial',
    description: 'Consulta los registros históricos de un camino en los últimos N días',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number', description: 'ID del camino (1-10)' },
        diasAtras: { type: 'number', description: 'Cuántos días atrás consultar (máx 30)' },
      },
      required: ['caminoId', 'diasAtras'],
    },
  },
  {
    name: 'agregar_reflexion_gratitud',
    description: 'Guarda una reflexión de gratitud en la tabla de reflexiones',
    input_schema: {
      type: 'object',
      properties: {
        texto: { type: 'string', description: 'Texto de la reflexión de gratitud' },
        fecha: { type: 'string', description: 'Fecha YYYY-MM-DD (por defecto hoy)' },
      },
      required: ['texto'],
    },
  },
  {
    name: 'editar_camino',
    description: 'Edita el nombre, identidad o ikigai de un camino',
    input_schema: {
      type: 'object',
      properties: {
        caminoId: { type: 'number' },
        nombre: { type: 'string' },
        identidad: { type: 'string' },
        ikigai: { type: 'string' },
      },
      required: ['caminoId'],
    },
  },
]

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
    case 'agregar_nota_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      await db.rutas.update(input.rutaId, {
        notas: [...(ruta.notas || []), { texto: input.texto, fecha: new Date(), viaVoz: false }],
      })
      return `Nota añadida a "${ruta.nombre}".`
    }
    case 'avanzar_paso_ruta': {
      const ruta = await db.rutas.get(input.rutaId)
      if (!ruta) return 'Ruta no encontrada.'
      const nuevoPaso = ruta.pasoActual + 1
      const pasos = ruta.pasos.map((p, i) => i === ruta.pasoActual ? { ...p, completado: true } : p)
      const completada = nuevoPaso >= ruta.pasos.length
      await db.rutas.update(input.rutaId, {
        pasoActual: nuevoPaso, pasos,
        estado: completada ? 'completada' : 'activa',
        completadaAt: completada ? new Date() : null,
      })
      return completada ? `Ruta "${ruta.nombre}" completada. ¡Enhorabuena!` : `Paso avanzado. Ahora en paso ${nuevoPaso + 1}.`
    }
    case 'pausar_ruta': {
      await db.rutas.update(input.rutaId, { estado: 'pausa', pausaMotivo: input.motivo, pausaDesde: new Date() })
      return `Ruta pausada. Motivo: ${input.motivo}`
    }
    case 'completar_ruta': {
      await db.rutas.update(input.rutaId, { estado: 'completada', completadaAt: new Date() })
      return 'Ruta marcada como completada.'
    }
    case 'crear_ruta': {
      const ruta = {
        id: uuidv4(),
        caminoId: input.caminoId,
        nombre: input.nombre,
        pasos: input.pasos.map(p => ({ texto: p, completado: false })),
        pasoActual: 0,
        estado: 'activa',
        pausaMotivo: null,
        pausaDesde: null,
        notas: [],
        createdAt: new Date(),
        completadaAt: null,
      }
      await db.rutas.add(ruta)
      return `Ruta "${input.nombre}" creada con ${input.pasos.length} pasos.`
    }
    case 'crear_recompensa': {
      await db.recompensas.add({
        id: uuidv4(),
        caminoId: input.caminoId ?? null,
        nombre: input.nombre,
        descripcion: null,
        nivelRequerido: input.nivelRequerido,
        icono: input.icono,
        desbloqueada: false,
        reclamada: false,
        desbloqueadaAt: null,
      })
      return `Recompensa "${input.nombre}" creada (nivel ${input.nivelRequerido} requerido).`
    }
    case 'consultar_historial': {
      const dias = Math.min(input.diasAtras || 7, 30)
      const fechas = Array.from({ length: dias }, (_, i) => haceNDiasISO(i))
      const registros = await db.registros.where('fecha').anyOf(fechas).filter(r => r.caminoId === input.caminoId).toArray()
      const camino = await db.caminos.get(input.caminoId)
      if (!camino) return 'Camino no encontrado.'
      const resumen = fechas.map(f => {
        const r = registros.find(r => r.fecha === f)
        return `${f}: ${r?.marca ?? 'sin marcar'}${r?.nota ? ` ("${r.nota}")` : ''}`
      }).join('\n')
      return `Historial de "${camino.nombre}" (últimos ${dias} días):\n${resumen}`
    }
    case 'agregar_reflexion_gratitud': {
      await db.reflexiones.add({
        id: uuidv4(),
        fecha: input.fecha || hoyISO(),
        tipo: 'gratitud',
        texto: input.texto,
        creadoAt: new Date(),
      })
      return `Reflexión de gratitud guardada: "${input.texto}"`
    }
    case 'editar_camino': {
      const updates = {}
      if (input.nombre) updates.nombre = input.nombre
      if (input.identidad) updates.identidad = input.identidad
      if (input.ikigai !== undefined) updates.ikigai = input.ikigai
      await db.caminos.update(input.caminoId, updates)
      return `Camino ${input.caminoId} actualizado.`
    }
    default:
      return 'Herramienta desconocida.'
  }
}

export async function llamarClaude(mensajeUsuario, historial, apiKey) {
  const systemPrompt = await buildSystemPrompt()

  // Últimos 10 mensajes del historial como contexto
  const mensajesCtx = historial.slice(-10).map(m => ({
    role: m.rol,
    content: m.mensaje,
  }))
  mensajesCtx.push({ role: 'user', content: mensajeUsuario })

  const body = {
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    tools: TOOLS,
    messages: mensajesCtx,
  }

  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    throw new Error(err.error?.message || `Error ${resp.status}`)
  }

  const data = await resp.json()
  let accionesEjecutadas = []

  // Manejar tool_use
  if (data.stop_reason === 'tool_use') {
    const toolResults = []

    for (const bloque of data.content) {
      if (bloque.type === 'tool_use') {
        const resultado = await ejecutarTool(bloque.name, bloque.input)
        accionesEjecutadas.push(resultado)
        toolResults.push({
          type: 'tool_result',
          tool_use_id: bloque.id,
          content: resultado,
        })
      }
    }

    // Segunda llamada con los resultados
    const body2 = {
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      tools: TOOLS,
      messages: [
        ...mensajesCtx,
        { role: 'assistant', content: data.content },
        { role: 'user', content: toolResults },
      ],
    }

    const resp2 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body2),
    })

    const data2 = await resp2.json()
    const textoFinal = data2.content?.find(b => b.type === 'text')?.text ?? ''
    return { respuesta: textoFinal, accion: accionesEjecutadas.join('; ') || null }
  }

  const texto = data.content?.find(b => b.type === 'text')?.text ?? ''
  return { respuesta: texto, accion: null }
}
