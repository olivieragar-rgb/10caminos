/**
 * Mini sprite del personaje (Olivier) en el header.
 * Cambia visualmente según el nivel global:
 *   0-9:  normal
 *   10-19: sombrero
 *   20+:   capa roja + sombrero
 */
export default function PersonajeHeader({ nivel = 0 }) {
  const hasSombrero = nivel >= 10
  const hasCapa     = nivel >= 20

  // Offset vertical del cuerpo si lleva sombrero
  const bodyOffset = hasSombrero ? 3 : 0

  return (
    <svg
      viewBox="0 0 12 22"
      width={24}
      height={44}
      style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}
    >
      {/* ── Capa (nivel 20+) ── */}
      {hasCapa && (
        <>
          <rect x="1" y={9 + bodyOffset}  width="10" height="9" fill="#AA1111"/>
          <rect x="0" y={10 + bodyOffset} width="2"  height="7" fill="#CC2222"/>
          <rect x="10" y={10 + bodyOffset} width="2" height="7" fill="#CC2222"/>
          <rect x="2" y={17 + bodyOffset} width="3"  height="3" fill="#AA1111"/>
          <rect x="7" y={17 + bodyOffset} width="3"  height="3" fill="#AA1111"/>
        </>
      )}

      {/* ── Sombrero (nivel 10+) ── */}
      {hasSombrero && (
        <>
          <rect x="1" y="0" width="10" height="1" fill="#1A1A1A"/>
          <rect x="3" y="1" width="6"  height="3" fill="#1A1A1A"/>
          <rect x="4" y="1" width="4"  height="2" fill="#2a2a2a"/>
        </>
      )}

      {/* ── Pelo ── */}
      <rect x="3" y={0 + bodyOffset} width="6" height="2" fill="#2C1810"/>
      <rect x="2" y={1 + bodyOffset} width="8" height="2" fill="#2C1810"/>

      {/* ── Cabeza ── */}
      <rect x="2" y={2 + bodyOffset}  width="8" height="6" fill="#8B6544"/>
      <rect x="1" y={3 + bodyOffset}  width="10" height="4" fill="#8B6544"/>

      {/* ── Ojos ── */}
      <rect x="3" y={4 + bodyOffset}  width="2" height="1" fill="#1A1A1A"/>
      <rect x="7" y={4 + bodyOffset}  width="2" height="1" fill="#1A1A1A"/>
      {/* shine */}
      <rect x="4" y={4 + bodyOffset}  width="1" height="1" fill="#FFFFFF"/>
      <rect x="8" y={4 + bodyOffset}  width="1" height="1" fill="#FFFFFF"/>

      {/* ── Sonrisa ── */}
      <rect x="4" y={6 + bodyOffset}  width="4" height="1" fill="#6B3A2A"/>
      <rect x="3" y={5 + bodyOffset}  width="1" height="1" fill="#6B3A2A"/>
      <rect x="8" y={5 + bodyOffset}  width="1" height="1" fill="#6B3A2A"/>

      {/* ── Cuerpo / camisa ── */}
      {!hasCapa && (
        <>
          <rect x="2" y={9 + bodyOffset}  width="8"  height="5" fill="#3355AA"/>
          <rect x="1" y={10 + bodyOffset} width="10" height="3" fill="#3355AA"/>
          {/* Brazos */}
          <rect x="0" y={9 + bodyOffset}  width="1"  height="5" fill="#8B6544"/>
          <rect x="11" y={9 + bodyOffset} width="1"  height="5" fill="#8B6544"/>
        </>
      )}
      {hasCapa && (
        <>
          {/* Camisa visible bajo la capa */}
          <rect x="3" y={9 + bodyOffset}  width="6" height="2" fill="#3355AA"/>
        </>
      )}

      {/* ── Pantalones ── */}
      <rect x="2" y={14 + bodyOffset} width="3" height="5" fill="#223366"/>
      <rect x="7" y={14 + bodyOffset} width="3" height="5" fill="#223366"/>
      <rect x="5" y={14 + bodyOffset} width="2" height="3" fill="#1A1520"/>

      {/* ── Zapatos ── */}
      <rect x="1" y={18 + bodyOffset} width="4" height="2" fill="#1A1A1A"/>
      <rect x="7" y={18 + bodyOffset} width="4" height="2" fill="#1A1A1A"/>
    </svg>
  )
}
