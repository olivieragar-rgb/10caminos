// src/entidades.js
// Datos de las 8 entidades del Codex de la Psique.
// Las 4 secretas tienen secreto: true — sus nombres no se revelan en la UI hasta que se desbloquean.

export const ENTIDADES = [
  // ── CONOCIDAS ──────────────────────────────────────────────────────────────

  {
    id: 'uranai_baba',
    nombre: 'Uranai Baba',
    icono: '🔮',
    color: '#c9942a',
    secreto: false,
    intro: [
      'Ja ja ja... Sabía que vendrías. La bola de cristal nunca miente.',
      'Viajero... Siéntate. Los espíritus tienen algo que decirte.',
      'Kikiiii... El más allá ha hablado. ¿Estás listo para escuchar?',
      'El cristal me mostró tu cara hace tres días. Tardaste.',
    ],
    fraseExito: [
      'Ja ja ja... Impressive. El cristal raramente se equivoca sobre los que ven claro.',
      'Los espíritus aprueban tu visión. Sigue así, caminante.',
      'Kikiiii... ¡Correcto! El futuro te favorece... por ahora.',
    ],
    fraseFallo: [
      'El cristal era claro... pero tu mente no. Vuelve cuando hayas reflexionado más.',
      'Ja... Los espíritus esperarán. Pero no indefinidamente.',
      'Kikiiii... El futuro no se puede forzar. Primero hay que verlo.',
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: 'El cristal muestra tres visiones para tu próxima semana. Solo una es el camino verdadero. ¿Cuál resuena?',
        opciones: [
          'A) Quien persigue dos liebres no atrapa ninguna. Elige un camino y da todo.',
          'B) La interrupción también es parte del ritmo. No toda pausa es derrota.',
          'C) El esfuerzo invisible de hoy es la victoria visible de mañana.',
        ],
        respuestaCorrecta: '2',
        xpRecompensa: 15,
        loreFragment: "Baba profetizó: 'El esfuerzo invisible de hoy es la victoria visible de mañana.' Guárdalo bien.",
      },
      {
        tipo: 'opciones',
        enunciado: 'Tres voces del más allá hablan a la vez. Solo una dice la verdad sobre lo que necesitas ahora.',
        opciones: [
          'A) Los números no mienten. Si tus caminos bajan, tu interior también.',
          'B) La constancia sin alegría no es virtud, es castigo.',
          'C) Lo que evitas hoy regresa mañana más grande.',
        ],
        respuestaCorrecta: '1',
        xpRecompensa: 15,
        loreFragment: "El cristal reveló: 'La constancia sin alegría no es virtud, es castigo.' Baba sonrió.",
      },
      {
        tipo: 'opciones',
        enunciado: '¿Qué revela el cristal sobre tus caminos esta semana?',
        opciones: [
          'A) El árbol que dobla en la tormenta sobrevive al que se rompe.',
          'B) Avanzar despacio también es avanzar.',
          'C) Mañana existe porque alguien decidió hoy.',
        ],
        respuestaCorrecta: '2',
        xpRecompensa: 15,
        loreFragment: "Baba cerró los ojos: 'Mañana existe porque alguien decidió hoy.' El cristal se oscureció.",
      },
    ],
  },

  {
    id: 'erwin',
    nombre: 'Erwin Smith',
    icono: '🎖️',
    color: '#8a9bb0',
    secreto: false,
    intro: [
      'Hasta aquí llegó tu certeza. Ahora viene el verdadero costo.',
      'Cada meta requiere una pérdida. ¿Estás dispuesto a pagarla?',
      'La victoria no es gratis. Nunca lo fue. ¿Cuánto vale lo que persigues?',
      'He visto hombres más fuertes que tú retroceder aquí. No lo hagas.',
    ],
    fraseExito: [
      'Eso es. La claridad del sacrificio es la única brújula confiable.',
      'Bien. Solo quien acepta perder puede ganar verdaderamente.',
      'El costo del futuro siempre se paga en el presente. Tú lo entiendes.',
    ],
    fraseFallo: [
      'El instinto de preservación nos traiciona cuando más lo necesitamos. Piénsalo.',
      'Quien protege demasiado el presente, compromete el futuro. Recuérdalo.',
      'No te juzgo. Pero la próxima vez, piensa más allá del momento.',
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: 'Dos caminos ante ti. Uno requiere sacrificar comodidad ahora para ganar libertad después. El otro protege el presente pero compromete el futuro. Erwin pregunta: ¿Cuál elegís?',
        opciones: [
          'A) Sacrifico el presente. El futuro justifica el costo.',
          'B) Protejo el presente. No puedo arriesgar lo que tengo.',
        ],
        respuestaCorrecta: '0',
        xpRecompensa: 15,
        loreFragment: "Erwin asintió: 'Solo quien acepta perder puede ganar verdaderamente. El costo del futuro siempre se paga en el presente.' —Erwin Smith",
      },
      {
        tipo: 'opciones',
        enunciado: 'Tu equipo avanza pero uno de tus hábitos flaquea. Erwin evalúa: ¿qué priorizás?',
        opciones: [
          'A) Refuerzo el hábito débil aunque descuide los otros temporalmente.',
          'B) Mantengo todos al mismo ritmo aunque ninguno crezca rápido.',
          'C) Abandono el débil y concentro todo en los fuertes.',
        ],
        respuestaCorrecta: '0',
        xpRecompensa: 15,
        loreFragment: "Erwin: 'Atender la debilidad con foco es táctica, no cobardía. El flanco expuesto siempre cuesta más tarde.' Saludó y se fue.",
      },
    ],
  },

  {
    id: 'shikamaru',
    nombre: 'Shikamaru',
    icono: '☁️',
    color: '#7a9e5a',
    secreto: false,
    intro: [
      '...Qué molestia. Pero está bien, ya que estás aquí.',
      'Iba a quedarme mirando las nubes pero... supongo que esto también sirve.',
      'Tengo diez movimientos calculados. Vos no tenés ninguno. Empecemos.',
      'No me gusta perder el tiempo. Responde rápido.',
    ],
    fraseExito: [
      "...Ya sabía que lo ibas a ver. Era demasiado obvio para no notarlo.",
      "Bien. No sos tan problemático después de todo.",
      "Correcto. Qué molestia... esperaba que fuera más difícil.",
    ],
    fraseFallo: [
      "...Qué molestia. Te di todas las pistas. Piénsalo de nuevo la próxima vez.",
      "La respuesta estaba frente a tus ojos. Siempre es más simple de lo que parece.",
      "No me hagas perder más tiempo. Reflexionalo.",
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: "Shikamaru garabatea en el suelo: '1, 1, 2, 3, 5, 8, 13...' Se da vuelta. '¿Qué número sigue? Qué molestia, es tan obvio.'",
        opciones: ['18', '19', '21', '24'],
        respuestaCorrecta: '2',
        xpRecompensa: 15,
        loreFragment: "Shikamaru murmuró: '21. Fibonacci. Cada número es la suma de los dos anteriores. Como tus hábitos — cada día construye sobre los anteriores.' Luego bostezó.",
      },
      {
        tipo: 'opciones',
        enunciado: "'Mirá esto.' Shikamaru dibuja: '2, 6, 12, 20, 30, 42...' '¿Cuál es el patrón? Cada término es n×(n+1). Si n empieza en 1... ¿cuál viene después del 42?'",
        opciones: ['50', '52', '54', '56'],
        respuestaCorrecta: '3',
        xpRecompensa: 15,
        loreFragment: "Shikamaru: '56. n×(n+1) con n=7. Simple. Como todo lo que parece difícil: tiene estructura debajo. Encuéntrala.' Bostezó de nuevo.",
      },
      {
        tipo: 'opciones',
        enunciado: "'Tres jugadores. A siempre miente. B a veces miente. C siempre dice la verdad. Los tres dicen que ganaron. ¿A quién creés?'",
        opciones: ['A — el que más convence', 'B — es el más equilibrado', 'C — siempre dice la verdad', 'Ninguno — todos mienten'],
        respuestaCorrecta: '2',
        xpRecompensa: 15,
        loreFragment: "Shikamaru: 'C. Siempre. Las reglas simples dan respuestas claras. En la vida también — conocé el carácter de quién habla antes de creer lo que dice.' Se fue sin esperar respuesta.",
      },
    ],
  },

  {
    id: 'rick',
    nombre: 'Rick Sanchez',
    icono: '🧪',
    color: '#5ab8c0',
    secreto: false,
    intro: [
      "*burp* Mira Morty— olvídalo. Tú. Tengo una pregunta. *burp*",
      "Oh genial, otro humano con 'hábitos'. *burp* Escuchame bien.",
      "*burp* El universo tiene 13.8 billones de años y elegiste ESTE momento para aparecer. Mejor que valga la pena.",
      "¿Sabés cuántas civilizaciones desarrollaron sistemas de hábitos? *burp* Todas fracasaron. A ver si sos diferente.",
    ],
    fraseExito: [
      "*burp* Bien. Somos una mancha estadística pero esa mancha acaba de demostrar algo. Wubba lubba dub dub.",
      "Correcto. *burp* No es que me importe, pero... está bien. Seguí.",
      "*burp* Impresionante. Para un humano promedio en un planeta mediocre, no estuvo mal.",
    ],
    fraseFallo: [
      "*burp* Clásico. La mayoría de las especies no llegan a la siguiente pregunta. No te preocupes.",
      "Mira, *burp* en el 99.7% de las líneas temporales tampoco lo sabías. Estadísticamente sos normal. Qué triste.",
      "*burp* La respuesta correcta existía. Simplemente no la viste. Prueba de nuevo... o no. Da igual.",
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: "Rick *burp* aparece de la nada. 'Si el universo tiene 13,800 millones de años y los humanos modernos existen hace ~300,000 años... ¿qué porcentaje de la historia cósmica representamos?' *burp* '¿Y para qué sirve saberlo?'",
        opciones: [
          '~2.2% — suficiente para importar.',
          '~0.0022% — una fracción, pero elegimos qué hacer con ella.',
          '~0.0022% — nada tiene sentido.',
          '~22% — somos el centro del cosmos.',
        ],
        respuestaCorrecta: '1',
        xpRecompensa: 15,
        loreFragment: "Rick: '*burp* Bien. Somos una mancha estadística. Pero aquí estás, construyendo hábitos en una roca que orbita una estrella mediocre. Si eso no es absurdamente heroico... *burp* ...no sé qué es.' Desapareció.",
      },
      {
        tipo: 'opciones',
        enunciado: "*burp* 'Paradoja de Fermi, sección hábitos: si construir un hábito tarda 21-66 días según la ciencia, ¿por qué el 88% de las resoluciones de año nuevo fracasan antes del día 12?' *burp* 'Elegí la respuesta menos estúpida.'",
        opciones: [
          'Por falta de motivación — no querían de verdad.',
          'Por diseño de entorno — el contexto boicotea la intención.',
          'Por debilidad de carácter — son flojos.',
          'El 12 es un número maldito estadísticamente.',
        ],
        respuestaCorrecta: '1',
        xpRecompensa: 15,
        loreFragment: "Rick: '*burp* Correcto. El entorno supera la voluntad casi siempre. Por eso esta app existe — para ser el entorno. No soy sentimental, pero... *burp* ...buen diseño. Sigue.'",
      },
    ],
  },

  // ── SECRETAS ───────────────────────────────────────────────────────────────

  {
    id: 'l_lawliet',
    nombre: 'L',
    icono: '🍰',
    color: '#e8e6e3',
    secreto: true,
    intro: [
      'Interesante. Hay algo en tus patrones que no cierra.',
      'Según mis cálculos, hay una probabilidad del 94% de que sepas la respuesta. Veamos.',
      'Me gustan las personas consistentes. Son más predecibles. Y más fáciles de analizar.',
      'Tomá asiento. Esto no tomará mucho tiempo... si sos observador.',
    ],
    fraseExito: [
      "Correcto. Sos interesante. Podría necesitarte.",
      "94% de probabilidad de éxito confirmado. Bien.",
      "Como pensaba. La evidencia apuntaba ahí desde el principio.",
    ],
    fraseFallo: [
      "Hmm. La evidencia era clara. Revisá tus suposiciones.",
      "La respuesta estaba en los datos desde el principio. Próxima vez, eliminá lo imposible.",
      "Cuando eliminás lo imposible, lo que queda — por improbable que parezca — es la verdad.",
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: 'L se sienta de forma peculiar. "Tres sospechosos. El libro desapareció entre las 14:00 y 16:00. (1) El sospechoso A tiene coartada de dos testigos a las 15:00. (2) El sospechoso B tiene manchas de tinta en los dedos. (3) El sospechoso C fue visto saliendo de la biblioteca a las 15:45, pero dice que nunca entró." ¿Quién mintió?',
        opciones: ['Sospechoso A', 'Sospechoso B', 'Sospechoso C'],
        respuestaCorrecta: '2',
        xpRecompensa: 20,
        loreFragment: "L asintió lentamente. 'Correcto. C dijo que no entró, pero fue visto saliendo. Una contradicción es suficiente.' Tomó un trozo de pastel. 'Sos interesante.'",
      },
      {
        tipo: 'opciones',
        enunciado: 'L coloca tres fichas. "Alguien rompió su hábito de 15 días. (1) Ese día tenía energía normal. (2) Ese día cambió su rutina matutina. (3) Ese día dijo que \'lo haría mañana\'. ¿Cuál fue la causa real?"',
        opciones: [
          'Energía baja — el cuerpo fallò.',
          'Cambio de rutina — el entorno falló.',
          'Procrastinación — la mente falló.',
          'Las tres juntas — un sistema frágil.',
        ],
        respuestaCorrecta: '3',
        xpRecompensa: 20,
        loreFragment: "L: 'Correcto. Ningún hábito se rompe por una sola causa. Cuando el sistema es frágil, todo falla junto. La resiliencia requiere capas de protección.' Tomó otro trozo de pastel.",
      },
    ],
  },

  {
    id: 'glados',
    nombre: 'GLaDOS',
    icono: '🤖',
    color: '#a8e063',
    secreto: true,
    intro: [
      'Oh. Sos tú. El sujeto de prueba. Bienvenido de vuelta.',
      'Protocolo de calibración iniciado. Esto no dolerá. Mucho.',
      'He analizado tus patrones. Son... interesantes. Para un humano.',
      'El test comenzará en 3... 2... comenzó. No te distraigas.',
    ],
    fraseExito: [
      "Prueba superada. Inesperadamente. Bien hecho... supongo.",
      "Resultado: APTO. Datos guardados. No mueras antes del próximo test.",
      "Correcto. Aunque probablemente fue suerte. Seguiremos monitoreando.",
    ],
    fraseFallo: [
      "Prueba fallida. Datos guardados de todas formas. Serán útiles como ejemplo de qué no hacer.",
      "Incorrecto. El 73% de los sujetos falla aquí. Sos estadísticamente normal. Qué decepcionante.",
      "Respuesta incorrecta. No te preocupes. El fracaso es también un resultado válido para la ciencia.",
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: "PROTOCOLO DE PRUEBA v4.7. Sujeto: vos. Pregunta de calibración: Si tenés 8 caminos activos y completás el 75% consistentemente durante 4 semanas (28 días), ¿cuántos avances totales registrás? El redondeo hacia abajo es más honesto.",
        opciones: ['148', '158', '168', '178'],
        respuestaCorrecta: '2',
        xpRecompensa: 20,
        loreFragment: "GLaDOS: 'Correcto. 8 × 0.75 × 28 = 168. La consistencia del 75% produce resultados medibles. Datos guardados. Próxima prueba pendiente.' Silencio mecánico.",
      },
      {
        tipo: 'opciones',
        enunciado: "Test de lógica de hábitos: 'Si un hábito requiere 21 días para formarse pero tarda 66 días para ser automático, ¿en qué punto en ese rango la mayoría de las personas abandona?' Elige el intervalo correcto.",
        opciones: [
          'Días 1-7: el inicio es el peor momento.',
          'Días 8-21: la novedad desapareció pero el hábito aún no está.',
          'Días 22-45: creyeron que ya estaba formado y bajaron la guardia.',
          'Días 46-66: el recta final siempre es la más difícil.',
        ],
        respuestaCorrecta: '1',
        xpRecompensa: 20,
        loreFragment: "GLaDOS: 'Correcto. Días 8-21. El entusiasmo inicial se agotó, el hábito no es automático todavía, y el esfuerzo consciente se siente injusto. Ese es el punto de falla estadístico.' Pausa. 'Seguís en el test.'",
      },
    ],
  },

  {
    id: 'esfinge',
    nombre: 'La Esfinge',
    icono: '🗿',
    color: '#d4a843',
    secreto: true,
    intro: [
      'Detente. Antes de avanzar, responde.',
      'Llevo milenios aquí. Pocos pasan. Habla.',
      'El camino continúa solo si tienes la respuesta. ¿La tienes?',
      'No tengo prisa. El tiempo no me afecta. ¿Y a vos?',
    ],
    fraseExito: [
      'Correcto. El camino está abierto. Sigue.',
      'Bien respondido. Pasas.',
      'La respuesta era correcta. Pero recuérdala — el verdadero camino aún no terminó.',
    ],
    fraseFallo: [
      'Incorrecto. Vuelve cuando tu mente esté más clara.',
      'La respuesta existía. No la viste. Medita sobre ello.',
      'Muchos lo intentan. Pocos pasan. Intenta de nuevo... si te atreves.',
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: 'La Esfinge habla desde la piedra: "Soy tuyo pero no te pertenezco. Te sigo a todas partes pero huyo de la oscuridad. Peso nada pero cargo con todo lo que eres. ¿Qué soy?"',
        opciones: ['Tu sombra', 'Tu nombre', 'Tu pasado', 'Tu destino'],
        respuestaCorrecta: '0',
        xpRecompensa: 20,
        loreFragment: "La Esfinge susurró: 'Tu sombra. Como tus hábitos — te siguen, se forman en la luz del esfuerzo, y desaparecen en la oscuridad del abandono.' La piedra calló.",
      },
      {
        tipo: 'opciones',
        enunciado: '"Cuanto más me usas, más pequeño me vuelvo. Cuanto más me cuidas, más grande soy. Sin mí todo es caos, con demasiado de mí todo es rígido. ¿Qué soy?"',
        opciones: ['El tiempo', 'La disciplina', 'El espacio', 'La memoria'],
        respuestaCorrecta: '1',
        xpRecompensa: 20,
        loreFragment: "La Esfinge: 'La disciplina. Úsala sin parar y se agota. No la uses y crece el caos. El equilibrio es la respuesta que nadie da a la primera.' El viento sopló.",
      },
    ],
  },

  {
    id: 'joker',
    nombre: 'El Joker',
    icono: '🃏',
    color: '#cc3355',
    secreto: true,
    intro: [
      '¿Por qué tan serio? Vamos a jugar un juego.',
      'Ja ja ja... Llegaste justo a tiempo para el caos.',
      'Las reglas son simples: no hay reglas. ¿Empezamos?',
      '¿Sabés cuál es la diferencia entre un plan y una broma? El tiempo.',
    ],
    fraseExito: [
      'Ja ja... sabía que lo ibas a elegir. ¿O acaso creés que tuviste elección?',
      'Correcto. O incorrecto. ¿Quién sabe? ¡Ja!',
      'Muy bien. Pero recordá: la otra opción también tenía su lógica.',
    ],
    fraseFallo: [
      'Ja ja ja... ¿Fallaste? O quizás ganaste en una dimensión diferente. ¡Ja!',
      '¿Incorrecto? El Joker siempre gana porque no tiene nada que perder.',
      'No importa. La respuesta "correcta" es una construcción social. ¡Ja ja!',
    ],
    desafios: [
      {
        tipo: 'opciones',
        enunciado: 'El Joker baraja cartas. "Podés mantener UN hábito perfectamente o avanzar en TODOS imperfectamente. Excelencia selectiva versus progreso caótico. ¿Cuál sos?" Y el Joker aclara: cualquiera que elijas tiene consecuencias. Elige.',
        opciones: [
          'Uno perfectamente. La excelencia no admite dilución.',
          'Todos imperfectamente. El avance amplio importa más.',
        ],
        respuestaCorrecta: null,
        xpRecompensa: 20,
        loreFragmentOpciones: [
          "El Joker: 'La pureza de propósito. Interesante. Pero recordá — perfección en uno es abandono en el resto.' Barajó sus cartas. '¿O era la otra respuesta?' ¡Ja!",
          "El Joker carcajeó: '¡El caos del progreso! Sabía que lo dirías.' Barajó cartas. '¿O acaso querías decir lo otro? La ambigüedad es el único juego real.' ¡Ja!",
        ],
        loreFragment: "El Joker sonrió: 'El dilema no tenía respuesta correcta. Nunca la tiene. El juego era ver si te atrevías a elegir de todas formas.' Desapareció.",
      },
      {
        tipo: 'opciones',
        enunciado: '¿Por qué tan serio con tus hábitos? El Joker pregunta: "Si pudieras romper UNA regla de tu sistema sin consecuencias, ¿cuál sería?"',
        opciones: [
          'Saltearme un día sin culpa.',
          'No registrar cuando no quiero.',
          'Cambiar las reglas cuando me conviene.',
          'No cambiaría ninguna — las reglas me protegen.',
        ],
        respuestaCorrecta: null,
        xpRecompensa: 20,
        loreFragmentOpciones: [
          "El Joker: 'Saltear sin culpa. El autoperdón es la habilidad más subvalorada. Un día no es el fin. La culpa sí puede serlo.' Barajó. '¡Ja!'",
          "El Joker: 'No registrar. El registro es para servir al hábito, no al revés. Si te pesa, el sistema falló.' Barajó. '¡Ja!'",
          "El Joker: 'Cambiar las reglas. El sistema que no puede adaptarse ya está muerto. ¡Ja! La flexibilidad no es debilidad.' Barajó.",
          "El Joker se detuvo. '...Las reglas te protegen. Interesante.' Barajó en silencio. 'Quizás sos más disciplinado que yo. O más asustado. ¡Ja!'",
        ],
        loreFragment: "El Joker: 'Cualquier respuesta era válida. El juego era ver si elegías con convicción.' Desapareció entre risas.",
      },
    ],
  },
]

/** Busca una entidad por id */
export function getEntidad(id) {
  return ENTIDADES.find(e => e.id === id) ?? null
}

/** Elige un desafío pseudo-aleatorio para hoy (determinístico por fecha+entidadId) */
export function elegirDesafio(entidad, fechaISO) {
  const seed = fechaISO.replace(/-/g, '')
  const idx = parseInt(seed) % entidad.desafios.length
  return { desafio: entidad.desafios[idx], desafioIdx: idx }
}

/** Elige una frase de intro aleatoria */
export function elegirIntro(entidad, fechaISO) {
  const seed = fechaISO.replace(/-/g, '')
  return entidad.intro[parseInt(seed) % entidad.intro.length]
}
