/**
 * Mamá sprite — front view, resting in hammock.
 * Light skin, castaño claro hair, red outfit.
 * viewBox 12×14, rendered ~48×56px.
 */
export default function MamaSprite({ width = 48, height = 56 }) {
  return (
    <svg
      viewBox="0 0 12 14"
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Hair top */}
      <rect x="2" y="0" width="8" height="2" fill="#C4A265" />
      <rect x="1" y="1" width="10" height="2" fill="#C4A265" />

      {/* Head/face */}
      <rect x="1" y="2" width="10" height="7" fill="#FDDCB5" />
      <rect x="0" y="3" width="1"  height="5" fill="#FDDCB5" />
      <rect x="11" y="3" width="1" height="5" fill="#FDDCB5" />

      {/* Hair sides (flows down) */}
      <rect x="0" y="2" width="2"  height="8" fill="#C4A265" />
      <rect x="10" y="2" width="2" height="8" fill="#C4A265" />

      {/* Eyes */}
      <rect x="3" y="4" width="2" height="2" fill="#1A1A1A" />
      <rect x="7" y="4" width="2" height="2" fill="#1A1A1A" />
      {/* Eye shine */}
      <rect x="4" y="4" width="1" height="1" fill="#FFFFFF" />
      <rect x="8" y="4" width="1" height="1" fill="#FFFFFF" />

      {/* Smile */}
      <rect x="4" y="7" width="4" height="1" fill="#CC8888" />
      <rect x="3" y="6" width="1" height="1" fill="#CC8888" />
      <rect x="8" y="6" width="1" height="1" fill="#CC8888" />

      {/* Outfit (red top peek) */}
      <rect x="2" y="9"  width="8" height="3" fill="#CC3333" />
      <rect x="1" y="10" width="10" height="2" fill="#CC3333" />
      <rect x="3" y="12" width="6" height="2" fill="#AA2222" />
    </svg>
  )
}
