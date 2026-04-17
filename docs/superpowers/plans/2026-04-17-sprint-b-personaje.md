# Sprint B — Sistema de Personaje: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un avatar circular SVG totalmente configurable (piel, pelo, ojos, vello facial, personalidad, bio) que reemplaza el sprite actual en el header, evoluciona visualmente con el nivel, y pasa datos de personalidad al chat IA.

**Architecture:** Constantes en `personaje.js`, hook `usePersonaje.js` para acceso reactivo a DB, componente SVG `AvatarPersonaje.jsx` completamente paramétrico, modal `PersonajeEditor.jsx` para edición. Los efectos de progresión se calculan dentro de `AvatarPersonaje` según el nivel. Integración en HoyView y en `claude.js` para el system prompt.

**Tech Stack:** React 18, Dexie.js (LiveQuery), SVG puro, Tailwind CSS, @phosphor-icons/react

---

## File Map

| Archivo | Acción |
|---|---|
| `src/personaje.js` | **Nuevo** — paletas, personalidades, defaults |
| `src/hooks/usePersonaje.js` | **Nuevo** — LiveQuery + guardar personaje |
| `src/components/personaje/AvatarPersonaje.jsx` | **Nuevo** — SVG paramétrico |
| `src/components/personaje/PersonajeEditor.jsx` | **Nuevo** — modal de edición completo |
| `src/components/hoy/HoyView.jsx` | Integrar AvatarPersonaje + editor |
| `src/services/claude.js` | Inyectar personalidad en system prompt |

---

### Task 1: personaje.js + usePersonaje.js

**Files:**
- Create: `src/personaje.js`
- Create: `src/hooks/usePersonaje.js`

- [ ] **Step 1: Crear src/personaje.js**

```js
// Paletas de color para el avatar
export const PIEL_COLORES  = ['#FDDBB4', '#E8B88A', '#C68642', '#A0522D', '#5C3317']
export const PELO_COLORES  = ['#1A1A1A', '#5C3317', '#C8A850', '#8B2500', '#A0A0A0', '#F0F0F0', '#7B2D8B', '#2D6A8B']
export const OJOS_COLORES  = ['#6B3A2A', '#2D6A8B', '#3A8B3A', '#8B6C3A', '#1A1A1A']

export const PELO_ESTILOS  = ['Corto', 'Medio', 'Largo', 'Rizado', 'Rapado']
export const VELLO_OPCIONES = ['Ninguno', 'Barba corta', 'Barba']

export const PERSONALIDADES = {
  analitico:   { label: 'Analítico',   emoji: '🧠', desc: 'Piensa antes de actuar. Valora la lógica y los datos.' },
  creativo:    { label: 'Creativo',    emoji: '🎨', desc: 'Busca soluciones originales. Piensa fuera de la caja.' },
  aventurero:  { label: 'Aventurero',  emoji: '⚡', desc: 'Le gustan los retos. Actúa rápido y aprende en el camino.' },
  equilibrado: { label: 'Equilibrado', emoji: '☯️', desc: 'Busca armonía. Valora la constancia sobre los extremos.' },
  guerrero:    { label: 'Guerrero',    emoji: '🔥', desc: 'Determinado. No se rinde. La disciplina es su arma.' },
}

export const PERSONAJE_DEFAULT = {
  nombre: 'Viajero',
  bio: '',
  personalidad: 'equilibrado',
  piel: 2,
  peloCColor: 1,
  peloEstilo: 1,
  ojos: 0,
  vellos: 0,
}
```

- [ ] **Step 2: Crear src/hooks/usePersonaje.js**

```js
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { PERSONAJE_DEFAULT } from '../personaje'

export function usePersonaje() {
  const registro = useLiveQuery(
    () => db.configuracion.get('personaje'),
    [],
    null
  )
  // Mientras carga o no existe, devolver default
  if (registro === null) return PERSONAJE_DEFAULT
  return registro?.value ?? PERSONAJE_DEFAULT
}

export async function guardarPersonaje(datos) {
  await db.configuracion.put({ key: 'personaje', value: datos })
}
```

- [ ] **Step 3: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/personaje.js src/hooks/usePersonaje.js && git commit -m "feat: add personaje constants and usePersonaje hook"
```

---

### Task 2: AvatarPersonaje — SVG paramétrico

**Files:**
- Create: `src/components/personaje/AvatarPersonaje.jsx`

- [ ] **Step 1: Crear el directorio y el componente**

```bash
mkdir "D:\PROYECTO_CAMINOS\10-caminos\src\components\personaje"
```

- [ ] **Step 2: Crear AvatarPersonaje.jsx**

```jsx
import { PIEL_COLORES, PELO_COLORES, OJOS_COLORES } from '../../personaje'

// Efecto de nivel: determina qué capas visuales activar
function nivelesActivos(nivel) {
  return {
    glow:          nivel >= 5,
    goldenHair:    nivel >= 10,
    shimmerEyes:   nivel >= 15,
    aura:          nivel >= 20,
    // Efectos secretos — no documentados públicamente
    _eyebrowRaise: nivel >= 7  && nivel < 10,
    _sparkles:     nivel >= 11 && nivel < 15,
    _hueShift:     nivel >= 16 && nivel < 20,
    _rainbow:      nivel >= 23,
    _float:        nivel >= 28,
  }
}

function PeloPath({ estilo, color, offsetY = 0 }) {
  // Coordenadas para cara centrada en x=20, parte superior de cabeza y=8+offsetY
  const y = 8 + offsetY
  switch (estilo) {
    case 4: // Rapado — franja muy fina
      return <rect x="11" y={y} width="18" height="2" rx="1" fill={color} />
    case 0: // Corto
      return (
        <>
          <rect x="11" y={y} width="18" height="6" rx="3" fill={color} />
          <rect x="10" y={y + 3} width="2" height="4" rx="1" fill={color} />
          <rect x="28" y={y + 3} width="2" height="4" rx="1" fill={color} />
        </>
      )
    case 1: // Medio
      return (
        <>
          <rect x="11" y={y} width="18" height="6" rx="3" fill={color} />
          <rect x="9"  y={y + 2} width="3" height="8" rx="1.5" fill={color} />
          <rect x="28" y={y + 2} width="3" height="8" rx="1.5" fill={color} />
        </>
      )
    case 2: // Largo
      return (
        <>
          <rect x="11" y={y} width="18" height="6" rx="3" fill={color} />
          <rect x="8"  y={y + 2} width="4" height="18" rx="2" fill={color} />
          <rect x="28" y={y + 2} width="4" height="18" rx="2" fill={color} />
          <rect x="10" y={y + 18} width="20" height="4" rx="2" fill={color} />
        </>
      )
    case 3: // Rizado — círculos superpuestos
      return (
        <>
          <circle cx="15" cy={y + 3} r="4" fill={color} />
          <circle cx="20" cy={y + 1} r="4" fill={color} />
          <circle cx="25" cy={y + 3} r="4" fill={color} />
          <circle cx="12" cy={y + 6} r="3" fill={color} />
          <circle cx="28" cy={y + 6} r="3" fill={color} />
        </>
      )
    default:
      return null
  }
}

export default function AvatarPersonaje({ config = {}, nivel = 0, size = 48 }) {
  const {
    piel = 2, peloCColor = 1, peloEstilo = 1,
    ojos = 0, vellos = 0,
  } = config

  const skinColor = PIEL_COLORES[piel] ?? PIEL_COLORES[2]
  const hairColor = PELO_COLORES[peloCColor] ?? PELO_COLORES[1]
  const eyeColor  = OJOS_COLORES[ojos] ?? OJOS_COLORES[0]
  const hairDark  = hairColor === '#F0F0F0' ? '#C0C0C0' : hairColor

  const fx = nivelesActivos(nivel)

  // Sombra exterior CSS para glow y aura
  let wrapperStyle = {}
  if (fx.aura) {
    wrapperStyle = {
      filter: 'drop-shadow(0 0 10px #f0c040) drop-shadow(0 0 20px #f0c04060)',
      animation: 'auraFloat 3s ease-in-out infinite',
    }
  } else if (fx.glow) {
    wrapperStyle = {
      filter: `drop-shadow(0 0 6px #e9456060)`,
    }
  }
  if (fx._rainbow) {
    wrapperStyle = { ...wrapperStyle, animation: 'rainbowBorder 4s linear infinite' }
  }
  if (fx._float) {
    wrapperStyle = { ...wrapperStyle, animation: 'avatarFloat 2.5s ease-in-out infinite' }
  }

  const uid = `avatar-clip-${piel}-${peloCColor}-${nivel}`

  return (
    <div style={{ position: 'relative', width: size, height: size, ...wrapperStyle }}>
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <clipPath id={uid}>
            <circle cx="20" cy="20" r="20" />
          </clipPath>
          {fx.shimmerEyes && (
            <radialGradient id={`iris-shine-${uid}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor={eyeColor} stopOpacity="1" />
            </radialGradient>
          )}
        </defs>

        <g clipPath={`url(#${uid})`}>
          {/* Fondo */}
          <circle cx="20" cy="20" r="20" fill="#181726" />

          {/* Hombros */}
          <ellipse cx="20" cy="38" rx="16" ry="8" fill={skinColor} />

          {/* Cuello */}
          <rect x="16" y="27" width="8" height="6" rx="2" fill={skinColor} />

          {/* Pelo — detrás de la cara */}
          <PeloPath estilo={peloEstilo} color={hairColor} offsetY={0} />

          {/* Cara */}
          <ellipse cx="20" cy="19" rx="9" ry="10" fill={skinColor} />

          {/* Overlay dorado en pelo (nivel 10+) */}
          {fx.goldenHair && (
            <g opacity="0.35">
              <PeloPath estilo={peloEstilo} color="#f0c040" offsetY={0} />
            </g>
          )}

          {/* Cejas */}
          <rect x="13.5" y="13.5" width="5" height="1.2" rx="0.6"
            fill={hairDark}
            transform={fx._eyebrowRaise ? 'rotate(-5, 16, 14)' : ''}
          />
          <rect x="21.5" y="13.5" width="5" height="1.2" rx="0.6"
            fill={hairDark}
            transform={fx._eyebrowRaise ? 'rotate(5, 24, 14)' : ''}
          />

          {/* Ojos — fondo blanco */}
          <circle cx="16" cy="17" r="2"  fill="#ffffff" />
          <circle cx="24" cy="17" r="2"  fill="#ffffff" />

          {/* Iris */}
          <circle cx="16" cy="17" r="1.4"
            fill={fx.shimmerEyes ? `url(#iris-shine-${uid})` : eyeColor} />
          <circle cx="24" cy="17" r="1.4"
            fill={fx.shimmerEyes ? `url(#iris-shine-${uid})` : eyeColor} />

          {/* Pupila */}
          <circle cx="16.3" cy="17" r="0.7" fill="#1a1a1a" />
          <circle cx="24.3" cy="17" r="0.7" fill="#1a1a1a" />

          {/* Brillo ojo */}
          <circle cx="15.3" cy="16.2" r="0.45" fill="#ffffff" />
          <circle cx="23.3" cy="16.2" r="0.45" fill="#ffffff" />

          {/* Boca */}
          <path d="M 16.5 22.5 Q 20 25 23.5 22.5" stroke="#6B3A2A" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Vello facial */}
          {vellos === 1 && (
            <>
              <rect x="16" y="23" width="3" height="0.8" rx="0.4" fill={hairDark} opacity="0.7" />
              <rect x="21" y="23" width="3" height="0.8" rx="0.4" fill={hairDark} opacity="0.7" />
              <rect x="17" y="24.2" width="6" height="0.8" rx="0.4" fill={hairDark} opacity="0.7" />
            </>
          )}
          {vellos === 2 && (
            <>
              <path d="M 14 23 Q 20 28 26 23" stroke={hairDark} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.85" />
              <rect x="14" y="23" width="12" height="4" rx="2" fill={hairDark} opacity="0.6" />
            </>
          )}

          {/* Sparkles secretos nivel 11-14 */}
          {fx._sparkles && (
            <g>
              <circle cx="8" cy="10" r="1" fill="#f0c040">
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.5;1.2;0.5" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="8" r="1" fill="#f0c040">
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.5;1.2;0.5" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
              </circle>
              <circle cx="35" cy="22" r="0.8" fill="#f0c040">
                <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
        </g>

        {/* Borde circular exterior */}
        <circle cx="20" cy="20" r="19.5" fill="none"
          strokeWidth="1"
          stroke={fx.aura ? '#f0c040' : fx.glow ? '#e9456060' : '#302e4e'}
        />
      </svg>
    </div>
  )
}
```

- [ ] **Step 3: Añadir animaciones CSS en index.css**

En `src/index.css`, antes del último bloque, añadir:

```css
@keyframes auraFloat {
  0%, 100% { filter: drop-shadow(0 0 10px #f0c040) drop-shadow(0 0 20px #f0c04060); }
  50%       { filter: drop-shadow(0 0 16px #f0c040) drop-shadow(0 0 32px #f0c04080); }
}
@keyframes avatarFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}
```

- [ ] **Step 4: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/components/personaje/AvatarPersonaje.jsx src/index.css && git commit -m "feat: add AvatarPersonaje SVG with parametric face and level progression effects"
```

---

### Task 3: PersonajeEditor — modal de edición

**Files:**
- Create: `src/components/personaje/PersonajeEditor.jsx`

- [ ] **Step 1: Crear PersonajeEditor.jsx**

```jsx
import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import AvatarPersonaje from './AvatarPersonaje'
import { guardarPersonaje } from '../../hooks/usePersonaje'
import {
  PIEL_COLORES, PELO_COLORES, OJOS_COLORES,
  PELO_ESTILOS, VELLO_OPCIONES, PERSONALIDADES, PERSONAJE_DEFAULT
} from '../../personaje'

function SectionLabel({ children }) {
  return (
    <p className="font-pixel text-xs text-text-muted tracking-wider mb-2 mt-4">
      {children}
    </p>
  )
}

function ColorDots({ opciones, seleccionado, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((color, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="transition-transform active:scale-90"
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: color,
            border: seleccionado === i ? '2px solid #ede9e1' : '2px solid transparent',
            boxShadow: seleccionado === i ? `0 0 8px ${color}80` : 'none',
          }}
        />
      ))}
    </div>
  )
}

function PillOptions({ opciones, seleccionado, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((op, i) => {
        const label = typeof op === 'object' ? `${op.emoji} ${op.label}` : op
        const activo = seleccionado === i
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="px-3 py-1.5 font-body text-sm font-semibold transition-colors"
            style={{
              borderRadius: '100px',
              background: activo ? '#e94560' : '#2d2b47',
              border: `1px solid ${activo ? '#e94560' : '#4a4770'}`,
              color: activo ? '#fff' : '#9590a8',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function PersonajeEditor({ config, nivel = 0, onClose }) {
  const [draft, setDraft] = useState({ ...PERSONAJE_DEFAULT, ...config })
  const [guardando, setGuardando] = useState(false)

  const set = (campo, valor) => setDraft(prev => ({ ...prev, [campo]: valor }))

  const handleGuardar = async () => {
    setGuardando(true)
    await guardarPersonaje(draft)
    setGuardando(false)
    onClose()
  }

  const personalidadKeys = Object.keys(PERSONALIDADES)
  const personalidadIdx = personalidadKeys.indexOf(draft.personalidad)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div
        className="w-full max-w-[480px] mx-auto flex flex-col"
        style={{
          background: '#0e0e1a',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #302e4e',
          borderBottom: 'none',
          maxHeight: '92vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4"
             style={{ borderBottom: '1px solid #302e4e' }}>
          <h2 className="font-pixel text-base text-text-primary">MI PERSONAJE</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: '#2d2b47', color: '#9590a8' }}
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-4">
          {/* Preview del avatar */}
          <div className="flex justify-center py-6">
            <AvatarPersonaje config={draft} nivel={nivel} size={96} />
          </div>

          {/* Nombre */}
          <SectionLabel>NOMBRE</SectionLabel>
          <input
            value={draft.nombre}
            onChange={e => set('nombre', e.target.value.slice(0, 20))}
            placeholder="¿Cómo te llamas?"
            className="w-full px-3 py-2.5 font-body text-sm text-text-primary
                       placeholder-text-muted outline-none"
            style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
          />

          {/* Bio */}
          <SectionLabel>BIO</SectionLabel>
          <textarea
            value={draft.bio}
            onChange={e => set('bio', e.target.value.slice(0, 120))}
            placeholder="Cuéntame algo de ti... (120 chars)"
            rows={3}
            className="w-full px-3 py-2.5 font-body text-sm text-text-primary
                       placeholder-text-muted outline-none resize-none"
            style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
          />
          <p className="text-right font-body text-xs text-text-muted mt-1">
            {draft.bio.length}/120
          </p>

          {/* Personalidad */}
          <SectionLabel>PERSONALIDAD</SectionLabel>
          <PillOptions
            opciones={Object.values(PERSONALIDADES)}
            seleccionado={personalidadIdx >= 0 ? personalidadIdx : 3}
            onChange={i => set('personalidad', personalidadKeys[i])}
          />

          {/* Piel */}
          <SectionLabel>TONO DE PIEL</SectionLabel>
          <ColorDots opciones={PIEL_COLORES} seleccionado={draft.piel} onChange={v => set('piel', v)} />

          {/* Color pelo */}
          <SectionLabel>COLOR DE PELO</SectionLabel>
          <ColorDots opciones={PELO_COLORES} seleccionado={draft.peloCColor} onChange={v => set('peloCColor', v)} />

          {/* Estilo pelo */}
          <SectionLabel>ESTILO DE PELO</SectionLabel>
          <PillOptions opciones={PELO_ESTILOS} seleccionado={draft.peloEstilo} onChange={v => set('peloEstilo', v)} />

          {/* Ojos */}
          <SectionLabel>COLOR DE OJOS</SectionLabel>
          <ColorDots opciones={OJOS_COLORES} seleccionado={draft.ojos} onChange={v => set('ojos', v)} />

          {/* Vello */}
          <SectionLabel>VELLO FACIAL</SectionLabel>
          <PillOptions opciones={VELLO_OPCIONES} seleccionado={draft.vellos} onChange={v => set('vellos', v)} />

          {/* Botón guardar */}
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="w-full py-3.5 font-body font-semibold text-base text-white mt-6 mb-2
                       active:scale-[0.98] transition-transform disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #e94560, #c03040)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(233,69,96,0.35)',
            }}
          >
            {guardando ? 'Guardando...' : 'GUARDAR PERSONAJE'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/components/personaje/PersonajeEditor.jsx && git commit -m "feat: add PersonajeEditor modal with full avatar customization"
```

---

### Task 4: Integrar en HoyView

**Files:**
- Modify: `src/components/hoy/HoyView.jsx`

- [ ] **Step 1: Añadir imports**

```jsx
import { useRef } from 'react'
import AvatarPersonaje from '../personaje/AvatarPersonaje'
import PersonajeEditor from '../personaje/PersonajeEditor'
import { usePersonaje } from '../../hooks/usePersonaje'
```

`useRef` ya puede estar importado; añadirlo si no está.

- [ ] **Step 2: Añadir estado del editor y long-press**

Dentro de la función `HoyView`, añadir:

```jsx
  const personajeConfig = usePersonaje()
  const [showEditor, setShowEditor] = useState(false)
  const avatarPressTimer = useRef(null)

  const startAvatarPress = () => {
    avatarPressTimer.current = setTimeout(() => setShowEditor(true), 600)
  }
  const cancelAvatarPress = () => {
    if (avatarPressTimer.current) clearTimeout(avatarPressTimer.current)
  }
```

- [ ] **Step 3: Reemplazar PersonajeHeader con AvatarPersonaje**

Encuentra en el JSX:
```jsx
            <PersonajeHeader nivel={nivelG} />
```

Reemplaza con:
```jsx
            <div
              onMouseDown={startAvatarPress}
              onMouseUp={cancelAvatarPress}
              onMouseLeave={cancelAvatarPress}
              onTouchStart={startAvatarPress}
              onTouchEnd={cancelAvatarPress}
              onTouchMove={cancelAvatarPress}
              style={{ cursor: 'pointer', position: 'relative' }}
              title="Mantén pulsado para editar tu personaje"
            >
              <AvatarPersonaje config={personajeConfig} nivel={nivelG} size={44} />
            </div>
```

- [ ] **Step 4: Añadir modal al final del JSX**

Justo antes del `</div>` final de HoyView, añadir:

```jsx
      {/* Editor de personaje */}
      {showEditor && (
        <PersonajeEditor
          config={personajeConfig}
          nivel={nivelG}
          onClose={() => setShowEditor(false)}
        />
      )}
```

- [ ] **Step 5: Eliminar el import de PersonajeHeader**

Encuentra y elimina la línea:
```jsx
import PersonajeHeader from './PersonajeHeader'
```

- [ ] **Step 6: Verificar build**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && npm run build 2>&1 | tail -10
```

Expected: sin errores.

- [ ] **Step 7: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/components/hoy/HoyView.jsx && git commit -m "feat: integrate AvatarPersonaje and PersonajeEditor in HoyView"
```

---

### Task 5: Integración Chat IA

**Files:**
- Modify: `src/services/claude.js`

- [ ] **Step 1: Añadir import**

Al inicio de `src/services/claude.js`, añadir:

```js
import { PERSONALIDADES } from '../personaje'
```

- [ ] **Step 2: Inyectar personalidad en buildSystemPrompt**

Dentro de `buildSystemPrompt()`, justo después de la línea:
```js
  const [caminos, todasRutas, registros7, planHoy, planManana,
         recompensas, reflexiones7, notasCtx] = await Promise.all([
```

Ampliar el `Promise.all` para incluir el personaje:

```js
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
```

- [ ] **Step 3: Añadir bloque de personaje al system prompt**

En la función `buildSystemPrompt()`, antes del `return`, construir la info de personaje:

```js
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
```

En el string del `return`, añadir `${personajeInfo}` justo después de `Eres el guía...` y antes de `\n\nFILOSOFÍA`:

```js
  return `Eres el guía y asistente de desarrollo personal de ${p?.nombre || 'Olivier'} para el sistema "10 Caminos". Tienes acceso completo a la base de datos de la app y puedes modificar cualquier cosa.${personajeInfo}
FILOSOFÍA: Ikigai...`
```

Specifically, find the line:
```js
  return `Eres el guía y asistente de desarrollo personal de Olivier para el sistema "10 Caminos". Tienes acceso completo a la base de datos de la app y puedes modificar cualquier cosa.
```

Replace with:
```js
  return `Eres el guía y asistente de desarrollo personal de ${p?.nombre || 'Olivier'} para el sistema "10 Caminos". Tienes acceso completo a la base de datos de la app y puedes modificar cualquier cosa.${personajeInfo}
```

- [ ] **Step 4: Verificar build final**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && npm run build 2>&1 | tail -10
```

Expected: build limpio, sin errores.

- [ ] **Step 5: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/services/claude.js && git commit -m "feat: inject character name and personality into Claude IA system prompt"
```
