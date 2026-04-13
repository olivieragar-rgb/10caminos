export default function ArbolSprite({ width = 56, height = 84 }) {
  return (
    <svg
      viewBox="0 0 14 21"
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Trunk */}
      <rect x="5" y="15" width="4" height="6" fill="#6B4423" />
      <rect x="5" y="15" width="1" height="6" fill="#3D2410" />
      <rect x="8" y="15" width="1" height="6" fill="#3D2410" />

      {/* Roots */}
      <rect x="3" y="19" width="2" height="2" fill="#3D2410" />
      <rect x="9" y="19" width="2" height="2" fill="#3D2410" />

      {/* Bottom leaf layer (widest) */}
      <rect x="0" y="10" width="14" height="6" fill="#2D6B2D" />
      <rect x="1" y="10" width="12" height="4" fill="#4A8C3F" />

      {/* Middle leaf layer */}
      <rect x="2" y="5"  width="10" height="7" fill="#2D6B2D" />
      <rect x="3" y="5"  width="8"  height="5" fill="#4A8C3F" />

      {/* Top leaf layer */}
      <rect x="4" y="1"  width="6"  height="6" fill="#2D6B2D" />
      <rect x="5" y="1"  width="4"  height="4" fill="#3A7A3A" />

      {/* Highlights */}
      <rect x="4"  y="8" width="2" height="1" fill="#6FBB6F" />
      <rect x="9"  y="6" width="2" height="1" fill="#6FBB6F" />
      <rect x="6"  y="2" width="2" height="1" fill="#6FBB6F" />
    </svg>
  )
}
