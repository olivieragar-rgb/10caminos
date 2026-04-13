export default function GlowCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rpg-card ${onClick ? 'cursor-pointer rpg-card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
