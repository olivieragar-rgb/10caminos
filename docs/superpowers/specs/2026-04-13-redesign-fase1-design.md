# Spec: Rediseño Visual Fase 1 — 10 Caminos

**Fecha:** 2026-04-13
**Estado:** Aprobado por usuario
**Alcance:** Rediseño visual completo + mecánicas de misión + tablón semanal + sistema de personajes

---

## 1. Sistema de Tipografía

### Cambio
Reemplazar `"Press Start 2P"` por `"Cinzel"` (Google Fonts) en todos los títulos, labels de sección, badges y etiquetas de estado. `"Share Tech Mono"` se añade como fuente secundaria para datos técnicos (XP, fechas, contadores).

### Aplicación
- Títulos de vista y headers: `Cinzel 700-900`
- Labels de estado ("MISIÓN ACTIVA", "LOGRADO HOY"): `Cinzel 400`, letter-spacing 2-3px
- Datos numéricos y técnicos (XP, fechas, step N/M): `Share Tech Mono`
- Texto de cuerpo (notas, descripciones): `font-body` (existente, sin cambio)

### Implementación
Añadir al `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```
Añadir a `tailwind.config.js`:
```js
fontFamily: {
  pixel: ['"Cinzel"', 'serif'],       // reemplaza Press Start 2P
  mono:  ['"Share Tech Mono"', 'monospace'],
  body:  ['Inter', 'system-ui', 'sans-serif'],
}
```

---

## 2. Rediseño de CaminoCard

### Estructura visual
Tarjeta con estética cyberpunk suave:
- `background: linear-gradient(160deg, #0d0d1c, #080810)`
- `border: 1px solid var(--neon-color)` — color varía por estado
- `box-shadow: 0 0 8px var(--neon-glow), inset 0 0 12px var(--neon-inner)` — glow neon completo
- `border-radius: 3px` — sin cortes diagonales agresivos
- Línea decorativa superior: `::before` con gradiente del color neon
- Scan lines sutiles: `::after` con `repeating-linear-gradient`

### Colores de estado (variable CSS `--neon-color`)
| Estado | Color borde | Fondo card | Fondo bloque misión |
|--------|-------------|------------|---------------------|
| Sin marcar hoy | `#00d4ff` (cyan) | `#0d0d1c` | `rgba(200,150,0,0.09)` + borde mostaza |
| Marcado PENDIENTE | `#c89600` (ámbar) | `#0d0c00` | `rgba(200,150,0,0.09)` + borde ámbar |
| Marcado LOGRADO | `#00a84a` (verde) | `#050d06` | `rgba(0,168,74,0.08)` + borde verde |
| Marcado HOY NO | `#484860` (gris) | `#0a0a0f` | `rgba(60,60,90,0.08)` + borde gris |
| Sin ruta activa | `#cc0044` (rojo) | `#0d0006` | `rgba(200,0,60,0.07)` + borde rojo |

### Chips de stats (header)
```jsx
// Share Tech Mono 8px, clip-path trapezoide suave
<span className="chip chip-xp">NV.3</span>
<span className="chip chip-racha">🔥×5</span>
```

---

## 3. Bloque MISIÓN (nuevo componente MisionBlock)

### Cuando hay ruta activa con paso definido
```
┌─ ⚡ MISIÓN PENDIENTE ──────────────── [✏ EDITAR] ─┐
│                                                    │
│  ▸ Hacer 30 min de cardio al despertar             │
│                                                    │
│  Ruta Maratón · paso 2/8                          │
│  ─────────────────────────────────────            │
│  // Sesión de fuerza · piernas                    │
│  // Día de descanso activo                        │
└────────────────────────────────────────────────────┘
```
- Fondo: color del estado actual (mostaza/verde/gris)
- Texto acción: `Cinzel 700 13px`, color según estado
- Cola de próximos pasos: `Share Tech Mono 8px`, color muy tenue
- Botón `✏ EDITAR`: abre inline un input para editar el texto del paso actual
- Progreso de ruta: barra `3px` con glow del color

### Cuando hay ruta pero sin paso siguiente
- Fondo naranja alerta
- Mensaje: "La ruta no tiene siguiente paso asignado"
- CTA: `+ AÑADIR ACCIÓN A LA COLA` — abre un input inline para añadir paso

### Cuando no hay ruta activa
- Fondo rojo
- Dos CTAs: `🤖 PEDIR RUTA AL ASISTENTE` (navega al tab Chat con mensaje prefillado) y `+ CREAR MANUALMENTE` (navega al tab Rutas)

### Bloqueo de botones
Los tres botones de marca están **desactivados** (`opacity: 0.15, cursor: not-allowed`) cuando:
- No hay ruta activa
- Hay ruta pero `pasos` está vacío o `pasoActual >= pasos.length`

---

## 4. Nuevos Botones de Marca

| Antes | Ahora | Emoji | Color |
|-------|-------|-------|-------|
| `✓ AVANCE` | `⚔ ¡LOGRADO!` | ⚔ | verde `#00cc66` |
| `→ PAUSA` | `⏳ PENDIENTE` | ⏳ | ámbar `#c89600` |
| `○ NADA` | `✗ HOY NO` | ✗ | gris `#505068` |

Estilo: `clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)`, línea neon superior via `::after`.

---

## 5. Animación de Celebración (¡LOGRADO!)

Al marcar `avance`, después de guardar el XP, mostrar un overlay de celebración de **1.5 segundos**:

### Componente `CelebrationFlash`
- Overlay semitransparente sobre la tarjeta (`position: absolute, inset: 0, z-index: 30`)
- Personaje pixel art (sprite del personaje de mayor nivel desbloqueado por el usuario) con animación:
  - Salta 2 veces (`@keyframes celebJump: translateY(0) → -8px → 0`)
  - Partículas de estrella `✦` flotando hacia arriba (`@keyframes floatUp`)
  - Texto `+{xpGanado} XP` en dorado flotando
- Se auto-cierra a los 1500ms
- Si sube de nivel: duración 3s + texto `⬆ NIVEL {nivel}` adicional

---

## 6. Cola de Pasos (Playlist)

### Gestión inline desde CaminoCard
El botón `✏ EDITAR` del bloque misión expande un panel bajo el bloque:
```
[texto paso actual........] [✓ OK]
[+ Añadir siguiente paso..]
  // paso 3: Sesión piernas     [↑] [↓] [✕]
  // paso 4: Descanso activo    [↑] [↓] [✕]
```
- Editar texto del paso actual: input inline
- Añadir nuevos pasos al final de la cola
- Reordenar pasos con `↑` `↓`
- Eliminar pasos con `✕`
- Guardar: `db.rutas.update(rutaId, { pasos: [...] })`

### Auto-avance
Al marcar ¡LOGRADO!, `marcarCamino` ya incrementa `pasoActual`. Si `pasoActual >= pasos.length`, la ruta pasa a estado `"completada"` automáticamente y se muestra notificación.

---

## 7. Tablón Semanal (CronicaSemanal)

### Ubicación
Componente nuevo al **inicio de HoyView**, encima de la lista de caminos. Siempre visible, colapsable con tap.

### Layout
```
[Char1] ┌─ ⚔ CRÓNICA SEMANAL ────────── 7-13 ABR ─┐
[Char2] │  34/56   L ✓  M ✓  X →  J ✓  V ✗  S ✗  H · │
[Char3] │  👨‍👧‍👦 ████████░░░░░  +52 XP               │
[????] │  💛 ██████████░░  +62 XP               │
[????] │  💪 ███████░░░░░  +44 XP               │
        └────────────────────────────────────────────┘
```

### Datos mostrados
- Score global de la semana: avances / (caminos_activos × días_transcurridos)
- Días L-D con color: verde=mayoría avances, ámbar=mayoría pausas, rojo=mayoría nada, cyan=hoy
- Por camino: barra de progreso semanal + XP ganado esta semana
- Todos los caminos activos, ordenados por XP ganado esta semana (desc)

### Fuente de datos
```js
// Registros de lunes a hoy
const inicioSemana = getMonday(new Date())
const registrosSemana = await db.registros
  .where('fecha').between(inicioSemanaISO, hoyISO)
  .toArray()
```

---

## 8. Sistema de Personajes

### Almacenamiento
Nueva tabla Dexie `personajes` (o usar `configuracion` con key `personajesDesbloqueados: string[]`). Más simple: array en `configuracion`.

### Personajes y niveles de desbloqueo (nivel global del personaje)
| NV | Personaje | Color glow |
|----|-----------|------------|
| 1 | Gon | verde |
| 2 | Pikachu | amarillo |
| 3 | Killua | azul claro |
| 4 | Totoro | gris verde |
| 5 | Goku | naranja |
| 6 | Naruto | naranja claro |
| 7 | Megaman | azul |
| 8 | Majin Boo | rosa |
| 9 | Sasuke | rojo oscuro |
| 10 | Donkey Kong | marrón |
| 11 | Frieren | plata |
| 12 | Itadori | rosa oscuro |
| 13 | Jiraiya | blanco |
| 14 | Magmar | naranja fuego |
| 15 | Don Quijote | plata |
| 16 | Frieza | púrpura |
| 17 | Hisoka | magenta |
| 18 | Chainsaw Man | rojo sangre |
| 19 | Susuwatari | negro |
| 20 | ??? Leyenda | dorado |

### Detección de desbloqueo
En `marcarCamino` (ya tiene lógica de detección de nivel), añadir:
```js
// nivelGlobal = Math.floor(promedio de xpANivel(c.xp) de caminos activos)
const nivelGlobalAnterior = Math.floor(caminosActivos.reduce((s,c) => s + xpANivel(c.xp - xpGanado), 0) / caminosActivos.length)
const nivelGlobalNuevo    = Math.floor(caminosActivos.reduce((s,c) => s + xpANivel(c.xp), 0) / caminosActivos.length)
const personajeDesbloqueado = PERSONAJES.find(p =>
  p.nivelDesbloqueo > nivelGlobalAnterior &&
  p.nivelDesbloqueo <= nivelGlobalNuevo
)
```

### Modal de desbloqueo
Si se detecta nuevo personaje: modal con animación de "aparición" (fade + scale from 0.5 to 1), nombre del personaje, sprite grande, mensaje narrativo tipo `"¡Goku se une a tu camino!"`. Botón "RECIBIR".

### Componente PersonajesColumna
- Columna de 42×42px slots a la izquierda del tablón
- Muestra los últimos 5 desbloqueados (scroll si hay más)
- Slots no desbloqueados: `🔒`, opacity 0.2
- Hover en slot desbloqueado: tooltip con nombre + nivel de desbloqueo
- Sprites en SVG pixel art (inline, definidos en `constants.js`)

---

## 9. Archivos a Crear/Modificar

### Nuevos componentes
- `src/components/hoy/MisionBlock.jsx` — bloque misión con estados y edición inline
- `src/components/hoy/CronicaSemanal.jsx` — tablón semanal
- `src/components/hoy/PersonajesColumna.jsx` — columna de personajes
- `src/components/hoy/CelebrationFlash.jsx` — overlay celebración ¡LOGRADO!
- `src/components/shared/PersonajeUnlockModal.jsx` — modal desbloqueo personaje

### Modificados
- `src/components/hoy/CaminoCard.jsx` — nuevo diseño completo
- `src/components/hoy/HoyView.jsx` — añadir CronicaSemanal + PersonajesColumna
- `src/hooks/useRegistros.js` — detección nivel global + personaje desbloqueado
- `src/constants.js` — añadir PERSONAJES array con sprites SVG
- `src/index.css` — nuevas animaciones (celebJump, unlockAppear)
- `index.html` — añadir Google Fonts (Cinzel + Share Tech Mono)
- `tailwind.config.js` — actualizar fontFamily

### Sin cambios en esta fase
- Tabs 2-4 (Semana, Rutas, Progreso, Chat) — mantienen diseño actual
- `db.js` — no se necesitan migraciones (personajes en configuracion)
- `services/claude.js` — sin cambios

---

## 10. Fuera de Scope (Fase 2)

- Sistema de sorpresas ocultas con triggers variados
- Avatar del jugador con evolución de ropa/aspecto
- Animaciones adicionales de racha, nivel global, etc.
- Rediseño de tabs 2-5
