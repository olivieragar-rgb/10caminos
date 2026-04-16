# Codex de la Psique — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix el bug de EventoDelDia (import faltante) e implementar el sistema completo de Encuentros Secretos con 8 entidades y el Codex de la Psique.

**Architecture:** Nuevos datos en `entidades.js` (hardcoded), lógica de triggers en `useEncuentros.js`, UI de encuentro en `EncuentroDelDia.jsx` + `EncuentroModal.jsx`, y pantalla del Codex en `src/components/codex/`. Se añade tabla `encuentros` a Dexie en versión 4.

**Tech Stack:** React 18, Dexie.js v3, Tailwind CSS, IndexedDB, uuid

---

## File Map

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Modify | `src/components/hoy/EventoDelDia.jsx` | Bug fix: agregar import db |
| Modify | `src/db.js` | Versión 4 con tabla `encuentros` |
| Create | `src/entidades.js` | Datos de las 8 entidades (personajes, desafíos, lore) |
| Create | `src/hooks/useEncuentros.js` | Triggers, guardar encuentros, hook de historial |
| Create | `src/components/hoy/EncuentroModal.jsx` | Modal con el desafío interactivo |
| Create | `src/components/hoy/EncuentroDelDia.jsx` | Tarjeta de encuentro con typewriter + flash |
| Create | `src/components/codex/EntidadCard.jsx` | Tarjeta de personaje (desbloqueada / silueta) |
| Create | `src/components/codex/EntidadDetalle.jsx` | Historial de encuentros con una entidad |
| Create | `src/components/codex/CodexView.jsx` | Pantalla principal del Codex |
| Modify | `src/components/hoy/HoyView.jsx` | Agregar EncuentroDelDia |
| Modify | `src/components/progreso/ProgresoView.jsx` | Botón "CODEX DE LA PSIQUE" condicional |
| Modify | `src/App.jsx` | Agregar CodexView al router |

---

## Task 0: Fix bug — import db faltante en EventoDelDia

**Files:**
- Modify: `src/components/hoy/EventoDelDia.jsx:1-6`

- [ ] **Agregar el import faltante**

Abrir `src/components/hoy/EventoDelDia.jsx` y cambiar las líneas iniciales de:

```jsx
// src/components/hoy/EventoDelDia.jsx
import { useState, useEffect } from 'react'
import { hoyISO } from '../../utils/dates'
```

a:

```jsx
// src/components/hoy/EventoDelDia.jsx
import { useState, useEffect } from 'react'
import { db } from '../../db'
import { hoyISO } from '../../utils/dates'
```

- [ ] **Verificar en el navegador:** Recargar la app. El evento del día NO debe aparecer de nuevo si ya fue visto hoy.

- [ ] **Commit**

```bash
git add src/components/hoy/EventoDelDia.jsx
git commit -m "fix: importar db en EventoDelDia para persistir evento visto"
```

---

## Task 1: DB versión 4 — tabla `encuentros`

**Files:**
- Modify: `src/db.js`

- [ ] **Agregar versión 4 a db.js**

Después de la versión 3 existente (línea 55), agregar:

```js
db.version(4).stores({
  caminos:       '++id, activo, orden',
  rutas:         'id, caminoId, estado',
  registros:     'id, fecha, caminoId',
  planificacion: 'id, fecha',
  recompensas:   'id, caminoId, desbloqueada',
  chatHistorial: 'id, fecha',
  configuracion: 'key',
  reflexiones:   'id, fecha, tipo',
  retos:         'id, caminoId, estado, fechaInicio, fechaFin, personajeId',
  encuentros:    'id, entidadId, fecha',
})
```

No hay `.upgrade()` porque no se migran datos existentes, solo se añade la tabla.

- [ ] **Verificar:** Abrir la app en el navegador y confirmar que no hay errores en la consola. Abrir DevTools → Application → IndexedDB → 10caminos → verificar que existe la tabla `encuentros`.

- [ ] **Commit**

```bash
git add src/db.js
git commit -m "feat: agregar tabla encuentros a Dexie v4"
```

---

## Task 2: entidades.js — datos de las 8 entidades

**Files:**
- Create: `src/entidades.js`

- [ ] **Crear el archivo con los datos completos**

```js
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
```

- [ ] **Commit**

```bash
git add src/entidades.js
git commit -m "feat: datos completos de las 8 entidades del Codex"
```

---

## Task 3: useEncuentros.js — hook de triggers y persistencia

**Files:**
- Create: `src/hooks/useEncuentros.js`

- [ ] **Crear el hook**

```js
// src/hooks/useEncuentros.js
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { hoyISO } from '../utils/dates'
import { nivelGlobal, xpANivel } from '../utils/xp'
import { v4 as uuidv4 } from 'uuid'
import { getEntidad } from '../entidades'

/** Retorna todos los encuentros ordenados por fecha desc */
export function useHistorialEncuentros() {
  return useLiveQuery(
    () => db.encuentros.orderBy('fecha').reverse().toArray(),
    [],
    []
  )
}

/** Retorna el encuentro de hoy si existe */
export function useEncuentroHoy() {
  const hoy = hoyISO()
  return useLiveQuery(
    () => db.encuentros.where('fecha').equals(hoy).first(),
    [hoy],
    undefined
  )
}

/** Verifica si el codex está desbloqueado */
export function useCodexDesbloqueado() {
  return useLiveQuery(
    () => db.configuracion.get('codexDesbloqueado').then(r => r?.value ?? false),
    [],
    false
  )
}

/** Días desde el último encuentro con una entidad */
async function diasDesdeUltimoEncuentro(entidadId) {
  const ultimo = await db.encuentros
    .where('entidadId').equals(entidadId)
    .reverse()
    .first()
  if (!ultimo) return Infinity
  const diff = new Date(hoyISO()) - new Date(ultimo.fecha + 'T00:00:00')
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Evalúa qué trigger se activa hoy.
 * Retorna el id de la entidad a disparar, o null si ninguno.
 * @param {object[]} caminos - todos los caminos
 * @param {object[]} registrosHoy - registros del día de hoy
 */
export async function evaluarTriggers(caminos, registrosHoy) {
  const hoy = hoyISO()

  // Solo un encuentro por día
  const encuentrosHoy = await db.encuentros.where('fecha').equals(hoy).count()
  if (encuentrosHoy > 0) return null

  const activos = caminos.filter(c => c.activo)
  const nadasHoy = registrosHoy.filter(r => r.marca === 'nada').length
  const avancesHoy = registrosHoy.filter(r => r.marca === 'avance').length
  const nivelG = nivelGlobal(caminos)

  // Joker: 3+ Nada en el mismo día
  if (nadasHoy >= 3 && (await diasDesdeUltimoEncuentro('joker')) >= 3) {
    return 'joker'
  }

  // Erwin: todos los caminos activos con racha >= 7
  const todosRacha7 = activos.length > 0 && activos.every(c => c.rachaActual >= 7)
  if (todosRacha7 && (await diasDesdeUltimoEncuentro('erwin')) >= 7) {
    return 'erwin'
  }

  // Esfinge: cualquier camino con racha >= 30
  const hayRacha30 = activos.some(c => c.rachaActual >= 30)
  if (hayRacha30 && (await diasDesdeUltimoEncuentro('esfinge')) >= 14) {
    return 'esfinge'
  }

  // GLaDOS: nivel global >= 10
  if (nivelG >= 10 && (await diasDesdeUltimoEncuentro('glados')) >= 30) {
    return 'glados'
  }

  // L Lawliet: 3+ avances hoy
  if (avancesHoy >= 3 && (await diasDesdeUltimoEncuentro('l_lawliet')) >= 7) {
    return 'l_lawliet'
  }

  // Shikamaru: cualquier camino con racha >= 5
  const hayRacha5 = activos.some(c => c.rachaActual >= 5)
  if (hayRacha5 && (await diasDesdeUltimoEncuentro('shikamaru')) >= 5) {
    return 'shikamaru'
  }

  // Uranai Baba: nivel global subió respecto a la última vez que apareció
  const nivelVisto = await db.configuracion.get('uranaiNivelVisto')
  if (nivelG > (nivelVisto?.value ?? -1)) {
    await db.configuracion.put({ key: 'uranaiNivelVisto', value: nivelG })
    return 'uranai_baba'
  }

  // Rick: pseudo-aleatorio 4% por día (determinístico por fecha)
  const rickSeed = parseInt(hoy.replace(/-/g, '')) % 100
  if (rickSeed < 4 && (await diasDesdeUltimoEncuentro('rick')) >= 14) {
    return 'rick'
  }

  return null
}

/**
 * Guarda un encuentro completado en DB y desbloquea el codex si es el primero.
 */
export async function guardarEncuentro({ entidadId, desafioIdx, respuesta, correcto, loreFragment }) {
  const hoy = hoyISO()

  await db.encuentros.add({
    id: uuidv4(),
    entidadId,
    fecha: hoy,
    desafioIdx,
    respuesta: respuesta ?? null,
    correcto: correcto ?? null,
    loreFragment,
    visto: false,
  })

  // Desbloquear codex si es el primer encuentro ever
  const total = await db.encuentros.count()
  if (total === 1) {
    await db.configuracion.put({ key: 'codexDesbloqueado', value: true })
  }
}

/**
 * Agrega XP al camino con menos XP entre los activos (mecánica de balanceo).
 */
export async function otorgarXpEncuentro(xpRecompensa) {
  const activos = await db.caminos.filter(c => c.activo).toArray()
  if (!activos.length) return
  const minCamino = activos.reduce((min, c) => (c.xp < min.xp ? c : min))
  const nuevoXp = (minCamino.xp ?? 0) + xpRecompensa
  const nuevoNivel = Math.floor(nuevoXp / 100)
  await db.caminos.update(minCamino.id, { xp: nuevoXp, nivel: nuevoNivel })
}
```

- [ ] **Commit**

```bash
git add src/hooks/useEncuentros.js
git commit -m "feat: hook useEncuentros con triggers y persistencia"
```

---

## Task 4: EncuentroModal.jsx — desafío interactivo

**Files:**
- Create: `src/components/hoy/EncuentroModal.jsx`

- [ ] **Crear el modal**

```jsx
// src/components/hoy/EncuentroModal.jsx
import { useState } from 'react'

const BOX_BG = '#0c0a18'
const BORDER_C = '#c8c0a8'

/**
 * Modal que presenta el desafío de una entidad.
 * Props:
 *   entidad   — objeto entidad de entidades.js
 *   desafio   — objeto desafio del array entidad.desafios
 *   desafioIdx — number
 *   onResult  — fn({ respuesta, correcto, loreFragment })
 */
export default function EncuentroModal({ entidad, desafio, desafioIdx, onResult }) {
  const [seleccionada, setSeleccionada] = useState(null)
  const [confirmada, setConfirmada]   = useState(false)

  const esCorrecta = (idx) => {
    if (desafio.respuestaCorrecta === null) return true // Joker: siempre correcto
    return String(idx) === String(desafio.respuestaCorrecta)
  }

  const handleConfirmar = () => {
    if (seleccionada === null) return
    setConfirmada(true)
    const correcto = esCorrecta(seleccionada)

    let lore = desafio.loreFragment
    if (desafio.loreFragmentOpciones) {
      lore = desafio.loreFragmentOpciones[seleccionada] ?? desafio.loreFragment
    }

    setTimeout(() => {
      onResult({ respuesta: String(seleccionada), correcto, loreFragment: lore })
    }, 1200)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Header entidad */}
      <div className="mb-4 flex items-center gap-2">
        <span style={{ fontSize: 28 }}>{entidad.icono}</span>
        <span className="font-pixel text-[10px]" style={{ color: entidad.color }}>
          {entidad.nombre.toUpperCase()}
        </span>
      </div>

      {/* Caja de desafío estilo Pokémon dialog */}
      <div style={{
        width: '100%', maxWidth: 420,
        border: `3px solid ${BORDER_C}`, background: BORDER_C, padding: 2, borderRadius: 2,
        marginBottom: 16,
      }}>
        <div style={{ background: BOX_BG, padding: '12px 14px', minHeight: 72 }}>
          <p className="font-body text-[13px] leading-relaxed" style={{ color: '#e8e0c8' }}>
            {desafio.enunciado}
          </p>
        </div>
      </div>

      {/* Opciones */}
      {desafio.tipo === 'opciones' && (
        <div className="w-full max-w-[420px] flex flex-col gap-2 mb-4">
          {desafio.opciones.map((op, idx) => {
            const esSel = seleccionada === idx
            const esCorr = confirmada && esCorrecta(idx)
            const esErr  = confirmada && esSel && !esCorrecta(idx)
            return (
              <button
                key={idx}
                disabled={confirmada}
                onClick={() => !confirmada && setSeleccionada(idx)}
                className="w-full text-left px-3 py-2.5 font-body text-[12px] transition-all active:translate-y-[1px]"
                style={{
                  background: esCorr ? '#0d2010' : esErr ? '#1a0505' : esSel ? `${entidad.color}18` : '#0c0a18',
                  border: `2px solid ${esCorr ? '#00e676' : esErr ? '#e94560' : esSel ? entidad.color : '#2a2838'}`,
                  borderRadius: 2,
                  color: esCorr ? '#00e676' : esErr ? '#e94560' : esSel ? entidad.color : '#a0989c',
                  boxShadow: esSel && !confirmada ? `0 0 8px ${entidad.color}30` : 'none',
                  cursor: confirmada ? 'default' : 'pointer',
                }}
              >
                {op}
                {esCorr && ' ✓'}
                {esErr  && ' ✗'}
              </button>
            )
          })}
        </div>
      )}

      {/* Botón confirmar */}
      {!confirmada && (
        <button
          onClick={handleConfirmar}
          disabled={seleccionada === null}
          className="w-full max-w-[420px] py-3 font-pixel text-[9px] disabled:opacity-30 active:translate-y-[1px]"
          style={{
            background: seleccionada !== null ? `${entidad.color}20` : '#1a1520',
            border: `2px solid ${seleccionada !== null ? entidad.color : '#2a2838'}`,
            borderRadius: 2,
            color: seleccionada !== null ? entidad.color : '#4a4654',
            boxShadow: seleccionada !== null ? `0 0 10px ${entidad.color}20` : 'none',
          }}
        >
          CONFIRMAR RESPUESTA
        </button>
      )}

      {confirmada && (
        <p className="font-pixel text-[8px] animate-pulse" style={{ color: entidad.color }}>
          {esCorrecta(seleccionada) ? '✓ CORRECTO' : '✗ INCORRECTO'}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/hoy/EncuentroModal.jsx
git commit -m "feat: EncuentroModal con desafío interactivo"
```

---

## Task 5: EncuentroDelDia.jsx — tarjeta de encuentro con typewriter

**Files:**
- Create: `src/components/hoy/EncuentroDelDia.jsx`

- [ ] **Crear el componente**

```jsx
// src/components/hoy/EncuentroDelDia.jsx
import { useState, useEffect } from 'react'
import { db } from '../../db'
import { hoyISO } from '../../utils/dates'
import { evaluarTriggers, guardarEncuentro, otorgarXpEncuentro } from '../../hooks/useEncuentros'
import { getEntidad, elegirDesafio, elegirIntro } from '../../entidades'
import EncuentroModal from './EncuentroModal'
import ChallengeResultPopup from '../shared/ChallengeResultPopup'

// Typewriter hook (inline para no crear dependencia)
function useTypewriter(text, speed = 38) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setIdx(0)
    if (!text) return
    const id = setInterval(() => {
      setIdx(prev => {
        if (prev >= text.length) { clearInterval(id); return prev }
        return prev + 1
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return text ? text.slice(0, idx) : ''
}

export default function EncuentroDelDia({ caminos, registrosHoy }) {
  const [fase, setFase]           = useState('evaluando') // evaluando | flash | tarjeta | modal | resultado | cerrado
  const [entidadId, setEntidadId] = useState(null)
  const [desafioData, setDesafioData] = useState(null) // { desafio, desafioIdx }
  const [resultado, setResultado]   = useState(null)   // { correcto, loreFragment }
  const introText = entidadId ? elegirIntro(getEntidad(entidadId), hoyISO()) : ''
  const introVisible = useTypewriter(fase === 'tarjeta' ? introText : '', 40)

  useEffect(() => {
    if (!caminos?.length) return
    let cancelled = false
    async function init() {
      const hoy = hoyISO()
      // ¿Ya hubo encuentro hoy?
      const yaHubo = await db.encuentros.where('fecha').equals(hoy).count()
      if (yaHubo > 0 || cancelled) { setFase('cerrado'); return }

      const id = await evaluarTriggers(caminos, registrosHoy || [])
      if (!id || cancelled) { setFase('cerrado'); return }

      const entidad = getEntidad(id)
      if (!entidad) { setFase('cerrado'); return }

      setEntidadId(id)
      setDesafioData(elegirDesafio(entidad, hoy))
      setFase('flash')

      setTimeout(() => {
        if (!cancelled) setFase('tarjeta')
      }, 1400)
    }
    init()
    return () => { cancelled = true }
  }, [caminos, registrosHoy]) // eslint-disable-line

  if (fase === 'evaluando' || fase === 'cerrado') return null

  const entidad = getEntidad(entidadId)
  if (!entidad) return null

  // ── Flash de encuentro ─────────────────────────────────────────────────────
  if (fase === 'flash') {
    return (
      <div className="animate-encounter-flash" style={{
        position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
      }} />
    )
  }

  // ── Modal de desafío ───────────────────────────────────────────────────────
  if (fase === 'modal') {
    return (
      <EncuentroModal
        entidad={entidad}
        desafio={desafioData.desafio}
        desafioIdx={desafioData.desafioIdx}
        onResult={async ({ respuesta, correcto, loreFragment }) => {
          setResultado({ correcto, loreFragment })
          await guardarEncuentro({
            entidadId,
            desafioIdx: desafioData.desafioIdx,
            respuesta,
            correcto,
            loreFragment,
          })
          if (correcto) {
            await otorgarXpEncuentro(desafioData.desafio.xpRecompensa)
          }
          setFase('resultado')
        }}
      />
    )
  }

  // ── Resultado ──────────────────────────────────────────────────────────────
  if (fase === 'resultado' && resultado) {
    return (
      <ChallengeResultPopup
        type={resultado.correcto ? 'win' : 'lose'}
        xp={resultado.correcto ? desafioData.desafio.xpRecompensa : 0}
        titulo={resultado.correcto ? '¡RESPUESTA CORRECTA!' : 'RESPUESTA INCORRECTA'}
        mensaje={resultado.loreFragment}
        onClose={() => setFase('cerrado')}
      />
    )
  }

  // ── Tarjeta de encuentro ───────────────────────────────────────────────────
  return (
    <div
      className="mx-4 mb-3 p-3 animate-card-entrance"
      style={{
        background: `linear-gradient(180deg, #1e1830 0%, #0c0a18 100%)`,
        border: `2px solid ${entidad.color}60`,
        borderLeft: `3px solid ${entidad.color}`,
        borderRadius: 2,
        boxShadow: `4px 4px 0 rgba(0,0,0,0.7), 0 0 20px ${entidad.color}15`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[8px]" style={{ color: entidad.color }}>
          ✦ ENCUENTRO SECRETO
        </span>
        <button
          onClick={() => setFase('cerrado')}
          className="font-pixel text-[10px] text-text-muted px-1"
        >✕</button>
      </div>

      {/* Personaje + intro */}
      <div className="flex items-start gap-3 mb-3">
        <div style={{
          flexShrink: 0, padding: 8, fontSize: 32,
          background: `${entidad.color}10`,
          border: `2px solid ${entidad.color}30`,
          borderRadius: 2,
          lineHeight: 1,
        }}>
          {entidad.icono}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[10px] mb-1" style={{ color: entidad.color }}>
            {entidad.nombre}
          </p>
          <p className="font-body text-[13px] leading-snug" style={{ color: '#e8e6e3', fontStyle: 'italic', minHeight: 20 }}>
            {introVisible || '...'}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => setFase('modal')}
        className="w-full py-2.5 font-pixel text-[9px] active:translate-y-[1px] transition-transform"
        style={{
          background: `${entidad.color}15`,
          border: `2px solid ${entidad.color}70`,
          borderRadius: 2,
          color: entidad.color,
          boxShadow: `2px 2px 0 rgba(0,0,0,0.5), 0 0 12px ${entidad.color}20`,
        }}
      >
        ⚔ ACEPTAR DESAFÍO
      </button>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/hoy/EncuentroDelDia.jsx
git commit -m "feat: EncuentroDelDia con flash, typewriter y modal"
```

---

## Task 6: Componentes del Codex

**Files:**
- Create: `src/components/codex/EntidadCard.jsx`
- Create: `src/components/codex/EntidadDetalle.jsx`
- Create: `src/components/codex/CodexView.jsx`

- [ ] **Crear EntidadCard.jsx**

```jsx
// src/components/codex/EntidadCard.jsx

/**
 * Props:
 *   entidad        — objeto de entidades.js
 *   encuentros     — array de encuentros con esa entidad (puede ser [])
 *   desbloqueada   — boolean (false = silueta con ???)
 *   onClick        — fn()
 */
export default function EntidadCard({ entidad, encuentros, desbloqueada, onClick }) {
  const victorias = encuentros.filter(e => e.correcto).length
  const intentos  = encuentros.length

  if (!desbloqueada) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 p-3 w-full text-left"
        style={{
          background: '#0c0a18',
          border: '2px solid #1e1830',
          borderRadius: 2,
          opacity: 0.6,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 2,
          background: `${entidad.color}08`,
          border: `2px solid ${entidad.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: 'blur(1px) brightness(0.3)',
          fontSize: 24,
        }}>
          {entidad.icono}
        </div>
        <div>
          <p className="font-pixel text-[9px]" style={{ color: '#2a2838' }}>??? ??? ???</p>
          <p className="font-pixel text-[7px] mt-1" style={{ color: '#1e1830' }}>BLOQUEADO</p>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 w-full text-left transition-all active:translate-y-[1px]"
      style={{
        background: `${entidad.color}08`,
        border: `2px solid ${entidad.color}40`,
        borderLeft: `3px solid ${entidad.color}`,
        borderRadius: 2,
        boxShadow: `0 0 12px ${entidad.color}10`,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 2,
        background: `${entidad.color}15`,
        border: `2px solid ${entidad.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>
        {entidad.icono}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-pixel text-[10px]" style={{ color: entidad.color }}>{entidad.nombre}</p>
        <p className="font-pixel text-[7px] mt-1" style={{ color: '#6a5880' }}>
          {intentos} encuentro{intentos !== 1 ? 's' : ''} · {victorias} ✓
        </p>
      </div>
      <span className="font-pixel text-[10px]" style={{ color: `${entidad.color}80` }}>›</span>
    </button>
  )
}
```

- [ ] **Crear EntidadDetalle.jsx**

```jsx
// src/components/codex/EntidadDetalle.jsx

export default function EntidadDetalle({ entidad, encuentros, onBack }) {
  const ordenados = [...encuentros].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #1e1830' }}>
        <button
          onClick={onBack}
          className="font-pixel text-[8px] text-text-muted mb-3 flex items-center gap-1"
        >
          ‹ VOLVER AL CODEX
        </button>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 36 }}>{entidad.icono}</span>
          <div>
            <p className="font-pixel text-[13px]" style={{ color: entidad.color }}>{entidad.nombre}</p>
            <p className="font-pixel text-[7px] mt-1 text-text-muted">
              {encuentros.length} encuentro{encuentros.length !== 1 ? 's' : ''} · {encuentros.filter(e => e.correcto).length} resueltos
            </p>
          </div>
        </div>
      </div>

      {/* Fragmentos de lore */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-3">
        {ordenados.length === 0 && (
          <p className="font-pixel text-[8px] text-text-muted text-center mt-8">
            Aún no hay encuentros registrados.
          </p>
        )}
        {ordenados.map(enc => (
          <div
            key={enc.id}
            style={{
              background: '#0c0a18',
              border: `2px solid ${enc.correcto ? entidad.color + '40' : '#2a1828'}`,
              borderLeft: `3px solid ${enc.correcto ? entidad.color : '#4a2038'}`,
              borderRadius: 2,
              padding: '10px 12px',
            }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-pixel text-[7px]" style={{ color: '#4a4654' }}>{enc.fecha}</span>
              <span className="font-pixel text-[7px]" style={{ color: enc.correcto ? '#00e676' : '#e94560' }}>
                {enc.correcto ? '✓ RESUELTO' : '✗ FALLIDO'}
              </span>
            </div>
            <p className="font-body text-[12px] leading-snug" style={{ color: '#c8c0b8', fontStyle: 'italic' }}>
              "{enc.loreFragment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Crear CodexView.jsx**

```jsx
// src/components/codex/CodexView.jsx
import { useState } from 'react'
import { useHistorialEncuentros } from '../../hooks/useEncuentros'
import { ENTIDADES, getEntidad } from '../../entidades'
import EntidadCard from './EntidadCard'
import EntidadDetalle from './EntidadDetalle'

export default function CodexView() {
  const historial = useHistorialEncuentros()
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null)

  const entidadesConEncuentros = new Set(historial.map(e => e.entidadId))

  if (entidadSeleccionada) {
    const entidad   = getEntidad(entidadSeleccionada)
    const encuentros = historial.filter(e => e.entidadId === entidadSeleccionada)
    return (
      <EntidadDetalle
        entidad={entidad}
        encuentros={encuentros}
        onBack={() => setEntidadSeleccionada(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #1e1830' }}>
        <p className="font-pixel text-[7px] text-text-muted mb-1">ARCHIVO OCULTO</p>
        <h1 className="font-pixel text-[14px]" style={{ color: '#d4a843' }}>CODEX DE LA PSIQUE</h1>
        <p className="font-body text-[12px] text-text-muted mt-1">
          {entidadesConEncuentros.size} de {ENTIDADES.length} entidades descubiertas
        </p>
      </div>

      {/* Lista de entidades */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-2">
        {/* Conocidas primero */}
        <p className="font-pixel text-[7px] text-text-muted mb-1">ENTIDADES CONOCIDAS</p>
        {ENTIDADES.filter(e => !e.secreto).map(entidad => {
          const encuentros = historial.filter(e => e.entidadId === entidad.id)
          return (
            <EntidadCard
              key={entidad.id}
              entidad={entidad}
              encuentros={encuentros}
              desbloqueada={entidadesConEncuentros.has(entidad.id)}
              onClick={() => entidadesConEncuentros.has(entidad.id) && setEntidadSeleccionada(entidad.id)}
            />
          )
        })}

        {/* Secretas */}
        <p className="font-pixel text-[7px] text-text-muted mb-1 mt-3">ENTIDADES OCULTAS</p>
        {ENTIDADES.filter(e => e.secreto).map(entidad => {
          const encuentros = historial.filter(e => e.entidadId === entidad.id)
          const desbloqueada = entidadesConEncuentros.has(entidad.id)
          return (
            <EntidadCard
              key={entidad.id}
              entidad={entidad}
              encuentros={encuentros}
              desbloqueada={desbloqueada}
              onClick={() => desbloqueada && setEntidadSeleccionada(entidad.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/codex/
git commit -m "feat: componentes del Codex de la Psique (EntidadCard, EntidadDetalle, CodexView)"
```

---

## Task 7: Wiring — conectar todo a la app

**Files:**
- Modify: `src/components/hoy/HoyView.jsx`
- Modify: `src/components/progreso/ProgresoView.jsx`
- Modify: `src/App.jsx`

### 7a: HoyView.jsx — agregar EncuentroDelDia

- [ ] **Agregar import de EncuentroDelDia**

En `src/components/hoy/HoyView.jsx`, después de `import EventoDelDia from './EventoDelDia'` (línea 18), agregar:

```jsx
import EncuentroDelDia from './EncuentroDelDia'
```

- [ ] **Pasar caminos y registros al componente**

En el JSX de HoyView (después de `<EventoDelDia />`, línea 117), agregar:

```jsx
{/* Encuentro secreto del día */}
<EncuentroDelDia caminos={todosCaminos || []} registrosHoy={registrosHoy} />
```

### 7b: ProgresoView.jsx — botón condicional al Codex

- [ ] **Agregar imports necesarios**

En `src/components/progreso/ProgresoView.jsx`, agregar al inicio de los imports:

```jsx
import { useCodexDesbloqueado } from '../../hooks/useEncuentros'
```

- [ ] **Agregar hook y botón en ProgresoView**

Dentro del componente `ProgresoView()`, después de `const activos = caminos.filter(c => c.activo)` agregar:

```jsx
const codexDesbloqueado = useCodexDesbloqueado()
```

Y en el JSX, al inicio del return (antes del primer gráfico), agregar:

```jsx
{codexDesbloqueado && (
  <button
    onClick={() => onAbrirCodex && onAbrirCodex()}
    className="mx-4 mt-4 mb-2 w-full py-3 font-pixel text-[9px] active:translate-y-[1px] flex items-center justify-center gap-2"
    style={{
      background: 'linear-gradient(180deg, #1a1228, #0c0a18)',
      border: '2px solid #d4a84370',
      borderRadius: 2,
      color: '#d4a843',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.6), 0 0 16px #d4a84320',
    }}
  >
    📜 CODEX DE LA PSIQUE
  </button>
)}
```

Nota: ProgresoView necesita recibir `onAbrirCodex` como prop — se lo pasamos desde App.jsx en el siguiente paso.

### 7c: App.jsx — agregar CodexView y prop onAbrirCodex

- [ ] **Agregar import de CodexView**

En `src/App.jsx`, agregar junto a los otros imports de vistas:

```jsx
import CodexView from './components/codex/CodexView'
```

- [ ] **Agregar estado y lógica de navegación al Codex**

En `src/App.jsx`, dentro del componente `App()`, agregar estado:

```jsx
const [mostrarCodex, setMostrarCodex] = useState(false)
```

- [ ] **Renderizar CodexView cuando corresponda**

Reemplazar la sección del `<main>` en App.jsx:

```jsx
<main
  className={`flex-1 flex flex-col pb-14 overflow-y-auto
    ${curtain === 'out' ? 'animate-curtain-out' : ''}
    ${curtain === 'in'  ? 'animate-curtain-in'  : ''}`}
>
  {mostrarCodex ? (
    <div className="flex flex-col min-h-full">
      <button
        onClick={() => setMostrarCodex(false)}
        className="px-4 pt-4 pb-2 font-pixel text-[8px] text-text-muted text-left flex items-center gap-1"
      >
        ‹ VOLVER
      </button>
      <CodexView />
    </div>
  ) : (
    <Vista onAbrirCodex={tabActivo === 'progreso' ? () => setMostrarCodex(true) : undefined} />
  )}
</main>
```

- [ ] **Verificar que ProgresoView acepta la prop**

Abrir `src/components/progreso/ProgresoView.jsx` y asegurarse de que el componente recibe `onAbrirCodex` en su firma:

```jsx
export default function ProgresoView({ onAbrirCodex }) {
```

- [ ] **Commit final**

```bash
git add src/components/hoy/HoyView.jsx src/components/progreso/ProgresoView.jsx src/App.jsx
git commit -m "feat: wiring completo — EncuentroDelDia en HoyView, Codex en ProgresoView y App"
```

---

## Task 8: Verificación completa

- [ ] **Ejecutar la app**

```bash
npm run dev
```

- [ ] **Verificar bug fix:** Abrir la app, cerrar el evento del día, recargar. El evento NO debe reaparecer.

- [ ] **Verificar encuentro:** Para forzar un encuentro de prueba, abrir la consola del navegador y ejecutar:

```js
// Forzar un encuentro de Shikamaru (bypass de triggers)
import('/src/db.js').then(m => {
  m.db.encuentros.clear() // limpiar encuentros anteriores
})
// Luego marcar cualquier camino como avance 5 veces para alcanzar racha, o bien
// modificar temporalmente el % de Rick a 100 en useEncuentros.js
```

Alternativamente, modificar temporalmente en `useEncuentros.js` el trigger de Rick de `< 4` a `< 100`, recargar, y verificar que aparece la tarjeta de encuentro.

- [ ] **Verificar flujo completo:** Flash → tarjeta con typewriter → aceptar desafío → modal → elegir opción → confirmar → resultado (win/lose) → cerrar. Verificar en DevTools → IndexedDB → encuentros que se guardó el registro.

- [ ] **Verificar Codex:** Ir a tab STATS → verificar que aparece botón "CODEX DE LA PSIQUE" → abrirlo → ver entidades conocidas (bloqueadas) y secretas (silueta ???) → la entidad del encuentro debe estar desbloqueada con su lore fragment.

- [ ] **Restaurar trigger de Rick** si fue modificado para testing.

- [ ] **Commit final de verificación**

```bash
git add -p  # solo si hay cambios
git commit -m "chore: verificación completa del sistema Codex de la Psique"
```

---

## Self-Review

**Spec coverage:**
- ✅ Bug fix EventoDelDia (Task 0)
- ✅ DB tabla `encuentros` (Task 1)
- ✅ 8 entidades con datos completos incluyendo secretas (Task 2)
- ✅ Triggers para todas las 8 entidades (Task 3)
- ✅ Flash + typewriter + tarjeta de encuentro (Task 5)
- ✅ Modal de desafío con opciones (Task 4)
- ✅ Guardar en DB, desbloquear Codex tras primer encuentro (Task 3)
- ✅ XP otorgado al camino con menos XP si correcto (Task 3)
- ✅ ChallengeResultPopup reutilizado para resultado (Task 5)
- ✅ Codex con entidades conocidas/secretas, desbloqueadas/silueta (Task 6)
- ✅ Lore fragments guardados y visibles en EntidadDetalle (Task 6)
- ✅ Botón Codex en ProgresoView condicional a codexDesbloqueado (Task 7)
- ✅ Joker: loreFragmentOpciones para respuesta contextual (Task 2 + 4)

**Tipos consistentes:**
- `guardarEncuentro` acepta `{ entidadId, desafioIdx, respuesta, correcto, loreFragment }` — igual que lo que envía `EncuentroModal` vía `onResult`
- `elegirDesafio` retorna `{ desafio, desafioIdx }` — mismo shape que `desafioData` en `EncuentroDelDia`
- `useCodexDesbloqueado` retorna boolean — usado directamente en ProgresoView
- `onAbrirCodex` prop pasada de App → ProgresoView cuando `tabActivo === 'progreso'`

**Sin placeholders:** Todas las tareas tienen código completo.
