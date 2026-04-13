import { useState, useEffect } from 'react'

/**
 * Niña ~3 años corriendo. 2-frame loop. Ligeramente más pequeña.
 * Light skin, purple dress, light hair.
 */
function Frame({ bounce, width, height }) {
  const dy = bounce ? 0 : 1 // slight vertical bounce
  return (
    <svg
      viewBox="0 0 10 18"
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block', position: 'absolute', top: 0, left: 0 }}
    >
      {/* Hair (pigtails) */}
      <rect x="1" y="0" width="8" height="2" fill="#C4A265" />
      <rect x="0" y="1" width="10" height="2" fill="#C4A265" />
      {/* Pigtails */}
      <rect x="0" y="3" width="1" height="3" fill="#C4A265" />
      <rect x="9" y="3" width="1" height="3" fill="#C4A265" />

      {/* Head */}
      <rect x="1" y="2"  width="8" height="6" fill="#FDDCB5" />
      <rect x="0" y="3"  width="1" height="4" fill="#FDDCB5" />
      <rect x="9" y="3"  width="1" height="4" fill="#FDDCB5" />

      {/* Eyes */}
      <rect x="2" y="4"  width="2" height="1" fill="#1A1A1A" />
      <rect x="6" y="4"  width="2" height="1" fill="#1A1A1A" />
      {/* Eye shine */}
      <rect x="3" y="4"  width="1" height="1" fill="#FFFFFF" />
      <rect x="7" y="4"  width="1" height="1" fill="#FFFFFF" />

      {/* Smile */}
      <rect x="3" y="6"  width="4" height="1" fill="#CC8888" />

      {/* Dress body */}
      <rect x="1" y="8"  width="8" height="5" fill="#AA44AA" />
      <rect x="0" y="9"  width="10" height="3" fill="#AA44AA" />

      {/* Dress skirt (wider) */}
      <rect x="0" y={12 + dy} width="10" height="3" fill="#993399" />

      {/* Little arms */}
      <rect x="0" y={bounce ? 9 : 10} width="1" height="3" fill="#FDDCB5" />
      <rect x="9" y={bounce ? 10 : 9} width="1" height="3" fill="#FDDCB5" />

      {/* Legs */}
      <rect x="2" y={15 + dy} width="2" height="3" fill="#FDDCB5" />
      <rect x="6" y={15 + dy} width="2" height="3" fill="#FDDCB5" />

      {/* Shoes */}
      <rect x={bounce ? 1 : 2} y={17 + dy} width="3" height="1" fill="#1A1A1A" />
      <rect x={bounce ? 6 : 5} y={17 + dy} width="3" height="1" fill="#1A1A1A" />
    </svg>
  )
}

export default function NinaSprite({ width = 36, height = 64 }) {
  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setBounce(b => !b), 250)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ opacity: bounce ? 1 : 0, transition: 'none' }}>
        <Frame bounce={true} width={width} height={height} />
      </div>
      <div style={{ opacity: bounce ? 0 : 1, transition: 'none', position: 'absolute', top: 0, left: 0 }}>
        <Frame bounce={false} width={width} height={height} />
      </div>
    </div>
  )
}
