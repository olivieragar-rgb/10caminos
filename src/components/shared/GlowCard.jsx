export default function GlowCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg-card border border-border-dark rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}
