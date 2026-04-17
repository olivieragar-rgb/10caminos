# Rediseño Visual — Evolución Premium: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar la estética de la app de pixel retro a dark premium slate: nueva paleta, tipografía refinada, navegación con NavCards en home + FloatingNavPill en otras vistas, iconos Phosphor, CaminoCard y vistas refrescadas.

**Architecture:** Cambios puramente visuales (CSS/JSX). Sin tocar lógica de negocio, hooks, ni DB. La navegación cambia de bottom-tabs estáticos a NavCards (en HOY) + FloatingNavPill (en otras vistas).

**Tech Stack:** React 18, Tailwind CSS 3, @phosphor-icons/react (nuevo), Google Fonts (JetBrains Mono)

---

### Task 1: Dependencias + Tailwind + CSS Base

**Files:**
- Modify: `package.json` (add @phosphor-icons/react)
- Modify: `tailwind.config.js`
- Modify: `index.html`
- Modify: `src/index.css`

- [ ] **Step 1: Instalar @phosphor-icons/react**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && npm install @phosphor-icons/react
```

Expected: package installed, package.json updated.

- [ ] **Step 2: Actualizar tailwind.config.js**

Reemplazar el archivo completo:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep':       '#0e0e1a',
        'bg-card':       '#181726',
        'bg-card-hover': '#211f34',
        'bg-surface':    '#23213a',
        'bg-elevated':   '#2d2b47',
        'text-primary':  '#ede9e1',
        'text-secondary':'#9590a8',
        'text-muted':    '#5c5875',
        'accent':        '#e94560',
        'xp-bar':        '#f0c040',
        'green-xp':      '#4ade80',
        'yellow-pause':  '#fbbf24',
        'gray-nada':     '#6b7280',
        'red-alert':     '#f43f5e',
        'border-dark':   '#302e4e',
        'border-bright': '#4a4770',
        'racha-fire':    '#f97316',
        'blue-mana':     '#60a5fa',
      },
      fontFamily: {
        pixel: ['"Cinzel"', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        body:  ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 4px 16px rgba(0,0,0,0.4)',
        'card-sm': '0 2px 8px rgba(0,0,0,0.35)',
        'xp':      '0 0 10px #f0c04035',
        'accent':  '0 0 10px #e9456040',
        'green':   '0 0 10px #4ade8035',
        'pill':    '0 8px 32px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        'card': '8px',
        'pill': '100px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Actualizar index.html — fuentes Google**

Reemplazar la línea `<link href="https://fonts.googleapis.com/...">` por:

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Actualizar src/index.css — base y utilidades**

Cambios específicos:
1. En el bloque `body`: cambiar `background-color` a `#0e0e1a`, eliminar `image-rendering: pixelated`
2. Actualizar `.rpg-card` y `.rpg-btn` a nuevos colores
3. Actualizar hardcoded hex que correspondan a los viejos tokens

En body:
```css
body {
  background-color: #0e0e1a;
  color: #ede9e1;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}
```

`.rpg-card` (en @layer utilities):
```css
.rpg-card {
  background: linear-gradient(180deg, #181726 0%, #0e0e1a 100%);
  border: 1px solid #302e4e;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
```

`.rpg-btn`:
```css
.rpg-btn {
  border: 1px solid #4a4770;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.35);
  background: linear-gradient(180deg, #2d2b47 0%, #23213a 100%);
}
```

`.glow-xp`, `.glow-accent`, `.glow-green`: cambiar colores a los nuevos tokens.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js index.html src/index.css package.json package-lock.json
git commit -m "feat: install phosphor-icons, update tailwind palette + typography foundation"
```

---

### Task 2: FloatingNavPill — nueva Navigation

**Files:**
- Modify: `src/components/layout/Navigation.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Reescribir Navigation.jsx**

```jsx
import { House, CalendarDots, MapTrifold, ChartLineUp, ChatDots } from '@phosphor-icons/react'

const TABS_CONFIG = [
  { id: 'hoy',      Icon: House,        label: 'Inicio'  },
  { id: 'semana',   Icon: CalendarDots, label: 'Semana'  },
  { id: 'rutas',    Icon: MapTrifold,   label: 'Rutas'   },
  { id: 'progreso', Icon: ChartLineUp,  label: 'Stats'   },
  { id: 'chat',     Icon: ChatDots,     label: 'Chat'    },
]

export default function Navigation({ tabActivo, onTabChange }) {
  // No se muestra en HOY — las NavCards hacen esa función
  if (tabActivo === 'hoy') return null

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2"
      style={{
        background: 'rgba(35,33,58,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid #4a4770',
        borderRadius: '100px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        width: 'auto',
        maxWidth: '320px',
      }}
    >
      {TABS_CONFIG.map(({ id, Icon, label }) => {
        const activo = id === tabActivo
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            aria-label={label}
            className="flex items-center justify-center transition-all duration-150 select-none"
            style={{
              width: 48,
              height: 40,
              borderRadius: '100px',
              background: activo ? 'rgba(233,69,96,0.15)' : 'transparent',
              color: activo ? '#e94560' : '#5c5875',
              filter: activo ? 'drop-shadow(0 0 6px #e9456060)' : 'none',
            }}
          >
            <Icon size={22} weight="duotone" />
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Actualizar App.jsx — padding bottom dinámico**

En `App.jsx`, en el `<main>`, cambiar `pb-14` por `pb-safe` condicional:

```jsx
<main
  className={`flex-1 flex flex-col ${tabActivo !== 'hoy' ? 'pb-20' : 'pb-4'} overflow-y-auto
    ${curtain === 'out' ? 'animate-curtain-out' : ''}
    ${curtain === 'in'  ? 'animate-curtain-in'  : ''}`}
>
```

- [ ] **Step 3: Verificar en dev server que pill aparece en semana/rutas/stats/chat y no en hoy**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && npm run dev
```

Expected: pill visible en tabs no-HOY, invisible en HOY. Navegación funcional.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navigation.jsx src/App.jsx
git commit -m "feat: replace bottom tabs with FloatingNavPill (icon-only, hidden on hoy tab)"
```

---

### Task 3: NavCards — navegación en pantalla principal

**Files:**
- Create: `src/components/hoy/NavCards.jsx`
- Modify: `src/components/hoy/HoyView.jsx`

- [ ] **Step 1: Crear NavCards.jsx**

```jsx
import { CalendarDots, MapTrifold, ChartLineUp, ChatDots } from '@phosphor-icons/react'

const CARDS = [
  { id: 'semana',   Icon: CalendarDots, label: 'Semana',  color: '#60a5fa' },
  { id: 'rutas',    Icon: MapTrifold,   label: 'Rutas',   color: '#4ade80' },
  { id: 'progreso', Icon: ChartLineUp,  label: 'Stats',   color: '#f0c040' },
  { id: 'chat',     Icon: ChatDots,     label: 'Chat',    color: '#e94560' },
]

export default function NavCards({ onNavigate }) {
  return (
    <div className="px-4 py-3 grid grid-cols-2 gap-2.5">
      {CARDS.map(({ id, Icon, label, color }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="flex flex-col items-center justify-center gap-2 py-4 select-none
                     active:scale-[0.97] transition-transform duration-100"
          style={{
            background: 'linear-gradient(160deg, #181726 0%, #23213a 100%)',
            border: '1px solid #302e4e',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={26} weight="duotone" color={color} />
          </div>
          <span className="font-body font-semibold text-xs tracking-wide"
                style={{ color: '#9590a8' }}>
            {label.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Integrar NavCards en HoyView.jsx**

HoyView recibe `onTabChange` como prop desde App.jsx. Agregar la prop y el componente.

En App.jsx, donde se renderiza la Vista:
```jsx
<Vista
  onAbrirCodex={tabActivo === 'progreso' ? () => setMostrarCodex(true) : undefined}
  onTabChange={tabActivo === 'hoy' ? handleTabChange : undefined}
/>
```

En HoyView.jsx, agregar prop `onTabChange` y el componente NavCards después del header:

```jsx
import NavCards from './NavCards'

export default function HoyView({ onTabChange }) {
  // ... (todo el código existente igual) ...

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-bg-deep">
        {/* ... header existente ... */}
      </div>

      {/* NavCards — navegación hacia otras secciones */}
      {onTabChange && <NavCards onNavigate={onTabChange} />}

      {/* Frase Ikigai del día */}
      {/* ... resto igual ... */}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/hoy/NavCards.jsx src/components/hoy/HoyView.jsx src/App.jsx
git commit -m "feat: add NavCards to home screen for section navigation"
```

---

### Task 4: HoyView header + botones UI refinados

**Files:**
- Modify: `src/components/hoy/HoyView.jsx`

- [ ] **Step 1: Actualizar botón CAMINOS con Sliders icon**

Reemplazar el botón ⚙ CAMINOS por:

```jsx
import { Sliders } from '@phosphor-icons/react'

// En el botón:
<button
  onClick={() => setShowManager(true)}
  className="flex items-center gap-1.5 px-3 py-2 active:scale-[0.97] transition-transform"
  style={{
    background: '#2d2b47',
    border: '1px solid #4a4770',
    borderRadius: '8px',
    color: '#9590a8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  }}
  title="Gestionar caminos"
>
  <Sliders size={14} weight="duotone" />
  <span className="font-body text-xs font-semibold tracking-wide">CAMINOS</span>
</button>
```

- [ ] **Step 2: Actualizar modal de planificación**

Cambiar estilos del modal a nuevos tokens:
- Fondo: `background: '#181726'`, borde: `1px solid #302e4e`, `border-radius: '12px'`
- Botones: `border-radius: '8px'`, colores del nuevo palette
- Eliminar `boxShadow: '4px 4px 0px rgba(0,0,0,0.8)'` → `boxShadow: '0 8px 32px rgba(0,0,0,0.6)'`

Modal container:
```jsx
<div className="w-full max-w-[480px] p-5 mb-20 animate-fade-in-up"
     style={{
       background: '#181726',
       border: '1px solid #302e4e',
       borderRadius: '16px',
       boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
     }}>
```

Inputs:
```jsx
style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
```

Botón cancelar:
```jsx
style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px', color: '#9590a8' }}
```

Botón guardar:
```jsx
style={{ background: 'linear-gradient(135deg, #e94560, #c03040)', border: 'none', borderRadius: '8px' }}
```

- [ ] **Step 3: Actualizar FAB planificar mañana**

```jsx
<button
  onClick={abrirModal}
  className="fixed bottom-24 right-4 flex items-center gap-2 z-40
             active:scale-[0.97] transition-transform duration-100"
  style={{
    background: 'linear-gradient(135deg, #e94560, #c03040)',
    border: 'none',
    borderRadius: '100px',
    boxShadow: '0 4px 20px rgba(233,69,96,0.4)',
    color: '#fff',
    padding: '12px 18px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.03em',
  }}
>
  📋 Mañana
</button>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/hoy/HoyView.jsx
git commit -m "feat: update HoyView header button and planning modal to premium style"
```

---

### Task 5: CaminoCard visual refresh

**Files:**
- Modify: `src/components/hoy/CaminoCard.jsx`

- [ ] **Step 1: Reemplazar PixelShield con NumberBadge**

Eliminar la función `PixelShield` completa (líneas 25-60) y reemplazar por:

```jsx
function NumberBadge({ numero }) {
  return (
    <div style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: '#2d2b47',
      border: '1px solid #4a4770',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10px',
        fontWeight: 700,
        color: '#9590a8',
        lineHeight: 1,
      }}>{numero}</span>
    </div>
  )
}
```

Actualizar la referencia de `<PixelShield numero={camino.id} />` → `<NumberBadge numero={camino.id} />`

- [ ] **Step 2: Actualizar estilos de la tarjeta principal**

En el div raíz del CaminoCard:
```jsx
style={{
  background: 'linear-gradient(160deg, #181726 0%, #1a1828 100%)',
  border: '1px solid #302e4e',
  borderLeftColor: borderAccentColor,
  borderLeftWidth: '3px',
  borderRadius: '10px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
}}
```

- [ ] **Step 3: Reemplazar todos los inline font-family "Press Start 2P"**

En el bloque MISIÓN (label "MISIÓN"):
```jsx
// Antes:
style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '6px', ... }}
// Después:
style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', ... }}
```

Cambios idénticos en "RETO" label (RetoIndicator), y en el número de paso `pasoIdx + 1}/{total}`.

- [ ] **Step 4: Actualizar botones de marca ✓/→/○**

```jsx
style={{
  background: activo ? m.bg : 'rgba(45,43,71,0.5)',
  border: `1px solid ${activo ? m.border : '#4a4770'}`,
  borderRadius: '8px',
  boxShadow: activo ? `0 0 8px ${m.border}40` : 'none',
  color: activo ? m.color : '#5c5875',
  opacity: procesando ? 0.5 : 1,
  cursor: procesando ? 'not-allowed' : 'pointer',
}}
```

Actualizar constante MARCAS para usar nuevos colores:
```jsx
const MARCAS = [
  { id: 'avance', label: '✓', full: 'LOGRADO', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: '#4ade80' },
  { id: 'pausa',  label: '→', full: 'PEND.',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: '#fbbf24' },
  { id: 'nada',   label: '○', full: 'NO HOY',  color: '#6b7280', bg: 'rgba(107,114,128,0.10)', border: '#6b7280' },
]
```

- [ ] **Step 5: Actualizar MenuContextual**

```jsx
style={{
  background: '#181726',
  border: '1px solid #4a4770',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  padding: '10px',
}}
```

Botones dentro del menú:
```jsx
style={{ border: '1px solid #4a4770', borderRadius: '8px', color: '#9590a8', background: '#2d2b47' }}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/hoy/CaminoCard.jsx
git commit -m "feat: replace PixelShield with NumberBadge, update CaminoCard to premium style"
```

---

### Task 6: SemanaView visual refresh

**Files:**
- Modify: `src/components/semana/SemanaView.jsx`

- [ ] **Step 1: Eliminar SVG sprites (Estrella, Reloj, Calavera)**

Eliminar las tres funciones SVG completas (aprox. líneas 9-80 del archivo).

Reemplazar por una función helper simple:

```jsx
function MarcaCell({ marca }) {
  if (!marca) return <span style={{ color: '#302e4e', fontSize: '14px' }}>·</span>
  const config = {
    avance: { sym: '✓', color: '#4ade80' },
    pausa:  { sym: '→', color: '#fbbf24' },
    nada:   { sym: '○', color: '#6b7280' },
  }
  const c = config[marca]
  if (!c) return null
  return <span style={{ color: c.color, fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>{c.sym}</span>
}
```

Reemplazar todos los usos de `<Estrella />`, `<Reloj />`, `<Calavera />` por `<MarcaCell marca={marcaDia} />`.

- [ ] **Step 2: Actualizar estilos del header y grilla**

Header "SEMANA":
```jsx
<h2 className="font-pixel text-base text-text-primary">SEMANA</h2>
```

Celdas de la grilla: `border-radius: 4px`, colores del nuevo palette (`bg-bg-card`, `border-border-dark`).

Columna de día activo: `border-color: border-bright`, fondo `bg-bg-elevated`.

- [ ] **Step 3: Commit**

```bash
git add src/components/semana/SemanaView.jsx
git commit -m "feat: replace pixel SVG sprites in SemanaView, update to premium style"
```

---

### Task 7: RutasView visual refresh

**Files:**
- Modify: `src/components/rutas/RutasView.jsx`
- Modify: `src/components/rutas/RutaCard.jsx`
- Modify: `src/components/rutas/RutaForm.jsx`

- [ ] **Step 1: Actualizar RutasView.jsx**

- Título "RUTAS": `font-pixel text-base text-text-primary`
- Filtros (Activas/Pausa/Completadas): `border-radius: 100px`, botones pill style
  ```jsx
  style={{
    background: activo ? '#e94560' : '#2d2b47',
    border: `1px solid ${activo ? '#e94560' : '#4a4770'}`,
    borderRadius: '100px',
    color: activo ? '#fff' : '#9590a8',
    padding: '6px 14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
  }}
  ```
- FAB "Nueva Ruta": mismo estilo que FAB de HoyView (accent, rounded-full, glow)

- [ ] **Step 2: Actualizar RutaCard.jsx**

- `border-radius: 10px`, `border: '1px solid #302e4e'`
- `box-shadow: '0 4px 16px rgba(0,0,0,0.4)'`
- Eliminar pixel box shadows (4px 4px offset)
- Etiquetas de estado: `font-body font-semibold text-[10px] tracking-wider uppercase`

- [ ] **Step 3: Actualizar RutaForm.jsx**

- Inputs y textareas: `background: '#2d2b47'`, `border: '1px solid #4a4770'`, `border-radius: '8px'`
- Botones: `border-radius: '8px'`, nuevos colores

- [ ] **Step 4: Commit**

```bash
git add src/components/rutas/RutasView.jsx src/components/rutas/RutaCard.jsx src/components/rutas/RutaForm.jsx
git commit -m "feat: update RutasView, RutaCard and RutaForm to premium style"
```

---

### Task 8: ProgresoView visual refresh

**Files:**
- Modify: `src/components/progreso/ProgresoView.jsx`
- Modify: `src/components/progreso/RecompensasList.jsx`
- Modify: `src/components/progreso/Heatmap.jsx`

- [ ] **Step 1: Actualizar ProgresoView.jsx**

- Título: `<h2 className="font-pixel text-base text-text-primary px-4 pt-5 pb-2">PROGRESO</h2>`
- Botón Codex: usar `BookOpen` icon de Phosphor
  ```jsx
  import { BookOpen } from '@phosphor-icons/react'
  // ...
  <button onClick={onAbrirCodex} className="flex items-center gap-2 px-4 py-3 w-full"
    style={{ background: '#181726', border: '1px solid #302e4e', borderRadius: '10px' }}>
    <BookOpen size={20} weight="duotone" color="#e94560" />
    <span className="font-body font-semibold text-sm text-text-secondary">CODEX DE LA PSIQUE</span>
  </button>
  ```
- Cards de stats: `border-radius: 10px`, `border: '1px solid #302e4e'`, `background: '#181726'`
- Eliminar pixel box shadows

- [ ] **Step 2: Actualizar RecompensasList.jsx y Heatmap.jsx**

RecompensasList: `border-radius: 8px` en tarjetas de recompensa, colores nuevos.
Heatmap: actualizar colores de celdas al nuevo palette (bg-deep, green-xp, etc.).

- [ ] **Step 3: Commit**

```bash
git add src/components/progreso/ProgresoView.jsx src/components/progreso/RecompensasList.jsx src/components/progreso/Heatmap.jsx
git commit -m "feat: update ProgresoView with BookOpen Codex button and premium style"
```

---

### Task 9: ChatView visual refresh

**Files:**
- Modify: `src/components/chat/ChatView.jsx`
- Modify: `src/components/chat/ChatBubble.jsx`
- Modify: `src/components/chat/ApiKeySetup.jsx`

- [ ] **Step 1: Actualizar ChatView.jsx**

- Header: `font-pixel text-base` para "CHAT IA"
- Input area: `background: '#2d2b47'`, `border: '1px solid #4a4770'`, `border-radius: '12px'`
- Botón enviar: accent color, `border-radius: '8px'`
- Eliminar pixel box shadows

- [ ] **Step 2: Actualizar ChatBubble.jsx**

- User bubble: `background: 'linear-gradient(135deg, #e94560, #c03040)'`, `border-radius: '12px 12px 4px 12px'`
- Assistant bubble: `background: '#181726'`, `border: '1px solid #302e4e'`, `border-radius: '12px 12px 12px 4px'`

- [ ] **Step 3: Actualizar ApiKeySetup.jsx**

- `border-radius: '12px'`, `background: '#181726'`, `border: '1px solid #302e4e'`
- Input: `background: '#2d2b47'`, `border: '1px solid #4a4770'`, `border-radius: '8px'`

- [ ] **Step 4: Commit**

```bash
git add src/components/chat/ChatView.jsx src/components/chat/ChatBubble.jsx src/components/chat/ApiKeySetup.jsx
git commit -m "feat: update ChatView and bubbles to premium style"
```

---

### Task 10: Shared components + PersonajeHeader + ScoreDiario + miscelánea

**Files:**
- Modify: `src/components/shared/LevelBadge.jsx`
- Modify: `src/components/shared/GlowCard.jsx`
- Modify: `src/components/hoy/PersonajeHeader.jsx`
- Modify: `src/components/hoy/ScoreDiario.jsx`
- Modify: `src/components/hoy/PlanBanner.jsx`
- Modify: `src/components/hoy/XpBar.jsx`

- [ ] **Step 1: Leer y actualizar LevelBadge.jsx**

Actualizar `border-radius`, colores al nuevo palette. Mantener glow de XP.

- [ ] **Step 2: Leer y actualizar GlowCard.jsx**

`border-radius: '10px'`, `border: '1px solid #302e4e'`, `background: '#181726'`.

- [ ] **Step 3: Actualizar PersonajeHeader.jsx**

Leer el archivo y actualizar colores/fuentes al nuevo palette. Título de nivel: mantener `font-pixel`.

- [ ] **Step 4: Actualizar ScoreDiario.jsx**

Barra de progreso: colores nuevos. Texto: `font-body`. Título "PUNTUACIÓN": `font-pixel text-xs`.

- [ ] **Step 5: Actualizar PlanBanner.jsx y XpBar.jsx**

PlanBanner: `border-radius: '8px'`, colores nuevos.
XpBar: actualizar `#ffd700` → `#f0c040`, `background: #302e4e`.

- [ ] **Step 6: Actualizar RecompensaUnlockModal**

`src/components/shared/RecompensaUnlockModal.jsx`: `border-radius: '16px'`, colores nuevos, eliminar pixel shadows.

- [ ] **Step 7: Commit**

```bash
git add src/components/shared/ src/components/hoy/PersonajeHeader.jsx src/components/hoy/ScoreDiario.jsx src/components/hoy/PlanBanner.jsx src/components/hoy/XpBar.jsx
git commit -m "feat: update shared components and hoy utilities to premium style"
```

---

## Self-Review

- ✅ Todos los tasks cubren requisitos de la spec
- ✅ Task 1 (foundation) debe completarse antes del resto
- ✅ Sin referencias a tipos/funciones no definidas
- ✅ Phosphor icons usados consistentemente
- ✅ FloatingNavPill oculto en 'hoy', NavCards solo en 'hoy'
- ✅ Logic de negocio intacta — solo cambios visuales
