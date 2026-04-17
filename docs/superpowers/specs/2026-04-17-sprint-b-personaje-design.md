# Spec: Sprint B — Sistema de Personaje

**Fecha:** 2026-04-17
**Estado:** Aprobado

---

## Visión

Avatar circular (cara grande, estilo perfil) completamente configurable con SVG paramétrico. El personaje reemplaza el sprite actual en el header de HoyView y evoluciona visualmente con el nivel global. La personalidad y bio del personaje se inyectan en el system prompt del chat IA.

---

## 1. Datos del Personaje

### Almacenamiento
Clave `'personaje'` en tabla `configuracion`:

```js
{
  key: 'personaje',
  value: {
    nombre: string,          // "Oli", "El Caminante", etc.
    bio: string,             // max 120 chars
    personalidad: string,    // 'analitico' | 'creativo' | 'aventurero' | 'equilibrado' | 'guerrero'
    piel: number,            // 0-4 (pálido → oscuro)
    peloCColor: number,      // 0-7 (negro, castaño, rubio, rojo, gris, blanco, morado, azul)
    peloEstilo: number,      // 0-4 (corto, medio, largo, rizado, rapado)
    ojos: number,            // 0-4 (marrón, azul, verde, avellana, negro)
    vellos: number,          // 0-2 (ninguno, barba corta, barba)
  }
}
```

### Defaults (primer lanzamiento)
```js
{ nombre: 'Viajero', bio: '', personalidad: 'equilibrado',
  piel: 2, peloCColor: 1, peloEstilo: 1, ojos: 0, vellos: 0 }
```

---

## 2. Paletas de Color

```js
export const PIEL_COLORES = ['#FDDBB4','#E8B88A','#C68642','#A0522D','#5C3317']
export const PELO_COLORES  = ['#1A1A1A','#5C3317','#C8A850','#8B2500','#A0A0A0','#F0F0F0','#7B2D8B','#2D6A8B']
export const OJOS_COLORES  = ['#6B3A2A','#2D6A8B','#3A8B3A','#8B6C3A','#1A1A1A']
```

---

## 3. Avatar SVG — AvatarPersonaje.jsx

Componente `AvatarPersonaje({ config, nivel, size = 48 })`:

- `viewBox="0 0 40 40"`, círculo de clip (cx=20, cy=20, r=20)
- Capas de abajo a arriba:
  1. Fondo del círculo (bg-card color)
  2. Cuello + hombros (color piel)
  3. Cara (óvalo centrado, color piel)
  4. Ojos (2 círculos pequeños, color ojos + shine blanco)
  5. Cejas (2 líneas cortas, color pelo oscurecido)
  6. Boca (arco suave)
  7. Pelo (forma según peloEstilo, color peloCColor)
  8. Vello facial (si vellos > 0)
  9. **Efectos de nivel** (ver sección 4)
  10. Borde circular exterior (color según nivel)

---

## 4. Progresión Visual por Nivel

Estos efectos se acumulan (el nivel 10 incluye el efecto del nivel 5):

| Nivel | Efecto visible |
|---|---|
| 0–4 | Avatar base |
| 5–9 | Glow suave alrededor del círculo (box-shadow `0 0 12px accent`) |
| 10–14 | Reflejos dorados en el pelo (rect semitransparente `#f0c04030` sobre el pelo) |
| 15–19 | Iris con shimmer animado (CSS animation sobre los ojos) |
| 20+ | Aura dorada animada (`@keyframes auraRotate`, gradiente cónico girando) |

**Efectos secretos:** implementados internamente a ciertos hitos, no documentados aquí. El usuario los descubrirá.

---

## 5. Pantalla de Edición del Personaje

### Acceso
- Tap largo en el avatar (≥600ms) → abre `PersonajeEditor`
- También accesible con un pequeño botón ✏ que aparece al lado del avatar

### PersonajeEditor.jsx — Modal full-screen
Secciones:
1. **Preview** — avatar grande centrado, se actualiza en tiempo real
2. **Nombre y bio** — input nombre (max 20) + textarea bio (max 120)
3. **Personalidad** — 5 botones pill seleccionables
4. **Apariencia** — secciones: Piel / Pelo (estilo + color) / Ojos / Vello facial
   - Selector de opción: fila de círculos/cuadrados clicables con preview de color
5. **Guardar** — botón accent, guarda en DB, cierra modal

### Personalidades y descripción para el IA
```js
export const PERSONALIDADES = {
  analitico:   { label: 'Analítico',   desc: 'Piensa antes de actuar. Valora la lógica y los datos.' },
  creativo:    { label: 'Creativo',    desc: 'Busca soluciones originales. Piensa fuera de la caja.' },
  aventurero:  { label: 'Aventurero',  desc: 'Le gustan los retos. Actúa rápido y aprende en el camino.' },
  equilibrado: { label: 'Equilibrado', desc: 'Busca armonía. Valora la constancia sobre los extremos.' },
  guerrero:    { label: 'Guerrero',    desc: 'Determinado. No se rinde. La disciplina es su arma.' },
}
```

---

## 6. Integración con Chat IA

En `src/services/claude.js`, donde se construye el system prompt, añadir al inicio:

```js
const personaje = await db.configuracion.get('personaje')
if (personaje?.value) {
  const p = personaje.value
  const pers = PERSONALIDADES[p.personalidad]
  systemPrompt += `\nEl usuario se llama ${p.nombre}. ${pers?.desc || ''}`
  if (p.bio) systemPrompt += ` Sobre él: ${p.bio}`
}
```

---

## 7. Integración en HoyView

- Reemplazar `<PersonajeHeader nivel={nivelG} />` por `<AvatarPersonaje config={personajeConfig} nivel={nivelG} size={44} />`
- `personajeConfig` viene de un hook `usePersonaje()` (LiveQuery sobre `configuracion`)
- El tap largo en el avatar en el header abre `PersonajeEditor`

---

## Componentes nuevos

| Archivo | Descripción |
|---|---|
| `src/components/personaje/AvatarPersonaje.jsx` | SVG paramétrico del avatar |
| `src/components/personaje/PersonajeEditor.jsx` | Modal de edición completo |
| `src/hooks/usePersonaje.js` | LiveQuery + helpers |
| `src/personaje.js` | Constantes: paletas de color, PERSONALIDADES, defaults |

---

## Spec Self-Review
- ✅ Schema completo y compatible con Dexie `configuracion`
- ✅ Paletas de color definidas con valores exactos
- ✅ Efectos de nivel todos especificados (visibles) + secretos implementados internamente
- ✅ Integración Chat IA concreta (código exacto del system prompt)
- ✅ Sin TBDs ni secciones incompletas
