import { useState, useEffect } from 'react'

/**
 * Niño ~5 años corriendo. 2-frame loop.
 * Medium-dark skin, green shirt, dark pants.
 */
function Frame({ legLeft, width, height }) {
  // legLeft: true = left leg forward, false = right leg forward
  return (
    <svg
      viewBox="0 0 10 18"
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block', position: 'absolute', top: 0, left: 0 }}
    >
      {/* Hair */}
      <rect x="2" y="0" width="6" height="2" fill="#2C1810" />
      <rect x="1" y="1" width="8" height="2" fill="#2C1810" />

      {/* Head */}
      <rect x="1" y="2"  width="8" height="6" fill="#A07855" />
      <rect x="0" y="3"  width="1" height="4" fill="#A07855" />
      <rect x="9" y="3"  width="1" height="4" fill="#A07855" />

      {/* Eyes */}
      <rect x="2" y="4"  width="2" height="1" fill="#1A1A1A" />
      <rect x="6" y="4"  width="2" height="1" fill="#1A1A1A" />

      {/* Smile */}
      <rect x="3" y="6"  width="4" height="1" fill="#6B3A2A" />

      {/* Shirt */}
      <rect x="1" y="8"  width="8" height="4" fill="#33AA44" />
      <rect x="0" y="9"  width="10" height="2" fill="#33AA44" />

      {/* Arms (bouncing) */}
      <rect x="0" y={legLeft ? 8 : 9}  width="1" height="4" fill="#A07855" />
      <rect x="9" y={legLeft ? 9 : 8}  width="1" height="4" fill="#A07855" />

      {/* Legs */}
      <rect x="2" y="12" width="2" height={legLeft ? 5 : 4} fill="#1A4422" />
      <rect x="6" y="12" width="2" height={legLeft ? 4 : 5} fill="#1A4422" />

      {/* Feet */}
      <rect x={legLeft ? 1 : 2}  y={legLeft ? 16 : 15} width="3" height="2" fill="#1A1A1A" />
      <rect x={legLeft ? 6 : 5}  y={legLeft ? 15 : 16} width="3" height="2" fill="#1A1A1A" />
    </svg>
  )
}

export default function NinoSprite({ width = 40, height = 72 }) {
  const [frameA, setFrameA] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setFrameA(f => !f), 200)
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
