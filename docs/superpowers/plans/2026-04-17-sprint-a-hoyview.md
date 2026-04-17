# Sprint A — HoyView Improvements: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aumentar fuentes 15%, añadir botón "Sin faltas de Hoy" con popup de actividades y colores por tiempo, y hacer la lista de caminos colapsable.

**Architecture:** Tres cambios independientes en HoyView. El botón "Sin faltas" es un componente nuevo autocontenido. La lista colapsable usa un componente CaminoCompacto nuevo para la vista comprimida. La preferencia de colapso se persiste en IndexedDB.

**Tech Stack:** React 18, Dexie.js, Tailwind CSS, @phosphor-icons/react

---

## File Map

| Archivo | Acción |
|---|---|
| `src/index.css` | Añadir `html { font-size: 115%; }` |
| `src/components/hoy/SinFaltasButton.jsx` | **Nuevo** — botón CTA + popup |
| `src/components/hoy/CaminoCompacto.jsx` | **Nuevo** — fila compacta colapsada |
| `src/components/hoy/HoyView.jsx` | Integrar SinFaltasButton + toggle colapso |

---

### Task 1: Font +15%

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Añadir font-size al html**

En `src/index.css`, dentro del bloque `@layer base`, añadir al inicio (antes del selector `*`):

```css
  html {
    font-size: 115%;
  }
```

El bloque `@layer base` queda así al inicio:

```css
@layer base {
  html {
    font-size: 115%;
  }
  * {
    box-sizing: border-box;
  }
  /* ... resto igual ... */
}
```

Esto escala automáticamente todas las clases Tailwind basadas en rem (text-xs, text-sm, text-base, etc.).

- [ ] **Step 2: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/index.css && git commit -m "feat: increase base font size 15% via html font-size: 115%"
```

---

### Task 2: SinFaltasButton — botón CTA con popup de actividades

**Files:**
- Create: `src/components/hoy/SinFaltasButton.jsx`

- [ ] **Step 1: Crear SinFaltasButton.jsx**

```jsx
import { useState } from 'react'
import { Shield, X } from '@phosphor-icons/react'
import { hoyISO, formatearFechaLarga } from '../../utils/dates'

function colorBordeTiempo() {
  const ahora = new Date()
  const medianoche = new Date()
  medianoche.setHours(23, 59, 59, 999)
  const horas = (medianoche - ahora) / 3_600_000
  if (horas > 6) return '#4ade80'
  if (horas > 2) return '#f97316'
  return '#f43f5e'
}

function TarjetaActividad({ camino, registroHoy, rutaActiva }) {
  const borde = colorBordeTiempo()
  const marcaHoy = registroHoy?.marca
  const paso = rutaActiva?.pasos?.[rutaActiva.pasoActual ?? 0]

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        background: '#181726',
        border: `2px solid ${borde}`,
        boxShadow: `0 0 8px ${borde}25`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{camino.icono}</span>
        <span className="font-body font-semibold text-base text-text-primary flex-1 truncate">
          {camino.nombre}
        </span>
        {marcaHoy && (
          <span
            className="font-body font-bold text-sm px-2 py-0.5 rounded-full"
            style={{
              background: marcaHoy === 'avance' ? '#4ade8020' : marcaHoy === 'pausa' ? '#fbbf2420' : '#6b728020',
              color: marcaHoy === 'avance' ? '#4ade80' : marcaHoy === 'pausa' ? '#fbbf24' : '#6b7280',
            }}
          >
            {marcaHoy === 'avance' ? '✓ Hecho' : marcaHoy === 'pausa' ? '→ Pausa' : '○ No hoy'}
          </span>
        )}
      </div>
      {paso ? (
        <p className="font-body text-sm text-text-secondary leading-snug">
          ▸ {paso.texto}
        </p>
      ) : (
        <p className="font-body text-sm text-text-muted italic">Sin misión asignada</p>
      )}
    </div>
  )
}

export default function SinFaltasButton({ caminos, registrosHoy, rutasActivas }) {
  const [abierto, setAbierto] = useState(false)
  const hoy = hoyISO()

  const caminosActivos = (caminos || []).filter(c => c.activo)
  const completados = caminosActivos.filter(c =>
    registrosHoy.some(r => r.caminoId === c.id && r.marca === 'avance')
  ).length
  const total = caminosActivos.length
  const todosHechos = total > 0 && completados === total

  return (
    <>
      {/* Botón principal */}
      <div className="px-4 py-3">
        <button
          onClick={() => setAbierto(true)}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl
                     active:scale-[0.98] transition-all duration-150 select-none"
          style={{
            background: todosHechos
              ? 'linear-gradient(135deg, #4ade8015, #181726)'
              : 'linear-gradient(135deg, #e9456015, #181726)',
            border: `2px solid ${todosHechos ? '#4ade80' : '#e94560'}`,
            boxShadow: `0 0 20px ${todosHechos ? '#4ade8030' : '#e9456030'}`,
            animation: todosHechos ? 'glowPulseGreen 2s ease-in-out infinite' : 'glowPulse 2s ease-in-out infinite',
          }}
        >
          <Shield size={22} weight="duotone"
            color={todosHechos ? '#4ade80' : '#e94560'} />
          <span className="font-pixel text-sm"
                style={{ color: todosHechos ? '#4ade80' : '#e94560' }}>
            {todosHechos ? '✓ MISIÓN CUMPLIDA' : 'SIN FALTAS DE HOY'}
          </span>
          <span className="font-body text-sm font-semibold"
                style={{ color: '#5c5875' }}>
            {completados}/{total}
          </span>
        </button>
      </div>

      {/* Popup */}
      {abierto && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => e.target === e.currentTarget && setAbierto(false)}
        >
          <div
            className="w-full max-w-[480px] mx-auto flex flex-col"
            style={{
              background: '#0e0e1a',
              borderRadius: '20px 20px 0 0',
              border: '1px solid #302e4e',
              borderBottom: 'none',
              maxHeight: '88vh',
            }}
          >
            {/* Header popup */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3"
                 style={{ borderBottom: '1px solid #302e4e' }}>
              <div>
                <h2 className="font-pixel text-base text-text-primary">HOY</h2>
                <p className="font-body text-sm text-text-muted capitalize">
                  {formatearFechaLarga(hoy)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-sm font-semibold"
                      style={{ color: todosHechos ? '#4ade80' : '#9590a8' }}>
                  {completados}/{total} completados
                </span>
                <button
                  onClick={() => setAbierto(false)}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, background: '#2d2b47', color: '#9590a8' }}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>

            {/* Tarjetas */}
            <div className="overflow-y-auto flex-1 px-5 pt-4 pb-8">
              {caminosActivos.length === 0 ? (
                <p className="font-body text-sm text-text-muted text-center py-8">
                  No hay caminos activos
                </p>
              ) : (
                caminosActivos.map(camino => (
                  <TarjetaActividad
                    key={camino.id}
                    camino={camino}
                    registroHoy={registrosHoy.find(r => r.caminoId === camino.id) || null}
                    rutaActiva={(rutasActivas || []).find(r => r.caminoId === camino.id) || null}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Añadir animación glowPulseGreen en index.css**

En `src/index.css`, en la sección `/* ── Nuevas animaciones ── */` (cerca del final), añadir:

```css
@keyframes glowPulseGreen {
  0%, 100% { box-shadow: 0 0 20px #4ade8030; }
  50%       { box-shadow: 0 0 32px #4ade8060; }
}
.animate-glow-green { animation: glowPulseGreen 2s ease-in-out infinite; }
```

- [ ] **Step 3: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/components/hoy/SinFaltasButton.jsx src/index.css && git commit -m "feat: add SinFaltasButton with timed activity popup"
```

---

### Task 3: CaminoCompacto — vista colapsada

**Files:**
- Create: `src/components/hoy/CaminoCompacto.jsx`

- [ ] **Step 1: Crear CaminoCompacto.jsx**

```jsx
export default function CaminoCompacto({ camino, registroHoy }) {
  const marca = registroHoy?.marca
  const dotColor = marca === 'avance' ? '#4ade80'
    : marca === 'pausa' ? '#fbbf24'
    : marca === 'nada' ? '#6b7280'
    : '#302e4e'
  const marcaSym = marca === 'avance' ? '✓' : marca === 'pausa' ? '→' : marca === 'nada' ? '○' : null

  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: '1px solid #1e1c30' }}
    >
      <div style={{
        width: 9, height: 9, borderRadius: '50%',
        background: dotColor, flexShrink: 0,
        boxShadow: marca ? `0 0 6px ${dotColor}60` : 'none',
      }} />
      <span className="text-base leading-none flex-shrink-0">{camino.icono}</span>
      <span className="font-body text-sm text-text-primary flex-1 truncate">
        {camino.nombre}
      </span>
      {marcaSym && (
        <span className="font-body text-sm font-bold" style={{ color: dotColor }}>
          {marcaSym}
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/components/hoy/CaminoCompacto.jsx && git commit -m "feat: add CaminoCompacto for collapsed caminos view"
```

---

### Task 4: Integrar en HoyView

**Files:**
- Modify: `src/components/hoy/HoyView.jsx`

- [ ] **Step 1: Leer HoyView.jsx**

Leer `D:\PROYECTO_CAMINOS\10-caminos\src\components\hoy\HoyView.jsx` para confirmar la estructura actual.

- [ ] **Step 2: Añadir imports**

Al inicio de HoyView.jsx, añadir junto a los otros imports:

```jsx
import SinFaltasButton from './SinFaltasButton'
import CaminoCompacto from './CaminoCompacto'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
```

- [ ] **Step 3: Añadir estado colapsado y carga desde DB**

Dentro de la función `HoyView`, junto a los otros `useState`, añadir:

```jsx
  const [caminosExpandidos, setCaminosExpandidos] = useState(true)

  // Cargar preferencia de colapso
  useEffect(() => {
    db.configuracion.get('caminosExpandidos').then(rec => {
      if (rec?.value === false) setCaminosExpandidos(false)
    })
  }, [])

  const toggleCaminos = () => {
    const next = !caminosExpandidos
    setCaminosExpandidos(next)
    db.configuracion.put({ key: 'caminosExpandidos', value: next })
  }
```

Asegúrate de que `useEffect` está importado desde React (ya debería estarlo).

- [ ] **Step 4: Añadir SinFaltasButton después del header**

En el JSX, justo después del cierre del header div (`</div>` que cierra `className="px-4 pt-4 pb-3 bg-bg-deep"`) y antes de `{onTabChange && <NavCards ...>}`:

```jsx
      {/* Sin Faltas de Hoy */}
      <SinFaltasButton
        caminos={todosCaminos}
        registrosHoy={registrosHoy}
        rutasActivas={rutasActivas}
      />
```

- [ ] **Step 5: Reemplazar el bloque de caminos con toggle**

Encuentra el bloque actual:
```jsx
      {/* Camino cards */}
      <div className="flex-1 pt-1">
        {caminos.map(camino => (
          <CaminoCard
            key={camino.id}
            camino={camino}
            registroHoy={getRegistroHoy(camino.id)}
            rutaActiva={getRutaActiva(camino.id)}
            onAbrirManager={() => setShowManager(true)}
          />
        ))}
      </div>
```

Reemplázalo con:
```jsx
      {/* Caminos — colapsable */}
      <div className="flex-1">
        {/* Header toggle */}
        <button
          onClick={toggleCaminos}
          className="w-full flex items-center justify-between px-4 py-3 select-none"
          style={{ borderTop: '1px solid #302e4e', borderBottom: '1px solid #302e4e' }}
        >
          <span className="font-pixel text-xs text-text-muted tracking-wider">
            CAMINOS ({caminos.length})
          </span>
          {caminosExpandidos
            ? <CaretUp size={14} color="#5c5875" />
            : <CaretDown size={14} color="#5c5875" />
          }
        </button>

        {/* Vista expandida */}
        {caminosExpandidos && caminos.map(camino => (
          <CaminoCard
            key={camino.id}
            camino={camino}
            registroHoy={getRegistroHoy(camino.id)}
            rutaActiva={getRutaActiva(camino.id)}
            onAbrirManager={() => setShowManager(true)}
          />
        ))}

        {/* Vista colapsada */}
        {!caminosExpandidos && (
          <div style={{ background: '#181726' }}>
            {caminos.map(camino => (
              <CaminoCompacto
                key={camino.id}
                camino={camino}
                registroHoy={getRegistroHoy(camino.id)}
              />
            ))}
          </div>
        )}
      </div>
```

- [ ] **Step 6: Verificar que no hay errores de compilación**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && npm run build 2>&1 | tail -10
```

Expected: Build exitoso, sin errores.

- [ ] **Step 7: Commit**

```bash
cd "D:\PROYECTO_CAMINOS\10-caminos" && git add src/components/hoy/HoyView.jsx && git commit -m "feat: integrate SinFaltasButton and collapsible caminos in HoyView"
```
