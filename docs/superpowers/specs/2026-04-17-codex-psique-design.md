# Spec: Codex de la Psique + Fix EventoDelDia

**Fecha:** 2026-04-17
**Estado:** Aprobado

---

## Problema a resolver (bug)

`EventoDelDia.jsx` usa `db` sin importarlo. El `catch` silencia el error y el evento aparece siempre al recargar. **Fix:** agregar `import { db } from '../../db'`.

---

## Feature: Sistema de Encuentros Secretos + Codex de la Psique

### Visión general

Sistema de eventos ocultos tipo RPG donde 8 personajes (4 conocidos + 4 secretos) aparecen bajo condiciones específicas y presentan desafíos mentales. Los encuentros se persisten en IndexedDB. Una pantalla secreta ("Codex de la Psique") se desbloquea tras el primer encuentro y registra todo el historial.

---

## Las 8 Entidades

### Conocidas (visibles desde el inicio en el Codex una vez desbloqueado)

| ID | Personaje | Color | Tipo de desafío | Trigger |
|----|-----------|-------|-----------------|---------|
| `uranai_baba` | 🔮 Uranai Baba | `#c9942a` | Profecía: 3 frases, elegir la verdadera | Al subir nivel global |
| `erwin` | 🎖️ Erwin Smith | `#8a9bb0` | Dilema táctico con sacrificio + justificación libre | Racha perfecta 7 días en todos los caminos activos |
| `shikamaru` | ☁️ Shikamaru | `#7a9e5a` | Puzzle lógico / secuencia numérica | Mismo camino completado 5 días seguidos |
| `rick` | 🧪 Rick Sanchez | `#5ab8c0` | Acertijo científico + pregunta existencial | Aleatorio 4% por día |

### Secretas (silueta + ??? hasta que se desbloquean)

| ID | Personaje | Color | Tipo de desafío | Trigger |
|----|-----------|-------|-----------------|---------|
| `l_lawliet` | 🍰 L Lawliet | `#e8e6e3` | Resolver un crimen con 3 pistas contradictorias | 3 caminos distintos con ✓ en el mismo día, 10 veces acumuladas |
| `glados` | 🤖 GLaDOS | `#a8e063` | Protocolo de prueba: 5 preguntas lógicas secuenciales | Nivel global ≥ 10 |
| `esfinge` | 🗿 La Esfinge | `#d4a843` | Acertijo clásico con giro personal al final | Racha global de 30+ días (cualquier camino) |
| `joker` | 🃏 El Joker | `#cc3355` | Dilema moral caótico sin respuesta correcta | 3 marcas ○ Nada en un mismo día |

---

## Schema IndexedDB — nueva tabla `encuentros`

```js
{
  id: string,           // uuid
  entidadId: string,    // 'uranai_baba', 'erwin', etc.
  fecha: string,        // 'YYYY-MM-DD'
  desafioIdx: number,   // índice del desafío presentado
  respuesta: string | null,
  correcto: boolean | null,
  loreFragment: string, // frase que dejó el personaje
  visto: boolean        // si el usuario ya vio el resultado
}
```

Nueva clave en `configuracion`: `'codexDesbloqueado'` → boolean

---

## Datos de los desafíos (hardcodeados en constants)

Cada entidad tiene:
```js
{
  id: string,
  nombre: string,
  color: string,
  icono: string,
  intro: string[],        // frases de entrada (3-4, rotación aleatoria)
  fraseExito: string[],   // al acertar
  fraseFallo: string[],   // al fallar
  desafios: [
    {
      tipo: 'opciones' | 'texto_libre' | 'codigo' | 'secuencia',
      enunciado: string,
      opciones?: string[],          // para tipo 'opciones'
      respuestaCorrecta?: string,   // para tipos con respuesta única
      xpRecompensa: number,
      loreFragment: string          // texto que queda guardado si lo resuelve
    }
  ]
}
```

---

## Flujo de un encuentro

```
1. Al montar HoyView → evaluarTriggers()
2. Si hay trigger activo Y no hay encuentro del mismo personaje hoy → disparar
3. Flash de pantalla (estilo encounter RPG)
4. Tarjeta de encuentro con intro del personaje (2-3 líneas animadas, letra a letra)
5. Botón "ACEPTAR DESAFÍO" → modal con el desafío
6. Usuario responde
7. Feedback inmediato (correcto/incorrecto) con frase del personaje
8. +XP si correcto → animación XpAnimation existente
9. Se guarda en tabla `encuentros`
10. Si es primer encuentro ever → marcar codexDesbloqueado=true → aparece ícono en nav
```

---

## Componentes nuevos

```
src/components/hoy/
  EncuentroDelDia.jsx       — tarjeta de encuentro (reemplaza/coexiste con EventoDelDia)
  EncuentroModal.jsx        — modal con el desafío interactivo
  EncuentroResultado.jsx    — pantalla de resultado (correcto/incorrecto)

src/components/codex/
  CodexView.jsx             — pantalla principal del codex
  EntidadCard.jsx           — tarjeta de personaje (desbloqueada o silueta)
  EntidadDetalle.jsx        — historial de encuentros con un personaje

src/hooks/
  useEncuentros.js          — lógica de triggers, guardar encuentros, consultar historial

src/
  entidades.js              — todos los datos hardcodeados (personajes, desafíos, lore)
```

---

## Navegación — Codex

- **Antes del primer encuentro:** 5 tabs normales, sin Codex
- **Después del primer encuentro:** El tab STATS (progreso) muestra un punto de notificación rojo la primera vez. Dentro de ProgresoView aparece un botón "CODEX DE LA PSIQUE" que lleva a CodexView.
- **Alternativa:** Tap largo en el header de nivel global → abre Codex directamente (easter egg de navegación)

---

## Visual — estética

- Encuentro: flash blanco → negro → aparece tarjeta con animación slide-up
- Texto de intro: aparece letra a letra (typewriter), velocidad media
- Personajes secretos en Codex: silueta oscura con glow muy sutil del color del personaje
- Codex background: textura de pergamino digital oscuro, bordes quemados CSS
- Al desbloquear una entidad secreta: animación de "reveal" — silueta se ilumina gradualmente

---

## Spec Self-Review

- ✅ Sin TBDs ni secciones incompletas
- ✅ Schema consistente con el resto del proyecto (Dexie, IndexedDB)
- ✅ Componentes alineados con estructura de archivos existente
- ✅ Triggers definidos con precisión para cada entidad
- ✅ Alcance acotado — no incluye audio, multijugador, ni sincronización
- ✅ Las 4 entidades secretas tienen triggers, colores y desafíos definidos internamente pero no se revelan en la UI
