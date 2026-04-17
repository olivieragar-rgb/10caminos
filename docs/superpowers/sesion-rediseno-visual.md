# RESUMEN DE SESIÓN — Rediseño Visual 10-Caminos
> Guardado para recuperar contexto tras compactación

## Estado del proyecto
- App PWA React+Dexie, dark theme RPG, estética pixel art
- Stack: Tailwind CSS, fuente Cinzel (pixel), Inter (body)
- Colores actuales: fondo `#1a1520` (morado muy oscuro), tarjetas `#2a2035`
- Nav inferior fija con 5 tabs (HOY, SEMANA, RUTAS, STATS, CHAT)
- Sistema Codex de la Psique ya implementado (8 entidades secretas)

## Lo que el usuario quiere
1. **Menos negro/apagado** — dark pero con fondos más claros y ricos, contraste vibrante (Opción A — dark premium, no modo claro)
2. **Menos pixelado** — tipografía y elementos más refinados/profesionales
3. **Nav principal reemplazada** por botones grandes en pantalla inicial — los botones grandes REEMPLAZAN el nav inferior, pero necesita algún tipo de menú de navegación alternativo (el actual no gusta)
4. **Iconos mejores** — nada de los emojis típicos de IA, quiere iconos más estilosos
5. **Referencia visual:** app Streaks (Google Play) — limpio, dark moderno

## Restricciones (CLAUDE.md)
- Solo dark theme, sin modo claro
- Sin moment.js, sin localStorage, sin multi-idioma
- Español hardcodeado

## Opciones de iconos a evaluar
Librerías disponibles con estilo premium:
- **Lucide React** — minimalista, outline limpio, muy usado en apps modernas
- **Phosphor Icons** — múltiples pesos (thin/light/regular/bold/fill/duotone), muy versátiles
- **Heroicons** — de Tailwind team, outline + solid, muy limpio
- **Tabler Icons** — 4000+ íconos, stroke uniforme, estilo profesional

## Próximos pasos del brainstorming
1. ✅ Explorar contexto visual
2. ✅ Visual companion — descartado (minimizar tokens)
3. 🔄 Preguntas de clarificación (en curso)
   - ✅ Tonos más claros → dark premium con fondos más ricos
   - ✅ Nav → botones grandes reemplazan tabs, pero necesita nav alternativa
   - ⬜ Iconos → elegir librería
   - ⬜ Scope del rediseño → ¿todas las pantallas o empezar por HOY?
4. ⬜ Proponer 2-3 enfoques
5. ⬜ Presentar diseño por secciones con aprobación
6. ⬜ Escribir spec + invocar writing-plans

## Para continuar tras compactación
Leer este archivo y continuar con:
- Pregunta sobre iconos (qué librería prefiere o si quiero sugerirle)
- Pregunta sobre scope (¿todas las pantallas a la vez o empezar por la principal?)
- Luego proponer 2-3 enfoques del rediseño completo
