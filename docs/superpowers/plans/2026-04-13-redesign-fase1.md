# Rediseño Visual Fase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar la vista HOY con tipografía Cinzel, tarjetas cyberpunk con estados de color, bloque MISIÓN prominente con cola de pasos editable, tablón semanal y sistema de 20 personajes pixel art desbloqueables.

**Architecture:** Nuevos componentes atómicos (MisionBlock, CelebrationFlash, CronicaSemanal, PersonajesColumna, PersonajeUnlockModal) montados en HoyView. La lógica de desbloqueo de personajes se añade a `marcarCamino` en `useRegistros.js`. Los sprites SVG y la config de personajes viven en `constants.js`.

**Tech Stack:** React 18, Dexie.js, Tailwind CSS 3, Google Fonts (Cinzel + Share Tech Mono), SVG pixel art inline

---

## Mapa de archivos

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Modificar | `index.html` | Añadir Cinzel + Share Tech Mono |
| Modificar | `tailwind.config.js` | fontFamily pixel→Cinzel, mono→Share Tech Mono |
| Modificar | `src/constants.js` | Añadir PERSONAJES con sprites SVG |
| Modificar | `src/index.css` | Keyframes celebJump, unlockAppear, neonPulse |
| Crear | `src/components/hoy/MisionBlock.jsx` | Bloque misión con 4 estados + edición cola |
| Crear | `src/components/hoy/CelebrationFlash.jsx` | Overlay celebración ¡LOGRADO! |
| Crear | `src/components/shared/PersonajeUnlockModal.jsx` | Modal de nuevo personaje |
| Crear | `src/components/hoy/CronicaSemanal.jsx` | Tablón semanal con datos de la semana |
| Crear | `src/components/hoy/PersonajesColumna.jsx` | Columna de slots de personajes |
| Modificar | `src/hooks/useRegistros.js` | Avance de ruta + detección personaje |
| Modificar | `src/components/hoy/CaminoCard.jsx` | Diseño cyberpunk completo |
| Modificar | `src/components/hoy/HoyView.jsx` | Montar CronicaSemanal + PersonajesColumna |

---

## Task 1: Fuentes y Tailwind

**Files:**
- Modify: `index.html:8`
- Modify: `tailwind.config.js:24-28`

- [ ] **Step 1: Actualizar index.html con las nuevas fuentes**

```html
<!-- index.html línea 8 — reemplazar la línea existente de Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Actualizar tailwind.config.js**

```js
// tailwind.config.js — bloque fontFamily completo
fontFamily: {
  pixel: ['"Cinzel"', 'serif'],
  mono:  ['"Share Tech Mono"', 'monospace'],
  body:  ['Inter', 'system-ui', 'sans-serif'],
},
```

- [ ] **Step 3: Verificar build limpio**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```
Esperado: `✓ built in`

- [ ] **Step 4: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add index.html tailwind.config.js
git commit -m "feat: swap Press Start 2P for Cinzel + Share Tech Mono"
```

---

## Task 2: Personajes en constants.js

**Files:**
- Modify: `src/constants.js` (añadir al final)

- [ ] **Step 1: Añadir el array PERSONAJES con sprites SVG al final de constants.js**

```js
// ── PERSONAJES DESBLOQUEABLES ─────────────────────────────────────────────
// Cada personaje tiene: id, nombre, nivelDesbloqueo, glowColor, Sprite (componente React)
// Los sprites son pixel art 16×16 escalado, image-rendering: pixelated

const PixelSprite = ({ rects, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16"
       style={{ imageRendering: 'pixelated', display: 'block' }}>
    {rects.map(([x, y, w, h, fill], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
    ))}
  </svg>
)

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
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/constants.js
git commit -m "feat: add PERSONAJES array with 20 pixel art sprites"
```

---

## Task 3: Animaciones CSS

**Files:**
- Modify: `src/index.css` (añadir al final)

- [ ] **Step 1: Añadir keyframes y utilities al final de index.css**

```css
/* ── NUEVAS ANIMACIONES FASE 1 ────────────────────────────────────────────── */

@keyframes celebJump {
  0%   { transform: translateY(0) scale(1); }
  25%  { transform: translateY(-10px) scale(1.1); }
  50%  { transform: translateY(0) scale(1); }
  75%  { transform: translateY(-6px) scale(1.05); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes unlockAppear {
  0%   { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60%  { opacity: 1; transform: scale(1.1) rotate(3deg); }
  80%  { transform: scale(0.95) rotate(-1deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes neonPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

@keyframes starFloat {
  0%   { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
}

@keyframes xpRise {
  0%   { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-28px); opacity: 0; }
}

.animate-celeb-jump   { animation: celebJump 0.7s ease-in-out; }
.animate-unlock-appear { animation: unlockAppear 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
.animate-neon-pulse   { animation: neonPulse 2s ease-in-out infinite; }
.animate-star-float   { animation: starFloat 1s ease-out forwards; }
.animate-xp-rise      { animation: xpRise 1s ease-out forwards; }
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/index.css
git commit -m "feat: add celebration and unlock CSS animations"
```

---

## Task 4: CelebrationFlash

**Files:**
- Create: `src/components/hoy/CelebrationFlash.jsx`

- [ ] **Step 1: Crear CelebrationFlash.jsx**

```jsx
// src/components/hoy/CelebrationFlash.jsx
import { useEffect, useState } from 'react'
import { PersonajeSprite, getPersonajeActivo } from '../../constants'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { nivelGlobal } from '../../utils/xp'

const STARS = ['✦', '★', '✦', '⭐', '✦']

export default function CelebrationFlash({ xpGanado, subioNivel, nuevoNivel, onDone }) {
  const [fase, setFase] = useState('show') // 'show' | 'done'
  const todosCaminos = useLiveQuery(() => db.caminos.toArray(), [], [])
  const nvGlobal = nivelGlobal(todosCaminos || [])
  const personaje = getPersonajeActivo(nvGlobal)
  const duracion = subioNivel ? 3000 : 1500

  useEffect(() => {
    const t = setTimeout(() => { setFase('done'); onDone?.() }, duracion)
    return () => clearTimeout(t)
  }, [duracion, onDone])

  if (fase === 'done') return null

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: 'rgba(4,4,12,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '3px', overflow: 'hidden',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* Estrellas flotantes */}
      {STARS.map((s, i) => (
        <span key={i} className="animate-star-float"
          style={{
            position: 'absolute',
            left: `${15 + i * 18}%`,
            top: '60%',
            fontSize: '14px',
            color: '#ffd700',
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.9 + i * 0.1}s`,
          }}>{s}</span>
      ))}

      {/* Sprite celebrando */}
      <div className="animate-celeb-jump" style={{ marginBottom: '8px' }}>
        <PersonajeSprite personaje={personaje} size={48} />
      </div>

      {/* +XP */}
      <div className="animate-xp-rise"
        style={{
          fontFamily: '"Cinzel", serif', fontWeight: 900,
          fontSize: '18px', color: '#ffd700',
          textShadow: '0 0 12px #ffd700',
        }}>
        +{xpGanado} XP
      </div>

      {/* Subida de nivel */}
      {subioNivel && (
        <div className="animate-unlock-appear"
          style={{
            fontFamily: '"Cinzel", serif', fontWeight: 700,
            fontSize: '11px', color: '#00d4ff',
            letterSpacing: '3px', marginTop: '6px',
            textShadow: '0 0 10px #00d4ff',
          }}>
          ⬆ NIVEL {nuevoNivel}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/hoy/CelebrationFlash.jsx
git commit -m "feat: add CelebrationFlash overlay for LOGRADO"
```

---

## Task 5: MisionBlock

**Files:**
- Create: `src/components/hoy/MisionBlock.jsx`

- [ ] **Step 1: Crear MisionBlock.jsx**

```jsx
// src/components/hoy/MisionBlock.jsx
import { useState } from 'react'
import { db } from '../../db'

// Estilos base reutilizables
const BASE = {
  block: {
    padding: '10px 12px', marginBottom: '10px',
    borderRadius: '2px', borderLeft: '2px solid',
    position: 'relative',
  },
  label: {
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '7px', letterSpacing: '2px',
    marginBottom: '6px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  accion: {
    fontFamily: '"Cinzel", serif', fontWeight: 700,
    fontSize: '13px', lineHeight: 1.35, marginBottom: '5px',
  },
  meta: {
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '8px', color: '#252840',
  },
  editBtn: {
    fontFamily: '"Share Tech Mono", monospace', fontSize: '7px',
    padding: '2px 8px', color: '#00d4ff',
    border: '1px solid rgba(0,212,255,0.2)',
    background: 'rgba(0,212,255,0.05)', borderRadius: '2px', cursor: 'pointer',
  },
  ctaBtn: {
    fontFamily: '"Cinzel", serif', fontSize: '8px', letterSpacing: '2px',
    padding: '8px', width: '100%', textAlign: 'center',
    cursor: 'pointer', borderRadius: '2px', marginBottom: '5px',
    display: 'block',
  },
}

// ── Panel de edición de cola de pasos ──────────────────────────────────────
function ColaEditor({ ruta, onClose }) {
  const pasos = ruta.pasos || []
  const [localPasos, setLocalPasos] = useState(pasos.map(p => ({ ...p })))
  const [nuevoPaso, setNuevoPaso] = useState('')
  const [guardando, setGuardando] = useState(false)

  const moverArriba = (i) => {
    if (i <= ruta.pasoActual + 1) return // no mover por encima del actual
    const arr = [...localPasos]
    ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
    setLocalPasos(arr)
  }
  const moverAbajo = (i) => {
    if (i >= localPasos.length - 1) return
    const arr = [...localPasos]
    ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
    setLocalPasos(arr)
  }
  const eliminar = (i) => {
    if (i === ruta.pasoActual) return // no eliminar el actual
    setLocalPasos(localPasos.filter((_, idx) => idx !== i))
  }
  const editarTexto = (i, texto) => {
    const arr = [...localPasos]
    arr[i] = { ...arr[i], texto }
    setLocalPasos(arr)
  }
  const agregarPaso = () => {
    if (!nuevoPaso.trim()) return
    setLocalPasos([...localPasos, { texto: nuevoPaso.trim(), completado: false }])
    setNuevoPaso('')
  }
  const guardar = async () => {
    setGuardando(true)
    await db.rutas.update(ruta.id, { pasos: localPasos })
    setGuardando(false)
    onClose()
  }

  const inputStyle = {
    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '2px', color: '#e8e6e3', padding: '4px 8px',
    fontFamily: 'Inter, sans-serif', fontSize: '11px', outline: 'none', width: '100%',
  }

  return (
    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Paso actual editable */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '7px', color: '#4a5068', marginBottom: '3px', letterSpacing: '1px' }}>
          PASO ACTUAL ({ruta.pasoActual + 1}/{localPasos.length})
        </div>
        <input
          value={localPasos[ruta.pasoActual]?.texto || ''}
          onChange={e => editarTexto(ruta.pasoActual, e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Pasos futuros */}
      {localPasos.slice(ruta.pasoActual + 1).map((paso, relIdx) => {
        const absIdx = ruta.pasoActual + 1 + relIdx
        return (
          <div key={absIdx} style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
            <span style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '8px', color: '#1e2440', flexShrink: 0, width: '16px' }}>
              {absIdx + 1}.
            </span>
            <input
              value={paso.texto}
              onChange={e => editarTexto(absIdx, e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={() => moverArriba(absIdx)} style={{ background: 'none', border: 'none', color: '#3a4060', cursor: 'pointer', fontSize: '10px', padding: '0 2px' }}>↑</button>
            <button onClick={() => moverAbajo(absIdx)} style={{ background: 'none', border: 'none', color: '#3a4060', cursor: 'pointer', fontSize: '10px', padding: '0 2px' }}>↓</button>
            <button onClick={() => eliminar(absIdx)} style={{ background: 'none', border: 'none', color: '#602030', cursor: 'pointer', fontSize: '10px', padding: '0 2px' }}>✕</button>
          </div>
        )
      })}

      {/* Añadir paso */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', marginBottom: '8px' }}>
        <input
          value={nuevoPaso}
          onChange={e => setNuevoPaso(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && agregarPaso()}
          placeholder="+ Añadir siguiente paso..."
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={agregarPaso}
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '2px', color: '#00d4ff', padding: '4px 8px', cursor: 'pointer', fontSize: '10px' }}>
          +
        </button>
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={onClose}
          style={{ flex: 1, padding: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', color: '#4a5068', fontFamily: '"Cinzel",serif', fontSize: '7px', letterSpacing: '1px', cursor: 'pointer' }}>
          CANCELAR
        </button>
        <button onClick={guardar} disabled={guardando}
          style={{ flex: 1, padding: '6px', background: 'rgba(0,168,74,0.1)', border: '1px solid rgba(0,168,74,0.3)', borderRadius: '2px', color: '#00a84a', fontFamily: '"Cinzel",serif', fontSize: '7px', letterSpacing: '1px', cursor: 'pointer' }}>
          {guardando ? '...' : 'GUARDAR'}
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export default function MisionBlock({ rutaActiva, marcaHoy, onNavChat, onNavRutas }) {
  const [editando, setEditando] = useState(false)

  // Estado: sin ruta
  if (!rutaActiva) {
    return (
      <div style={{ ...BASE.block, background: 'rgba(200,0,60,0.07)', borderLeftColor: 'rgba(200,0,60,0.5)' }}>
        <div style={BASE.label}><span style={{ color: '#cc0044' }}>⚠ SIN RUTA ACTIVA</span></div>
        <div style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '9px', color: '#4a1020', lineHeight: 1.6, marginBottom: '10px' }}>
          Sin dirección no hay avance.<br />El asistente puede proponerte una ruta.
        </div>
        <button onClick={onNavChat} style={{ ...BASE.ctaBtn, background: 'rgba(0,212,255,0.07)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
          🤖 PEDIR RUTA AL ASISTENTE
        </button>
        <button onClick={onNavRutas} style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '8px', color: '#2a2a40', textAlign: 'center', cursor: 'pointer', width: '100%', display: 'block', padding: '4px', letterSpacing: '2px', background: 'none', border: 'none' }}>
          + CREAR MANUALMENTE
        </button>
      </div>
    )
  }

  const pasoIdx = rutaActiva.pasoActual ?? 0
  const pasos   = rutaActiva.pasos || []
  const paso    = pasos[pasoIdx]
  const total   = pasos.length

  // Estado: ruta sin siguiente paso
  if (!paso || pasoIdx >= total) {
    return (
      <div style={{ ...BASE.block, background: 'rgba(220,130,0,0.08)', borderLeftColor: 'rgba(220,130,0,0.5)' }}>
        <div style={BASE.label}><span style={{ color: '#dc8200' }}>⚠ SIN ACCIÓN DEFINIDA</span></div>
        <div style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '9px', color: '#5a3a00', lineHeight: 1.5, marginBottom: '8px' }}>
          La ruta «{rutaActiva.nombre}» no tiene siguiente paso.
        </div>
        <button onClick={() => setEditando(true)}
          style={{ ...BASE.ctaBtn, background: 'rgba(220,130,0,0.1)', color: '#dc8200', border: '1px solid rgba(220,130,0,0.3)' }}>
          + AÑADIR ACCIÓN A LA COLA
        </button>
        {editando && <ColaEditor ruta={rutaActiva} onClose={() => setEditando(false)} />}
      </div>
    )
  }

  // Colores según marca de hoy
  const estadoColor = marcaHoy === 'avance' ? '#00a84a'
    : marcaHoy === 'pausa'  ? '#c89600'
    : marcaHoy === 'nada'   ? '#484860'
    : '#c89600' // sin marcar → mostaza

  const estadoBg = marcaHoy === 'avance' ? 'rgba(0,168,74,0.08)'
    : marcaHoy === 'pausa'  ? 'rgba(200,150,0,0.09)'
    : marcaHoy === 'nada'   ? 'rgba(60,60,90,0.08)'
    : 'rgba(200,150,0,0.09)'

  const estadoLabel = marcaHoy === 'avance' ? '✓ LOGRADO HOY'
    : marcaHoy === 'pausa'  ? '⏳ PENDIENTE HOY'
    : marcaHoy === 'nada'   ? '✗ HOY NO'
    : '⚡ MISIÓN PENDIENTE'

  const proximos = pasos.slice(pasoIdx + 1, pasoIdx + 3)

  return (
    <div style={{ ...BASE.block, background: estadoBg, borderLeftColor: estadoColor }}>
      <div style={BASE.label}>
        <span style={{ color: estadoColor }}>{estadoLabel}</span>
        {!editando && (
          <button onClick={() => setEditando(true)} style={BASE.editBtn}>✏ EDITAR</button>
        )}
      </div>

      {/* Texto de la misión */}
      <div style={{
        ...BASE.accion,
        color: marcaHoy === 'avance' ? '#1a4030'
          : marcaHoy === 'nada'  ? '#303045'
          : '#ffe080',
        textDecoration: (marcaHoy === 'avance' || marcaHoy === 'nada') ? 'line-through' : 'none',
        opacity: (marcaHoy === 'avance' || marcaHoy === 'nada') ? 0.5 : 1,
      }}>
        {paso.texto}
      </div>

      {/* Meta */}
      <div style={{ ...BASE.meta, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{rutaActiva.nombre} · paso {pasoIdx + 1}/{total}</span>
        {/* Barra de progreso de ruta */}
      </div>

      {/* Barra de progreso */}
      <div style={{ height: '3px', background: 'rgba(0,0,0,0.4)', borderRadius: '1px', margin: '6px 0', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '1px',
          width: `${Math.round((pasoIdx / total) * 100)}%`,
          background: `linear-gradient(90deg, ${estadoColor}, ${estadoColor}88)`,
          boxShadow: `0 0 6px ${estadoColor}60`,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Cola de próximos pasos */}
      {proximos.length > 0 && !editando && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {proximos.map((p, i) => (
            <div key={i} style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '8px', color: '#1e2440' }}>
              {'// '}{p.texto}
            </div>
          ))}
        </div>
      )}

      {/* Editor de cola */}
      {editando && <ColaEditor ruta={rutaActiva} onClose={() => setEditando(false)} />}
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/hoy/MisionBlock.jsx
git commit -m "feat: add MisionBlock with 4 states and inline queue editor"
```

---

## Task 6: PersonajeUnlockModal

**Files:**
- Create: `src/components/shared/PersonajeUnlockModal.jsx`

- [ ] **Step 1: Crear PersonajeUnlockModal.jsx**

```jsx
// src/components/shared/PersonajeUnlockModal.jsx
import { useState } from 'react'
import { PersonajeSprite } from '../../constants'

export default function PersonajeUnlockModal({ personaje, onClose }) {
  const [fase, setFase] = useState('reveal') // 'reveal' | 'done'

  if (!personaje || fase === 'done') return null

  const handleRecibir = () => {
    setFase('done')
    onClose?.()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(4,4,12,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      {/* Partículas */}
      {['✦','★','✦','⭐','✦','★'].map((s, i) => (
        <span key={i} className="animate-star-float" style={{
          position: 'absolute',
          left: `${10 + i * 15}%`, top: '45%',
          fontSize: '16px', color: personaje.glowColor,
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1.2s',
        }}>{s}</span>
      ))}

      {/* Card de desbloqueo */}
      <div className="animate-unlock-appear" style={{
        background: 'linear-gradient(160deg, #0d0d1c, #080812)',
        border: `1px solid ${personaje.glowColor}`,
        borderRadius: '3px',
        boxShadow: `0 0 30px ${personaje.glowColor}40, 0 0 60px ${personaje.glowColor}15`,
        padding: '28px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
        maxWidth: '260px',
      }}>
        <div style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '8px', letterSpacing: '3px', color: personaje.glowColor }}>
          NUEVO COMPAÑERO
        </div>

        <div style={{
          filter: `drop-shadow(0 0 12px ${personaje.glowColor})`,
          animation: 'celebJump 0.7s ease-in-out 0.3s both',
        }}>
          <PersonajeSprite personaje={personaje} size={72} />
        </div>

        <div style={{ fontFamily: '"Cinzel",serif', fontWeight: 900, fontSize: '18px', color: '#e8e6e3', textAlign: 'center', letterSpacing: '2px' }}>
          {personaje.nombre}
        </div>

        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6a6a8a', textAlign: 'center', lineHeight: 1.5 }}>
          ¡{personaje.nombre} se une a tu camino!
        </div>

        <button onClick={handleRecibir} style={{
          fontFamily: '"Cinzel",serif', fontWeight: 700,
          fontSize: '9px', letterSpacing: '3px',
          padding: '10px 24px', cursor: 'pointer',
          borderRadius: '2px',
          background: `rgba(${personaje.glowColor}, 0.1)`,
          border: `1px solid ${personaje.glowColor}60`,
          color: personaje.glowColor,
          boxShadow: `0 0 12px ${personaje.glowColor}30`,
        }}>
          ⚔ RECIBIR
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/shared/PersonajeUnlockModal.jsx
git commit -m "feat: add PersonajeUnlockModal with unlock animation"
```

---

## Task 7: useRegistros — avance de ruta + personaje

**Files:**
- Modify: `src/hooks/useRegistros.js`

- [ ] **Step 1: Actualizar marcarCamino para avanzar ruta y detectar personaje**

Reemplazar la función `marcarCamino` completa:

```js
// src/hooks/useRegistros.js
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { hoyISO } from '../utils/dates'
import { calcularXpMarca, xpANivel, nivelGlobal } from '../utils/xp'
import { v4 as uuidv4 } from 'uuid'
import { detectarPersonajeDesbloqueado } from '../constants'

export function useRegistrosHoy() {
  const hoy = hoyISO()
  return useLiveQuery(() => db.registros.where('fecha').equals(hoy).toArray(), [hoy], [])
}

export function useRegistrosSemana(fechas) {
  const key = fechas.join(',')
  return useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).toArray(),
    [key], []
  )
}

export function useRegistros30Dias() {
  const fechas = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })
  return useLiveQuery(
    () => db.registros.where('fecha').anyOf(fechas).toArray(),
    [fechas[0]], []
  )
}

async function recalcularRacha(caminoId) {
  const todos = await db.registros.where('caminoId').equals(caminoId).toArray()
  const byFecha = {}
  for (const r of todos) byFecha[r.fecha] = r.marca

  let racha = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const fecha = d.toISOString().slice(0, 10)
    const marca = byFecha[fecha]
    if (marca === 'avance') racha++
    else if (marca === 'pausa') continue
    else break
  }
  return racha
}

export async function marcarCamino(caminoId, marca, nota = null, rutaId = null) {
  const hoy = hoyISO()
  const camino = await db.caminos.get(caminoId)
  if (!camino) return null

  const existing = await db.registros
    .where('fecha').equals(hoy)
    .filter(r => r.caminoId === caminoId)
    .first()

  const nuevoXpGanado = calcularXpMarca(marca, camino.rachaActual)
  const anteriorXpGanado = existing?.xpGanado ?? 0
  const delta = existing ? nuevoXpGanado - anteriorXpGanado : nuevoXpGanado

  const nivelAnterior = camino.nivel
  const nuevoXp = Math.max(0, camino.xp + delta)
  const nuevoNivel = xpANivel(nuevoXp)

  await db.transaction('rw', db.caminos, db.registros, async () => {
    if (existing) {
      await db.registros.update(existing.id, { marca, nota, xpGanado: nuevoXpGanado, rutaId })
    } else {
      await db.registros.add({
        id: uuidv4(), fecha: hoy, caminoId, marca, nota, rutaId, xpGanado: nuevoXpGanado,
      })
    }
    await db.caminos.update(caminoId, { xp: nuevoXp, nivel: nuevoNivel })
  })

  const rachaActual = await recalcularRacha(caminoId)
  const rachaMejor = Math.max(rachaActual, camino.rachaMejor)
  await db.caminos.update(caminoId, { rachaActual, rachaMejor })

  // Avanzar paso de ruta activa si marca es avance
  let rutaCompletada = false
  if (marca === 'avance' && rutaId) {
    const ruta = await db.rutas.get(rutaId)
    if (ruta && ruta.estado === 'activa') {
      const nuevoPasoActual = (ruta.pasoActual ?? 0) + 1
      if (nuevoPasoActual >= (ruta.pasos?.length ?? 0)) {
        await db.rutas.update(rutaId, { pasoActual: nuevoPasoActual, estado: 'completada', completadaAt: new Date() })
        rutaCompletada = true
      } else {
        await db.rutas.update(rutaId, { pasoActual: nuevoPasoActual })
      }
    }
  }

  // Detectar recompensas desbloqueadas
  const recompensasDesbloqueadas = []
  if (nuevoNivel > nivelAnterior) {
    const todasRecompensas = await db.recompensas
      .filter(r => !r.reclamada && (r.caminoId === caminoId || r.caminoId === null))
      .toArray()
    const todosActivos = await db.caminos.filter(c => c.activo).toArray()
    const nivelGlobalVal = todosActivos.length
      ? Math.floor(todosActivos.reduce((s, c) => s + xpANivel(c.id === caminoId ? nuevoXp : c.xp), 0) / todosActivos.length)
      : 0
    for (const r of todasRecompensas) {
      const nivelRef  = r.caminoId === null ? nivelGlobalVal : nuevoNivel
      const nivelPrev = r.caminoId === null ? nivelGlobalVal - (nuevoNivel - nivelAnterior) : nivelAnterior
      if (nivelPrev < r.nivelRequerido && nivelRef >= r.nivelRequerido) {
        recompensasDesbloqueadas.push(r)
      }
    }
  }

  // Detectar personaje desbloqueado (nivel global)
  const todosActivos = await db.caminos.filter(c => c.activo).toArray()
  const nivelGlobalAnterior = Math.floor(
    todosActivos.reduce((s, c) => s + xpANivel(c.id === caminoId ? camino.xp : c.xp), 0) / (todosActivos.length || 1)
  )
  const nivelGlobalNuevo = Math.floor(
    todosActivos.reduce((s, c) => s + xpANivel(c.id === caminoId ? nuevoXp : c.xp), 0) / (todosActivos.length || 1)
  )
  const personajeDesbloqueado = detectarPersonajeDesbloqueado(nivelGlobalAnterior, nivelGlobalNuevo)

  return {
    xpGanado: delta,
    nivelAnterior,
    nuevoNivel,
    subioNivel: nuevoNivel > nivelAnterior,
    recompensasDesbloqueadas,
    personajeDesbloqueado,
    rutaCompletada,
  }
}

export async function agregarNotaRegistro(caminoId, nota) {
  const hoy = hoyISO()
  const existing = await db.registros
    .where('fecha').equals(hoy)
    .filter(r => r.caminoId === caminoId)
    .first()
  if (existing) await db.registros.update(existing.id, { nota })
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/hooks/useRegistros.js
git commit -m "feat: auto-advance ruta paso on LOGRADO, detect personaje unlock"
```

---

## Task 8: CaminoCard — rediseño cyberpunk completo

**Files:**
- Modify: `src/components/hoy/CaminoCard.jsx`

- [ ] **Step 1: Reescribir CaminoCard.jsx completo**

```jsx
// src/components/hoy/CaminoCard.jsx
import { useState } from 'react'
import { marcarCamino, agregarNotaRegistro } from '../../hooks/useRegistros'
import { MENSAJES_WABI_SABI } from '../../constants'
import MisionBlock from './MisionBlock'
import CelebrationFlash from './CelebrationFlash'
import RecompensaUnlockModal from '../shared/RecompensaUnlockModal'
import PersonajeUnlockModal from '../shared/PersonajeUnlockModal'
import XpBar from './XpBar'

// Colores de estado
const ESTADO = {
  avance: { neon: '#00a84a', glow: 'rgba(0,168,74,0.22)', inner: 'rgba(0,168,74,0.05)', bg: '#050d06' },
  pausa:  { neon: '#c89600', glow: 'rgba(200,150,0,0.22)', inner: 'rgba(200,150,0,0.05)', bg: '#0d0c00' },
  nada:   { neon: '#484860', glow: 'rgba(72,72,96,0.18)',  inner: 'rgba(72,72,96,0.03)',  bg: '#0a0a0f' },
  noruta: { neon: '#cc0044', glow: 'rgba(204,0,68,0.22)',  inner: 'rgba(204,0,68,0.05)',  bg: '#0d0006' },
  vacio:  { neon: '#00d4ff', glow: 'rgba(0,212,255,0.22)', inner: 'rgba(0,212,255,0.05)', bg: '#0d0d1c' },
}

function getEstado(marca, tieneRuta) {
  if (!tieneRuta) return 'noruta'
  return marca || 'vacio'
}

function mensajeWabiSabi() {
  return MENSAJES_WABI_SABI[Math.floor(Math.random() * MENSAJES_WABI_SABI.length)]
}

const BOTONES = [
  { id: 'avance', label: '¡LOGRADO!', emoji: '⚔', color: '#00cc66', bg: 'rgba(0,180,80,0.08)',  border: 'rgba(0,180,80,0.3)'  },
  { id: 'pausa',  label: 'PENDIENTE', emoji: '⏳', color: '#c89600', bg: 'rgba(200,150,0,0.08)', border: 'rgba(200,150,0,0.3)' },
  { id: 'nada',   label: 'HOY NO',   emoji: '✗',  color: '#505068', bg: 'rgba(60,60,90,0.08)',  border: 'rgba(60,60,90,0.3)'  },
]

export default function CaminoCard({ camino, registroHoy, rutaActiva, onAbrirManager, onNavTab }) {
  const [celebracion, setCelebracion]         = useState(null) // { xpGanado, subioNivel, nuevoNivel }
  const [recompensaUnlock, setRecompensaUnlock] = useState(null)
  const [personajeUnlock, setPersonajeUnlock]   = useState(null)
  const [showNota, setShowNota]               = useState(false)
  const [notaInput, setNotaInput]             = useState('')
  const [wabiMsg, setWabiMsg]                 = useState(null)
  const [procesando, setProcesando]           = useState(false)

  const marcaHoy = registroHoy?.marca || null
  const tieneRuta = !!rutaActiva
  const tieneAccion = tieneRuta && rutaActiva.pasos?.length > 0 && (rutaActiva.pasoActual ?? 0) < rutaActiva.pasos.length
  const botonesActivos = tieneRuta && tieneAccion

  const estadoKey = getEstado(marcaHoy, tieneRuta)
  const est = ESTADO[estadoKey] || ESTADO.vacio

  const handleMarcar = async (marca) => {
    if (procesando || !botonesActivos) return
    setProcesando(true)
    try {
      const result = await marcarCamino(camino.id, marca, null, rutaActiva?.id || null)
      if (result?.xpGanado > 0 && marca === 'avance') {
        setCelebracion({ xpGanado: result.xpGanado, subioNivel: result.subioNivel, nuevoNivel: result.nuevoNivel })
      }
      if (result?.recompensasDesbloqueadas?.length > 0) {
        setRecompensaUnlock(result.recompensasDesbloqueadas[0])
      }
      if (result?.personajeDesbloqueado) {
        setPersonajeUnlock(result.personajeDesbloqueado)
      }
      if (marca === 'avance') {
        setShowNota(true); setNotaInput(registroHoy?.nota || '')
      } else if (marca === 'nada') {
        setWabiMsg(mensajeWabiSabi()); setTimeout(() => setWabiMsg(null), 3500); setShowNota(false)
      } else {
        setShowNota(false)
      }
    } finally {
      setProcesando(false)
    }
  }

  const handleGuardarNota = async () => {
    if (notaInput.trim()) await agregarNotaRegistro(camino.id, notaInput.trim())
    setShowNota(false); setNotaInput('')
  }

  return (
    <div style={{
      position: 'relative',
      margin: '0 12px 14px',
      background: `linear-gradient(160deg, ${est.bg} 0%, #04040c 100%)`,
      border: `1px solid ${est.neon}`,
      borderRadius: '3px',
      boxShadow: `0 0 8px ${est.glow}, inset 0 0 12px ${est.inner}`,
      padding: '12px',
      overflow: 'hidden',
    }}>
      {/* Línea decorativa superior */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${est.neon}, transparent)`,
        boxShadow: `0 0 8px ${est.neon}`,
        opacity: 0.7,
      }} />

      {/* Scan lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '3px',
        background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)',
      }} />

      {/* CelebrationFlash */}
      {celebracion && (
        <CelebrationFlash
          xpGanado={celebracion.xpGanado}
          subioNivel={celebracion.subioNivel}
          nuevoNivel={celebracion.nuevoNivel}
          onDone={() => setCelebracion(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{camino.icono}</span>
          <span style={{ fontFamily: '"Cinzel",serif', fontWeight: 700, fontSize: '13px', color: '#e8e6e3' }}>
            {camino.nombre}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {camino.rachaActual > 0 && (
            <span style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '8px', color: '#ff6d00', background: 'rgba(255,109,0,0.08)', border: '1px solid rgba(255,109,0,0.2)', padding: '2px 6px', borderRadius: '2px', clipPath: 'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)' }}>
              🔥×{camino.rachaActual}
            </span>
          )}
          <span style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '8px', color: '#ffd700', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', padding: '2px 6px', borderRadius: '2px', clipPath: 'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)' }}>
            NV.{camino.nivel}
          </span>
        </div>
      </div>

      {/* XP Bar */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <XpBar xp={camino.xp} className="mb-2" />
      </div>

      {/* Bloque Misión */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <MisionBlock
          rutaActiva={rutaActiva}
          marcaHoy={marcaHoy}
          onNavChat={() => onNavTab?.(4)}
          onNavRutas={() => onNavTab?.(2)}
        />
      </div>

      {/* Botones de marca */}
      <div style={{ display: 'flex', gap: '5px', position: 'relative', zIndex: 1 }}>
        {BOTONES.map(b => {
          const activo = marcaHoy === b.id
          const bloqueado = !botonesActivos || procesando
          return (
            <button key={b.id} onClick={() => handleMarcar(b.id)}
              disabled={bloqueado}
              style={{
                flex: 1, padding: '9px 2px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                fontFamily: '"Cinzel",serif', fontSize: '7px', fontWeight: 700, letterSpacing: '0.3px',
                cursor: bloqueado ? 'not-allowed' : 'pointer',
                borderRadius: '2px',
                background: bloqueado ? '#06060e' : (activo ? b.bg : 'rgba(6,6,14,0.6)'),
                border: `1px solid ${bloqueado ? '#0c0c18' : (activo ? b.border : 'rgba(255,255,255,0.05)')}`,
                color: bloqueado ? '#10101a' : (activo ? b.color : '#2a2a40'),
                position: 'relative', overflow: 'hidden',
                clipPath: 'polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)',
                transition: 'all 0.15s',
              }}>
              {/* Línea neon superior en activo */}
              {activo && !bloqueado && (
                <div style={{
                  position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                  background: `linear-gradient(90deg,transparent,${b.color},transparent)`,
                  boxShadow: `0 0 6px ${b.color}60`,
                }} />
              )}
              <span style={{ fontSize: '17px', lineHeight: 1 }}>{b.emoji}</span>
              <span>{b.label}</span>
            </button>
          )
        })}
      </div>

      {/* Wabi-sabi */}
      {wabiMsg && (
        <p style={{ marginTop: '8px', fontFamily: 'Inter,sans-serif', fontSize: '10px', fontStyle: 'italic', color: '#c4a882', textAlign: 'center', lineHeight: 1.4, position: 'relative', zIndex: 1 }}>
          {wabiMsg}
        </p>
      )}

      {/* Nota guardada */}
      {!showNota && registroHoy?.nota && (
        <p style={{ marginTop: '6px', fontFamily: 'Inter,sans-serif', fontSize: '10px', color: '#4a5068', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
          "{registroHoy.nota}"
        </p>
      )}

      {/* Input nota */}
      {showNota && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', position: 'relative', zIndex: 1 }}>
          <input autoFocus value={notaInput} onChange={e => setNotaInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGuardarNota()}
            placeholder="Nota opcional..."
            style={{ flex: 1, padding: '6px 10px', fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#e8e6e3', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', outline: 'none' }}
          />
          <button onClick={handleGuardarNota} style={{ padding: '6px 12px', background: 'rgba(0,168,74,0.1)', border: '1px solid rgba(0,168,74,0.3)', borderRadius: '2px', color: '#00a84a', fontFamily: '"Cinzel",serif', fontSize: '8px', cursor: 'pointer' }}>OK</button>
          <button onClick={() => setShowNota(false)} style={{ padding: '6px', background: 'none', border: 'none', color: '#4a5068', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Modales */}
      {recompensaUnlock && (
        <RecompensaUnlockModal recompensa={recompensaUnlock} onClose={() => setRecompensaUnlock(null)} />
      )}
      {personajeUnlock && (
        <PersonajeUnlockModal personaje={personajeUnlock} onClose={() => setPersonajeUnlock(null)} />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/hoy/CaminoCard.jsx
git commit -m "feat: full cyberpunk CaminoCard redesign with new button labels"
```

---

## Task 9: CronicaSemanal

**Files:**
- Create: `src/components/hoy/CronicaSemanal.jsx`

- [ ] **Step 1: Crear CronicaSemanal.jsx**

```jsx
// src/components/hoy/CronicaSemanal.jsx
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { lunesDeSemana, diasDeSemana, hoyISO, formatearFechaCorta } from '../../utils/dates'
import { xpANivel } from '../../utils/xp'

const DIAS_LABEL = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function colorDia(registrosDia, caminosActivos, esHoy) {
  if (esHoy) return { bg: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: 'rgba(0,212,255,0.3)' }
  if (!registrosDia.length) return { bg: 'rgba(30,30,50,0.2)', color: '#1e1e40', border: 'rgba(30,30,50,0.3)' }
  const avances = registrosDia.filter(r => r.marca === 'avance').length
  const nadas   = registrosDia.filter(r => r.marca === 'nada').length
  if (avances >= caminosActivos / 2) return { bg: 'rgba(0,168,74,0.2)', color: '#00a84a', border: 'rgba(0,168,74,0.3)' }
  if (nadas   >= caminosActivos / 2) return { bg: 'rgba(204,0,68,0.15)', color: '#cc0044', border: 'rgba(204,0,68,0.2)' }
  return { bg: 'rgba(200,150,0,0.15)', color: '#c89600', border: 'rgba(200,150,0,0.25)' }
}

export default function CronicaSemanal({ caminos }) {
  const hoy = hoyISO()
  const lunes = lunesDeSemana()
  const dias = diasDeSemana(lunes)

  const registrosSemana = useLiveQuery(
    () => db.registros.where('fecha').anyOf(dias).toArray(),
    [dias[0]], []
  )

  if (!registrosSemana || !caminos?.length) return null

  const caminosActivos = caminos.filter(c => c.activo)
  const hoyIdx = dias.indexOf(hoy)
  const diasTranscurridos = hoyIdx >= 0 ? hoyIdx + 1 : 7

  // Score global semana
  const avancesTotales = registrosSemana.filter(r => r.marca === 'avance').length
  const posibleTotal   = caminosActivos.length * diasTranscurridos

  // XP por camino esta semana
  const xpPorCamino = {}
  for (const r of registrosSemana) {
    xpPorCamino[r.caminoId] = (xpPorCamino[r.caminoId] || 0) + (r.xpGanado || 0)
  }

  const caminosOrdenados = [...caminosActivos].sort((a, b) => (xpPorCamino[b.id] || 0) - (xpPorCamino[a.id] || 0))

  // Rango de semana para header
  const rangoLabel = `${formatearFechaCorta(dias[0])} – ${formatearFechaCorta(dias[6])}`

  return (
    <div style={{
      background: 'linear-gradient(175deg, #0f0e1c 0%, #0a0916 100%)',
      border: '1px solid rgba(255,215,0,0.25)',
      borderRadius: '3px',
      boxShadow: '0 0 10px rgba(255,215,0,0.08), inset 0 0 20px rgba(0,0,0,0.4)',
      position: 'relative', overflow: 'hidden',
      marginBottom: '2px',
    }}>
      {/* Línea dorada superior */}
      <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,215,0,0.5),transparent)', boxShadow: '0 0 6px rgba(255,215,0,0.3)' }} />

      {/* Header */}
      <div style={{ padding: '8px 14px 6px', borderBottom: '1px solid rgba(255,215,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: '"Cinzel",serif', fontWeight: 900, fontSize: '10px', color: '#ffd700', letterSpacing: '2px', textShadow: '0 0 8px rgba(255,215,0,0.3)' }}>
          ⚔ CRÓNICA SEMANAL
        </span>
        <span style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '7px', color: '#3a3020' }}>
          {rangoLabel}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '8px 14px 10px' }}>
        {/* Score + días */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontFamily: '"Cinzel",serif', fontWeight: 900, fontSize: '28px', color: '#ffd700', lineHeight: 1, textShadow: '0 0 16px rgba(255,215,0,0.4)' }}>
              {avancesTotales}
            </span>
            <span style={{ fontFamily: '"Cinzel",serif', fontSize: '11px', color: '#3a3020' }}>
              /{posibleTotal}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '6px', color: '#2a2010', letterSpacing: '2px', marginBottom: '4px' }}>AVANCES</div>
            <div style={{ display: 'flex', gap: '2px' }}>
              {dias.map((dia, i) => {
                const regDia = registrosSemana.filter(r => r.fecha === dia)
                const esHoy = dia === hoy
                const col = colorDia(regDia, caminosActivos.length, esHoy)
                return (
                  <div key={dia} style={{
                    flex: 1, height: '16px', borderRadius: '1px',
                    background: col.bg, color: col.color,
                    border: `1px solid ${col.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Cinzel",serif', fontSize: '6px',
                  }}>
                    {DIAS_LABEL[i]}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Caminos mini */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {caminosOrdenados.map(c => {
            const xpSemana = xpPorCamino[c.id] || 0
            const maxXp = Math.max(...Object.values(xpPorCamino), 1)
            const pct = Math.round((xpSemana / maxXp) * 100)
            const col = xpSemana > 0 ? '#00a84a' : (registrosSemana.some(r => r.caminoId === c.id && r.marca === 'nada') ? '#cc0044' : '#2a2a40')
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', width: '16px', textAlign: 'center', flexShrink: 0 }}>{c.icono}</span>
                <span style={{ fontFamily: '"Cinzel",serif', fontSize: '7px', color: '#3a3050', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                  {c.nombre}
                </span>
                <div style={{ width: '60px', height: '3px', background: 'rgba(0,0,0,0.4)', borderRadius: '1px', overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: '1px', transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontFamily: '"Share Tech Mono",monospace', fontSize: '7px', color: '#2a2010', width: '28px', textAlign: 'right', flexShrink: 0 }}>
                  +{xpSemana}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/hoy/CronicaSemanal.jsx
git commit -m "feat: add CronicaSemanal weekly dashboard"
```

---

## Task 10: PersonajesColumna

**Files:**
- Create: `src/components/hoy/PersonajesColumna.jsx`

- [ ] **Step 1: Crear PersonajesColumna.jsx**

```jsx
// src/components/hoy/PersonajesColumna.jsx
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { PERSONAJES, PersonajeSprite, nivelGlobal } from '../../constants'
import { nivelGlobal as calcNivelGlobal } from '../../utils/xp'

export default function PersonajesColumna() {
  const todosCaminos = useLiveQuery(() => db.caminos.toArray(), [], [])
  const nvGlobal = calcNivelGlobal(todosCaminos || [])

  const desbloqueados = PERSONAJES.filter(p => p.nivelDesbloqueo <= nvGlobal)
  const mostrar = [...desbloqueados].reverse().slice(0, 5) // últimos 5 desbloqueados

  // Completar hasta 5 slots con bloqueados
  const bloqueados = PERSONAJES.filter(p => p.nivelDesbloqueo > nvGlobal)
  const slots = [
    ...mostrar,
    ...bloqueados.slice(0, Math.max(0, 5 - mostrar.length)).map(p => ({ ...p, bloqueado: true })),
  ]

  return (
    <div style={{ width: '46px', flexShrink: 0, paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {slots.map((p, i) => (
        <div key={p.id + i} title={p.bloqueado ? `??? · NV.${p.nivelDesbloqueo}` : p.nombre}
          style={{
            width: '42px', height: '42px',
            border: p.bloqueado ? '1px solid rgba(255,255,255,0.03)' : `1px solid ${p.glowColor}30`,
            borderRadius: '2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: p.bloqueado ? 'rgba(0,0,0,0.2)' : `radial-gradient(ellipse at center, ${p.glowColor}08 0%, transparent 70%)`,
            opacity: p.bloqueado ? 0.2 : 1,
            filter: p.bloqueado ? 'grayscale(1)' : 'none',
            boxShadow: p.bloqueado ? 'none' : `0 0 6px ${p.glowColor}20`,
            cursor: p.bloqueado ? 'default' : 'pointer',
          }}>
          {p.bloqueado
            ? <span style={{ fontSize: '12px', opacity: 0.3 }}>🔒</span>
            : <PersonajeSprite personaje={p} size={32} />
          }
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verificar build**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/hoy/PersonajesColumna.jsx
git commit -m "feat: add PersonajesColumna with unlock slots"
```

---

## Task 11: HoyView — montar tablón + personajes + onNavTab

**Files:**
- Modify: `src/components/hoy/HoyView.jsx`

- [ ] **Step 1: Actualizar HoyView.jsx**

Reemplazar el import block y el return completo:

```jsx
// src/components/hoy/HoyView.jsx
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useCaminosActivos } from '../../hooks/useCaminos'
import { useRegistrosHoy } from '../../hooks/useRegistros'
import { scoreDiario } from '../../utils/stats'
import { nivelGlobal, nombreNivel } from '../../utils/xp'
import { hoyISO, haceNDiasISO, formatearFechaLarga } from '../../utils/dates'
import { v4 as uuidv4 } from 'uuid'
import CaminoCard from './CaminoCard'
import PlanBanner from './PlanBanner'
import ScoreDiario from './ScoreDiario'
import XpBar from './XpBar'
import FraseIkigai from './FraseIkigai'
import CaminosManager from './CaminosManager'
import PersonajeHeader from './PersonajeHeader'
import AcertijoDelDia, { debeAparecerHoy } from './AcertijoDelDia'
import CronicaSemanal from './CronicaSemanal'
import PersonajesColumna from './PersonajesColumna'

export default function HoyView({ onNavTab }) {
  const hoy = hoyISO()
  const caminos      = useCaminosActivos()
  const registrosHoy = useRegistrosHoy()
  const planHoy      = useLiveQuery(() => db.planificacion.where('fecha').equals(hoy).first(), [hoy])
  const rutasActivas = useLiveQuery(() => db.rutas.where('estado').equals('activa').toArray(), [], [])
  const todosCaminos = useLiveQuery(() => db.caminos.toArray(), [], [])

  const [showManager,   setShowManager]   = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planTexto,     setPlanTexto]     = useState('')
  const [gratitudTexto, setGratitudTexto] = useState('')
  const [guardandoPlan, setGuardandoPlan] = useState(false)

  if (showManager) {
    return <CaminosManager onClose={() => setShowManager(false)} />
  }

  const score    = scoreDiario(registrosHoy, caminos)
  const nivelG   = nivelGlobal(todosCaminos)
  const xpGlobal = todosCaminos.filter(c => c.activo).reduce((s, c) => s + (c.xp || 0), 0)

  const getRutaActiva  = (caminoId) => (rutasActivas || []).find(r => r.caminoId === caminoId) || null
  const getRegistroHoy = (caminoId) => registrosHoy.find(r => r.caminoId === caminoId) || null

  const abrirModal = () => { setPlanTexto(''); setGratitudTexto(''); setShowPlanModal(true) }

  const guardarPlan = async () => {
    setGuardandoPlan(true)
    const manana = haceNDiasISO(-1)
    if (planTexto.trim()) {
      const existing = await db.planificacion.where('fecha').equals(manana).first()
      if (existing) await db.planificacion.update(existing.id, { texto: planTexto.trim() })
      else await db.planificacion.add({ id: uuidv4(), fecha: manana, texto: planTexto.trim(), creadoAt: new Date() })
    }
    if (gratitudTexto.trim()) {
      await db.reflexiones.add({ id: uuidv4(), fecha: hoy, tipo: 'gratitud', texto: gratitudTexto.trim(), creadoAt: new Date() })
    }
    setPlanTexto(''); setGratitudTexto('')
    setShowPlanModal(false); setGuardandoPlan(false)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-bg-deep">
        <p className="font-body text-xs text-text-muted capitalize mb-1.5">{formatearFechaLarga(hoy)}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PersonajeHeader nivel={nivelG} />
            <div>
              <span className="font-pixel text-sm text-xp-bar text-glow-xp">{nombreNivel(nivelG)}</span>
              <span className="ml-2 font-pixel text-[10px] text-text-muted">Nv.{nivelG}</span>
            </div>
          </div>
          <button onClick={() => setShowManager(true)}
            className="font-pixel text-[8px] px-3 py-2 active:translate-y-[1px] active:translate-x-[1px]"
            style={{ background: 'linear-gradient(180deg,#342848,#2a2035)', border: '2px solid #6a5880', borderRadius: '2px', color: '#c4a882', boxShadow: '3px 3px 0 rgba(0,0,0,0.6)' }}>
            ⚙ CAMINOS
          </button>
        </div>
        <XpBar xp={xpGlobal} />
      </div>

      {/* Frase Ikigai */}
      <div className="mt-3"><FraseIkigai /></div>

      {/* Acertijo */}
      {debeAparecerHoy() && <AcertijoDelDia />}

      {/* Plan banner */}
      <PlanBanner texto={planHoy?.texto} />

      {/* TABLÓN SEMANAL + PERSONAJES */}
      <div style={{ display: 'flex', gap: 0, margin: '8px 12px 4px', alignItems: 'flex-start' }}>
        <PersonajesColumna />
        <div style={{ flex: 1 }}>
          <CronicaSemanal caminos={caminos} />
        </div>
      </div>

      {/* Camino cards */}
      <div className="flex-1 pt-1">
        {caminos.map(camino => (
          <CaminoCard
            key={camino.id}
            camino={camino}
            registroHoy={getRegistroHoy(camino.id)}
            rutaActiva={getRutaActiva(camino.id)}
            onAbrirManager={() => setShowManager(true)}
            onNavTab={onNavTab}
          />
        ))}
      </div>

      {/* Score diario */}
      <ScoreDiario avances={score.avances} total={score.total} pct={score.pct} />

      {/* FAB planificar mañana */}
      <button onClick={abrirModal}
        className="fixed bottom-20 right-4 font-pixel text-[9px] z-40 active:translate-y-[1px] active:translate-x-[1px] transition-transform"
        style={{ background: 'linear-gradient(180deg,#e94560,#c03040)', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '4px 4px 0px rgba(0,0,0,0.7)', color: '#fff', padding: '10px 14px' }}>
        📋 MAÑANA
      </button>

      {/* Modal planificación */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4"
             onClick={e => e.target === e.currentTarget && setShowPlanModal(false)}>
          <div className="w-full max-w-[480px] p-4 mb-16 animate-fade-in-up"
               style={{ background: 'linear-gradient(180deg,#2a2035 0%,#1a1520 100%)', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}>
            <h3 className="font-pixel text-[11px] text-text-primary mb-4">PLANIFICAR MAÑANA</h3>
            <div className="mb-4">
              <label className="block font-pixel text-[7px] text-text-muted uppercase tracking-wider mb-2">✦ Intención para mañana</label>
              <textarea autoFocus value={planTexto} onChange={e => setPlanTexto(e.target.value)}
                placeholder="¿Qué quieres lograr mañana?" rows={3}
                className="w-full px-3 py-2 font-body text-sm text-text-primary placeholder-text-muted outline-none resize-none"
                style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }} />
            </div>
            <div className="mb-4">
              <label className="block font-pixel text-[7px] text-text-muted uppercase tracking-wider mb-2">🙏 Gratitud de hoy</label>
              <textarea value={gratitudTexto} onChange={e => setGratitudTexto(e.target.value)}
                placeholder="¿Por qué estás agradecido hoy?" rows={2}
                className="w-full px-3 py-2 font-body text-sm text-text-primary placeholder-text-muted outline-none resize-none"
                style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 py-2.5 font-pixel text-[9px] text-text-muted"
                style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>CANCELAR</button>
              <button onClick={guardarPlan} disabled={guardandoPlan}
                className="flex-1 py-2.5 font-pixel text-[9px] text-white disabled:opacity-50 active:translate-y-[1px] active:translate-x-[1px]"
                style={{ background: 'linear-gradient(180deg,#e94560,#c03040)', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>GUARDAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verificar build limpio**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos" && npx vite build 2>&1 | tail -8
```
Esperado: `✓ built in`

- [ ] **Step 3: Verificar que App.jsx pasa onNavTab a HoyView**

Leer `src/App.jsx`. Si HoyView no recibe `onNavTab`, añadirlo:
```jsx
// En el JSX donde se renderiza HoyView, pasar la prop:
<HoyView onNavTab={(tabIndex) => setActiveTab(tabIndex)} />
```
(el nombre exacto de la función de navegación depende de cómo App.jsx gestiona las tabs — adaptar según lo encontrado)

- [ ] **Step 4: Commit final**

```bash
cd "D:/PROYECTO_CAMINOS/10-caminos"
git add src/components/hoy/HoyView.jsx src/App.jsx
git commit -m "feat: wire CronicaSemanal + PersonajesColumna into HoyView"
```

---

## Self-Review

**Spec coverage:**
- ✅ Fuente Cinzel (Task 1)
- ✅ Card cyberpunk 5 estados (Task 8)
- ✅ Bloque MISIÓN 4 estados (Task 5)
- ✅ Botones ¡LOGRADO! / PENDIENTE / HOY NO (Task 8)
- ✅ Botones bloqueados sin ruta/paso (Task 8 — `botonesActivos`)
- ✅ CelebrationFlash al marcar LOGRADO (Tasks 4, 8)
- ✅ Cola editable inline (Task 5 — `ColaEditor`)
- ✅ Auto-avance paso en marcarCamino (Task 7)
- ✅ Detección personaje desbloqueado (Tasks 2, 7)
- ✅ Modal PersonajeUnlock (Task 6)
- ✅ Tablón semanal CronicaSemanal (Task 9)
- ✅ PersonajesColumna (Task 10)
- ✅ 20 personajes pixel art (Task 2)
- ✅ HoyView integración (Task 11)

**Placeholder scan:** ninguno encontrado — todos los pasos tienen código completo.

**Type consistency:**
- `PersonajeSprite` definida en Task 2, usada en Tasks 4, 6, 10 ✅
- `detectarPersonajeDesbloqueado` definida en Task 2, usada en Task 7 ✅
- `getPersonajeActivo` definida en Task 2, usada en Task 4 ✅
- `marcarCamino` retorna `personajeDesbloqueado` en Task 7, leído en Task 8 ✅
- `onNavTab` prop añadida en Task 8 (CaminoCard), propagada en Task 11 (HoyView) ✅
