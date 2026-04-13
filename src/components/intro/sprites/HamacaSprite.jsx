/**
 * Hammock fabric + ropes. Designed to fit between two trees.
 * The ropes extend left and right to visually connect to trees.
 */
export default function HamacaSprite({ width = 160, height = 40 }) {
  return (
    <svg
      viewBox="0 0 40 10"
      width={width}
      height={height}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Left rope (diagonal from tree attachment to hammock) */}
      <rect x="0"  y="0" width="1" height="1" fill="#D4A373" />
      <rect x="1"  y="1" width="1" height="1" fill="#D4A373" />
      <rect x="2"  y="2" width="1" height="1" fill="#D4A373" />
      <rect x="3"  y="3" width="3" height="1" fill="#D4A373" />

      {/* Right rope */}
      <rect x="39" y="0" width="1" height="1" fill="#D4A373" />
      <rect x="38" y="1" width="1" height="1" fill="#D4A373" />
      <rect x="37" y="2" width="1" height="1" fill="#D4A373" />
      <rect x="34" y="3" width="3" height="1" fill="#D4A373" />

      {/* Hammock fabric (slight curve simulated with rows) */}
      <rect x="4"  y="3" width="32" height="1" fill="#B8916A" />
      <rect x="3"  y="4" width="34" height="3" fill="#E8C9A0" />
      <rect x="4"  y="4" width="32" height="2" fill="#F0D9B0" />
      <rect x="3"  y="7" width="34" height="1" fill="#B8916A" />

      {/* Fabric shadow/depth */}
      <rect x="5"  y="5" width="30" height="1" fill="#D4B88A" />

      {/* Rope knot detail left */}
      <rect x="3"  y="3" width="2" height="2" fill="#C4956A" />
      {/* Rope knot detail right */}
      <rect x="35" y="3" width="2" height="2" fill="#C4956A" />
    </svg>
  )
}
