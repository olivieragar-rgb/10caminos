import { PIEL_COLORES, PELO_COLORES, OJOS_COLORES } from '../../personaje'

function nivelesActivos(nivel) {
  return {
    glow:          nivel >= 5,
    goldenHair:    nivel >= 10,
    shimmerEyes:   nivel >= 15,
    aura:          nivel >= 20,
    _eyebrowRaise: nivel >= 7  && nivel < 10,
    _sparkles:     nivel >= 11 && nivel < 15,
    _hueShift:     nivel >= 16 && nivel < 20,
    _rainbow:      nivel >= 23,
    _float:        nivel >= 28,
  }
}

function PeloPath({ estilo, color }) {
  switch (estilo) {
    case 4:
      return <rect x="11" y="8" width="18" height="2" rx="1" fill={color} />
    case 0:
      return (
        <>
          <rect x="11" y="8" width="18" height="6" rx="3" fill={color} />
          <rect x="10" y="11" width="2" height="4" rx="1" fill={color} />
          <rect x="28" y="11" width="2" height="4" rx="1" fill={color} />
        </>
      )
    case 1:
      return (
        <>
          <rect x="11" y="8" width="18" height="6" rx="3" fill={color} />
          <rect x="9"  y="10" width="3" height="8" rx="1.5" fill={color} />
          <rect x="28" y="10" width="3" height="8" rx="1.5" fill={color} />
        </>
      )
    case 2:
      return (
        <>
          <rect x="11" y="8" width="18" height="6" rx="3" fill={color} />
          <rect x="8"  y="10" width="4" height="18" rx="2" fill={color} />
          <rect x="28" y="10" width="4" height="18" rx="2" fill={color} />
          <rect x="10" y="26" width="20" height="4" rx="2" fill={color} />
        </>
      )
    case 3:
      return (
        <>
          <circle cx="15" cy="11" r="4" fill={color} />
          <circle cx="20" cy="9"  r="4" fill={color} />
          <circle cx="25" cy="11" r="4" fill={color} />
          <circle cx="12" cy="14" r="3" fill={color} />
          <circle cx="28" cy="14" r="3" fill={color} />
        </>
      )
    default:
      return null
  }
}

export default function AvatarPersonaje({ config = {}, nivel = 0, size = 48 }) {
  const {
    piel = 2, peloCColor = 1, peloEstilo = 1,
    ojos = 0, vellos = 0,
  } = config

  const skinColor = PIEL_COLORES[piel] ?? PIEL_COLORES[2]
  const hairColor = PELO_COLORES[peloCColor] ?? PELO_COLORES[1]
  const eyeColor  = OJOS_COLORES[ojos] ?? OJOS_COLORES[0]
  const hairDark  = hairColor === '#F0F0F0' ? '#C0C0C0'
    : hairColor === '#FDDBB4' ? '#C8A850' : hairColor

  const fx = nivelesActivos(nivel)

  let wrapperStyle = { position: 'relative', width: size, height: size, display: 'inline-block' }
  if (fx.aura) {
    wrapperStyle.filter = 'drop-shadow(0 0 10px #f0c040) drop-shadow(0 0 20px #f0c04060)'
    wrapperStyle.animation = 'auraFloat 3s ease-in-out infinite'
  } else if (fx.glow) {
    wrapperStyle.filter = 'drop-shadow(0 0 6px #e9456060)'
  }
  if (fx._float) {
    wrapperStyle.animation = 'avatarFloat 2.5s ease-in-out infinite'
  }

  const uid = `avc-${piel}-${peloCColor}-${nivel}-${size}`

  return (
    <div style={wrapperStyle}>
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <clipPath id={uid}>
            <circle cx="20" cy="20" r="20" />
          </clipPath>
          {fx.shimmerEyes && (
            <radialGradient id={`irs-${uid}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor={eyeColor} stopOpacity="1" />
            </radialGradient>
          )}
        </defs>

        <g clipPath={`url(#${uid})`}>
          {/* Fondo */}
          <circle cx="20" cy="20" r="20" fill="#181726" />

          {/* Hombros */}
          <ellipse cx="20" cy="38" rx="16" ry="9" fill={skinColor} />

          {/* Cuello */}
          <rect x="16" y="27" width="8" height="6" rx="2" fill={skinColor} />

          {/* Pelo detrás */}
          <PeloPath estilo={peloEstilo} color={hairColor} />

          {/* Cara */}
          <ellipse cx="20" cy="19" rx="9" ry="10" fill={skinColor} />

          {/* Overlay dorado pelo nivel 10+ */}
          {fx.goldenHair && (
            <g opacity="0.35">
              <PeloPath estilo={peloEstilo} color="#f0c040" />
            </g>
          )}

          {/* Cejas */}
          <rect x="13.5" y="13.5" width="5" height="1.2" rx="0.6" fill={hairDark}
            transform={fx._eyebrowRaise ? 'rotate(-6,16,14)' : ''} />
          <rect x="21.5" y="13.5" width="5" height="1.2" rx="0.6" fill={hairDark}
            transform={fx._eyebrowRaise ? 'rotate(6,24,14)' : ''} />

          {/* Ojos blancos */}
          <circle cx="16" cy="17" r="2" fill="#ffffff" />
          <circle cx="24" cy="17" r="2" fill="#ffffff" />

          {/* Iris */}
          <circle cx="16" cy="17" r="1.4"
            fill={fx.shimmerEyes ? `url(#irs-${uid})` : eyeColor} />
          <circle cx="24" cy="17" r="1.4"
            fill={fx.shimmerEyes ? `url(#irs-${uid})` : eyeColor} />

          {/* Pupila */}
          <circle cx="16.3" cy="17" r="0.65" fill="#1a1a1a" />
          <circle cx="24.3" cy="17" r="0.65" fill="#1a1a1a" />

          {/* Brillo ojo */}
          <circle cx="15.3" cy="16.2" r="0.45" fill="#ffffff" />
          <circle cx="23.3" cy="16.2" r="0.45" fill="#ffffff" />

          {/* Boca */}
          <path d="M 16.5 22.5 Q 20 25 23.5 22.5"
            stroke="#6B3A2A" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Vello facial */}
          {vellos === 1 && (
            <>
              <rect x="16" y="23" width="3" height="0.8" rx="0.4" fill={hairDark} opacity="0.7" />
              <rect x="21" y="23" width="3" height="0.8" rx="0.4" fill={hairDark} opacity="0.7" />
              <rect x="17" y="24.2" width="6" height="0.8" rx="0.4" fill={hairDark} opacity="0.7" />
            </>
          )}
          {vellos === 2 && (
            <>
              <path d="M 14 23 Q 20 28 26 23"
                stroke={hairDark} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.85" />
              <rect x="14" y="23" width="12" height="4" rx="2" fill={hairDark} opacity="0.6" />
            </>
          )}

          {/* Sparkles secretos nivel 11-14 */}
          {fx._sparkles && (
            <g>
              <circle cx="8" cy="10" r="1" fill="#f0c040">
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.5;1.2;0.5" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="8" r="1" fill="#f0c040">
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.5;1.2;0.5" dur="1.8s" begin="0.6s" repeatCount="indefinite" />
              </circle>
              <circle cx="35" cy="22" r="0.8" fill="#f0c040">
                <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
        </g>

        {/* Borde exterior */}
        <circle cx="20" cy="20" r="19.5" fill="none"
          strokeWidth={fx.aura ? 1.5 : 1}
          stroke={fx.aura ? '#f0c040' : fx.glow ? '#e9456060' : '#302e4e'}
        />

        {/* Rainbow border nivel 23+ */}
        {fx._rainbow && (
          <circle cx="20" cy="20" r="19.5" fill="none" strokeWidth="2"
            stroke="url(#rainbow)" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate"
              from="0 20 20" to="360 20 20" dur="4s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  )
}
