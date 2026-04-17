# Spec: Sprint A — HoyView Improvements

**Fecha:** 2026-04-17
**Estado:** Aprobado

---

## 1. Font +15%

**Implementación:** `html { font-size: 115%; }` en `src/index.css`.

Todo lo que use `rem`/`em` escala automáticamente. Los tamaños hardcodeados en `px` dentro de `style={{}}` se actualizan manualmente a ×1.15 (redondear al entero más cercano).

---

## 2. Caminos Colapsables

### Comportamiento
- El bloque de caminos tiene un header de sección clicable: icono chevron + label "CAMINOS (N)"
- **Expandido** (default): CaminoCards completos como ahora
- **Colapsado**: fila compacta por camino — círculo de color según marca + icono + nombre truncado
- Estado persistido en `configuracion` con key `'caminosExpandidos'` (boolean, default `true`)

### Componente CaminoCompacto (nuevo)
```
[ ● ] 👨‍👧‍👦  Presente con mis hijos        [✓]
[ ● ] 💛  Feliz con Lou                  [→]
```
- Círculo de color: verde/ámbar/gris según marca del día, gris neutro si sin marcar
- Marca del día alineada a la derecha
- Tap en la fila compacta → expande la lista completa (no abre el camino individual)

### Persistencia
```js
// Guardar
db.configuracion.put({ key: 'caminosExpandidos', value: true|false })
// Leer al montar HoyView
const pref = await db.configuracion.get('caminosExpandidos')
```

---

## 3. Botón "Sin faltas de Hoy"

### Posición
Entre el header (XP bar) y las NavCards. Centrado, ancho completo con padding horizontal.

### Visuales del botón
- Fondo: `#181726` con borde `border-bright`
- Texto: "SIN FALTAS DE HOY" en `font-pixel text-sm`
- Icono izquierda: ⚔️ (o escudo Phosphor)
- Estado "completo" (todos marcados): fondo verde con check, texto "✓ MISIÓN CUMPLIDA"
- Efecto idle: `animation: glowPulse` con `accent` color (ya definido en index.css)
- Efecto completo: `animation: glowPulse` con `green-xp` color

### Popup de actividades

**Trigger:** tap en el botón
**Overlay:** `fixed inset-0 bg-black/70 z-50`
**Container:** bottom sheet (`position: fixed, bottom: 0`), 90% altura máx, scroll interno

**Tarjeta por camino activo:**
```
┌─────────────────────────────────────┐  ← borde color tiempo
│  👨‍👧‍👦  Presente con mis hijos        │
│  ▸ Llamar a Gael esta tarde         │  ← paso activo de la ruta
│  [Sin marcar] / [✓ Logrado]         │  ← estado actual
└─────────────────────────────────────┘
```

**Colores de borde por tiempo hasta medianoche:**
```js
function colorBordeTiempo() {
  const ahora = new Date()
  const medianoche = new Date()
  medianoche.setHours(23, 59, 59, 999)
  const horasRestantes = (medianoche - ahora) / 3_600_000
  if (horasRestantes > 6)  return '#4ade80'  // verde
  if (horasRestantes > 2)  return '#f97316'  // naranja
  return '#f43f5e'                            // rojo
}
```

**Interacción:** tap en tarjeta → cierra popup, hace scroll al camino correspondiente (o simplemente cierra). No se puede marcar desde aquí (demasiada complejidad, el objetivo es visibilidad).

**Header del popup:**
- Título: "HOY · DD de Mes"
- Score en tiempo real: "N / M caminos completados"
- Botón cerrar ✕

---

## Componentes nuevos / modificados

| Componente | Acción |
|---|---|
| `src/index.css` | `html { font-size: 115%; }` |
| `src/components/hoy/HoyView.jsx` | Integrar SinFaltasButton + CaminosSection colapsable |
| `src/components/hoy/SinFaltasButton.jsx` | **Nuevo** — botón + popup de actividades |
| `src/components/hoy/CaminoCompacto.jsx` | **Nuevo** — fila compacta para estado colapsado |

---

## Spec Self-Review
- ✅ Sin TBDs
- ✅ `colorBordeTiempo()` definida con lógica exacta
- ✅ Persistencia de estado colapsado especificada
- ✅ Interacción del popup clara (solo lectura, no marca desde ahí)
- ✅ Alcance acotado — no toca lógica de negocio
