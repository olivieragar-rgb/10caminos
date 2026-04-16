import { useState, useEffect } from 'react'

/**
 * Segundo niño ~3 años jugando. Varón. Camiseta roja, pelo oscuro, piel morena.
 */
function Frame({ legLeft, width, height }) {
  return (
    <svg
      viewBox="0 0 9 16"
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block', position: 'absolute', top: 0, left: 0 }}
    >
      {/* Hair */}
      <rect x="1" y="0" width="7" height="2" fill="#2C1810" />
      <rect x="2" y="1" width="5" height="2" fill="#3a2010" />

      {/* Head */}
      <rect x="1" y="2"  width="7" height="5" fill="#8B6544" />
      <rect x="0" y="3"  width="1" height="3" fill="#8B6544" />
      <rect x="8" y="3"  width="1" height="3" fill="#8B6544" />

      {/* Eyes */}
      <rect x="2" y="4"  width="1" height="1" fill="#1A1A1A" />
      <rect x="6" y="4"  width="1" height="1" fill="#1A1A1A" />

      {/* Mouth */}
      <rect x="3" y="6"  width="3" height="1" fill="#6B3A2A" />

      {/* Shirt red */}
      <rect x="1" y="7"  width="7" height="3" fill="#CC3333" />
      <rect x="0" y="8"  width="9" height="2" fill="#CC3333" />

      {/* Arms */}
      <rect x="0" y={legLeft ? 7 : 8}  width="1" height="3" fill="#8B6544" />
      <rect x="8" y={legLeft ? 8 : 7}  width="1" height="3" fill="#8B6544" />

      {/* Legs */}
      <rect x="2" y="10" width="2" height={legLeft ? 4 : 3} fill="#1A3A6A" />
      <rect x="5" y="10" width="2" height={legLeft ? 3 : 4} fill="#1A3A6A" />

      {/* Feet */}
      <rect x={legLeft ? 1 : 2} y={legLeft ? 13 : 12} width="3" height="2" fill="#1A1A1A" />
      <rect x={legLeft ? 5 : 4} y={legLeft ? 12 : 13} width="3" height="2" fill="#1A1A1A" />
    </svg>
  )
}

export default function NinaSprite({ width = 28, height = 48 }) {
  const [frameA, setFrameA] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setFrameA(f => !f), 220)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ opacity: frameA ? 1 : 0, transition: 'none' }}>
        <Frame legLeft={false} width={width} height={height} />
      </div>
      <div style={{ opacity: frameA ? 0 : 1, transition: 'none', position: 'absolute', top: 0, left: 0 }}>
        <Frame legLeft={true} width={width} height={height} />
      </div>
    </div>
  )
}
