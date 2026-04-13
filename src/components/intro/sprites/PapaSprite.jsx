/**
 * Papá sprite — 4 frames:
 *  'idle'     : resting in hammock, eyes closed/relaxed
 *  'surprise' : wide eyes + "!" above head
 *  'lookUp'   : looks toward camera (eyes open wide, head slightly up)
 *  'standing' : fully upright, smiling
 *
 * Dark skin #8B6544, dark hair #2C1810, blue shirt #3355AA.
 */

function PapaLying({ frame }) {
  const eyeH   = frame === 'idle' ? 1 : 2     // idle = narrow eyes
  const eyeY   = frame === 'idle' ? 4 : 3
  const smile  = frame !== 'idle'
  return (
    <svg
      viewBox="0 0 12 14"
      width={48}
      height={56}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Hair */}
      <rect x="2" y="0" width="8" height="2" fill="#2C1810" />
      <rect x="1" y="1" width="10" height="2" fill="#2C1810" />

      {/* Head */}
      <rect x="1" y="2"  width="10" height="7" fill="#8B6544" />
      <rect x="0" y="3"  width="1"  height="5" fill="#8B6544" />
      <rect x="11" y="3" width="1"  height="5" fill="#8B6544" />

      {/* Ear */}
      <rect x="0" y="4"  width="1" height="3" fill="#7A5538" />
      <rect x="11" y="4" width="1" height="3" fill="#7A5538" />

      {/* Eyes */}
      <rect x="3" y={eyeY} width="2" height={eyeH} fill="#1A1A1A" />
      <rect x="7" y={eyeY} width="2" height={eyeH} fill="#1A1A1A" />
      {frame !== 'idle' && (
        <>
          <rect x="4" y={eyeY}     width="1" height="1" fill="#FFFFFF" />
          <rect x="8" y={eyeY}     width="1" height="1" fill="#FFFFFF" />
        </>
      )}

      {/* Nose */}
      <rect x="5" y="6" width="2" height="1" fill="#6B3A2A" />

      {/* Mouth */}
      {smile ? (
        <>
          <rect x="4" y="7" width="4" height="1" fill="#6B3A2A" />
          <rect x="3" y="6" width="1" height="1" fill="#6B3A2A" />
          <rect x="8" y="6" width="1" height="1" fill="#6B3A2A" />
        </>
      ) : (
        <rect x="4" y="7" width="4" height="1" fill="#6B3A2A" />
      )}

      {/* Shirt peek */}
      <rect x="2" y="9"  width="8" height="3" fill="#3355AA" />
      <rect x="1" y="10" width="10" height="2" fill="#3355AA" />
      <rect x="3" y="12" width="6" height="2" fill="#223366" />
    </svg>
  )
}

function PapaStanding() {
  return (
    <svg
      viewBox="0 0 14 26"
      width={56}
      height={104}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Hair */}
      <rect x="3" y="0"  width="8" height="3" fill="#2C1810" />
      <rect x="2" y="1"  width="10" height="3" fill="#2C1810" />

      {/* Head */}
      <rect x="2" y="2"  width="10" height="8" fill="#8B6544" />
      <rect x="1" y="3"  width="12" height="6" fill="#8B6544" />

      {/* Ears */}
      <rect x="1" y="4"  width="1" height="3" fill="#7A5538" />
      <rect x="12" y="4" width="1" height="3" fill="#7A5538" />

      {/* Eyes — open, happy */}
      <rect x="3" y="5"  width="2" height="2" fill="#1A1A1A" />
      <rect x="9" y="5"  width="2" height="2" fill="#1A1A1A" />
      <rect x="4" y="5"  width="1" height="1" fill="#FFFFFF" />
      <rect x="10" y="5" width="1" height="1" fill="#FFFFFF" />

      {/* Eyebrows (raised = happy) */}
      <rect x="3" y="3"  width="3" height="1" fill="#2C1810" />
      <rect x="8" y="3"  width="3" height="1" fill="#2C1810" />

      {/* Nose */}
      <rect x="6" y="7"  width="2" height="1" fill="#6B3A2A" />

      {/* Big smile */}
      <rect x="4" y="8"  width="6" height="1" fill="#6B3A2A" />
      <rect x="3" y="7"  width="1" height="1" fill="#6B3A2A" />
      <rect x="10" y="7" width="1" height="1" fill="#6B3A2A" />

      {/* Neck */}
      <rect x="5" y="10" width="4" height="2" fill="#8B6544" />

      {/* Shirt body */}
      <rect x="2" y="12" width="10" height="6" fill="#3355AA" />
      <rect x="1" y="13" width="12" height="4" fill="#3355AA" />

      {/* Arms */}
      <rect x="0" y="12" width="2" height="6" fill="#8B6544" />
      <rect x="12" y="12" width="2" height="6" fill="#8B6544" />

      {/* Hands */}
      <rect x="0" y="18" width="2" height="2" fill="#8B6544" />
      <rect x="12" y="18" width="2" height="2" fill="#8B6544" />

      {/* Pants */}
      <rect x="2" y="18" width="4" height="8" fill="#223366" />
      <rect x="8" y="18" width="4" height="8" fill="#223366" />
      <rect x="6" y="18" width="2" height="5" fill="#1A1520" />

      {/* Shoes */}
      <rect x="1" y="24" width="5" height="2" fill="#1A1A1A" />
      <rect x="8" y="24" width="5" height="2" fill="#1A1A1A" />
    </svg>
  )
}

export default function PapaSprite({ frame = 'idle', onClick, style }) {
  return (
    <div style={{ position: 'relative', cursor: 'pointer', ...style }} onClick={onClick}>
      {frame === 'standing'
        ? <PapaStanding />
        : <PapaLying frame={frame} />
      }

      {/* Exclamación "!" sobre la cabeza */}
      {frame === 'surprise' && (
        <div style={{
          position: 'absolute',
          top: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: '"Press Start 2P", cursive',
          fontSize: 20,
          color: '#FFE066',
          textShadow: '2px 2px 0 #1A1A1A, -1px -1px 0 #1A1A1A',
          animation: 'exclamacion 0.3s ease-out forwards',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          !
        </div>
      )}
    </div>
  )
}
