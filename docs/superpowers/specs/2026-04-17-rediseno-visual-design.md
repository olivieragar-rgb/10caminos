# Spec: Rediseño Visual — Enfoque B: Evolución Premium

**Fecha:** 2026-04-17
**Estado:** Aprobado

---

## Objetivo

Transformar la estética de la app de pixel-art retro a dark premium. Mismos conceptos RPG, misma identidad, pero con más riqueza visual, tipografía refinada y navegación premium.

---

## 1. Paleta de Color

Reemplazar todos los tokens en `tailwind.config.js`:

| Token Tailwind | Valor nuevo | Descripción |
|---|---|---|
| `bg-deep` | `#0e0e1a` | Fondo principal — slate oscuro |
| `bg-card` | `#181726` | Tarjetas |
| `bg-card-hover` | `#211f34` | Hover de tarjetas |
| `bg-surface` | `#23213a` | Superficies elevadas |
| `bg-elevated` | `#2d2b47` | **Nuevo** — inputs, botones, hover |
| `text-primary` | `#ede9e1` | Crema cálido |
| `text-secondary` | `#9590a8` | Gris-morado |
| `text-muted` | `#5c5875` | Texto desactivado |
| `accent` | `#e94560` | Rojo — sin cambio |
| `xp-bar` | `#f0c040` | Dorado cálido |
| `green-xp` | `#4ade80` | Verde avance |
| `yellow-pause` | `#fbbf24` | Ámbar pausa |
| `gray-nada` | `#6b7280` | Gris nada |
| `red-alert` | `#f43f5e` | Rojo alerta |
| `border-dark` | `#302e4e` | Borde base |
| `border-bright` | `#4a4770` | Borde destacado/activo |
| `racha-fire` | `#f97316` | Naranja racha |
| `blue-mana` | `#60a5fa` | Azul rutas |

Eliminar tokens que ya no aplican: `border-dark` (renombrado), `gray-nada` (renombrado de `gray-nada`).

---

## 2. Tipografía

| Clase Tailwind | Fuente | Cuándo usar |
|---|---|---|
| `font-pixel` (Cinzel) | Títulos RPG | Nombres de nivel, encabezados de vista, entidades Codex, IntroScene |
| `font-body` (Inter) | Todo lo demás | Labels botones, texto caminos, stats, notas, modales |
| `font-mono` (JetBrains Mono) | Números mono | XP, nivel numérico, contadores |

Cambios en `tailwind.config.js`:
- `font-mono`: de `Share Tech Mono` → `JetBrains Mono`

Cambio en `index.html`:
- Google Fonts: reemplazar `Share+Tech+Mono` por `JetBrains+Mono:wght@400;700`

Cambio en `index.css`:
- Eliminar `image-rendering: pixelated` del body (mantener solo en SVG sprites de intro donde se usa directamente)

---

## 3. Navegación

### Tab HOY (pantalla principal = dashboard)
- **Sin barra de navegación inferior** cuando el tab activo es `hoy`
- HoyView renderiza `NavCards` justo debajo del header (encima de FraseIkigai)
- `NavCards`: grilla 2×2, cuatro destinos: SEMANA, RUTAS, STATS, CHAT
- Cada NavCard: icono Phosphor duotone (32px) + label Inter 600 + un stat breve en text-muted

### Tabs no-HOY
- `FloatingNavPill`: pill translúcido, `position: fixed`, centrado al fondo
- 5 iconos: Home (→ hoy), Semana, Rutas, Stats, Chat
- Solo iconos (sin labels), activo = accent color + glow suave
- Fondo: `bg-surface/85` + `backdrop-filter: blur(12px)`
- Dimensiones: ~300px ancho × 52px alto, `border-radius: 100px`
- Borde: `1px solid border-bright`

### En App.jsx
- `pb-14` (padding bottom para la pill) solo cuando `tabActivo !== 'hoy'`
- Pasar `tabActivo` y `onTabChange` a FloatingNavPill

---

## 4. Iconos — Phosphor React

**Paquete:** `@phosphor-icons/react`

| Destino | Componente | Peso |
|---|---|---|
| HOY/Home | `House` | duotone |
| SEMANA | `CalendarDots` | duotone |
| RUTAS | `MapTrifold` | duotone |
| STATS | `ChartLineUp` | duotone |
| CHAT | `ChatDots` | duotone |
| Gestionar caminos | `Sliders` | duotone |
| Codex (en ProgresoView) | `BookOpen` | duotone |

---

## 5. CaminoCard

- Eliminar `PixelShield` SVG → reemplazar con `NumberBadge`: `div` circular 24×24, `bg-bg-elevated`, borde `border-bright`, número en `font-body font-bold text-xs text-text-secondary`
- Eliminar todos los `fontFamily: '"Press Start 2P", cursive'` inline → usar `font-body text-[10px] font-semibold`
- Etiquetas "MISIÓN" y "RETO": `font-body text-[9px] font-semibold tracking-wider uppercase`
- `border-radius` de la tarjeta: `8px`
- `box-shadow`: `0 4px 16px rgba(0,0,0,0.4)` (sin offset pixel)
- Botones ✓/→/○: `border-radius: 6px`

---

## 6. SemanaView

- Reemplazar SVGs pixel (`Estrella`, `Reloj`, `Calavera`) por texto styled:
  - Avance: `✓` con `color: green-xp`
  - Pausa: `→` con `color: yellow-pause`
  - Nada: `○` con `color: gray-nada`
- Header "SEMANA": `font-pixel` para el título, `font-body` para el resto
- Celdas: `border-radius: 4px`, colores del nuevo palette

---

## 7. Otras vistas (RutasView, ProgresoView, ChatView)

- Todos los títulos de sección: `font-pixel text-sm` (Cinzel)
- Todo lo demás: `font-body`
- `border-radius` en tarjetas: 8px
- Colores actualizados al nuevo palette

---

## 8. Codex (mantener identidad especial)

- Mantener más pixel aesthetic (sección misteriosa)
- Solo actualizar colores al nuevo palette
- No cambiar animaciones ni estructura

---

## 9. index.css — Utilidades CSS globales

Actualizar colores hardcodeados en:
- `.rpg-card`: usar nuevos bg/border
- `.rpg-btn`: usar nuevos bg/border
- Body background: `#0e0e1a`

Eliminar `image-rendering: pixelated` del body.

Mantener todas las animaciones existentes (no cambiar).

---

## Spec Self-Review

- ✅ Sin TBDs
- ✅ Consistente con stack Tailwind + React
- ✅ No rompe funcionalidad existente (solo visual)
- ✅ Phosphor icons bien definidos
- ✅ FloatingNavPill reemplaza Navigation.jsx (mismo prop interface)
- ✅ Alcance acotado — no toca lógica de negocio
