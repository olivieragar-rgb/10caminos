export default function ChatBubble({ mensaje }) {
  const esUser = mensaje.rol === 'user'
  return (
    <div className={`flex ${esUser ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2
        ${esUser
          ? 'bg-accent/20 border border-accent/30 rounded-br-sm'
          : 'bg-bg-surface border border-border-dark rounded-bl-sm'}`}>
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {mensaje.mensaje}
        </p>
        {mensaje.accionEjecutada && (
          <p className="text-[10px] text-green-xp mt-1 opacity-80">
            ✓ {mensaje.accionEjecutada}
          </p>
        )}
        <div className="flex items-center gap-1 mt-0.5">
          <p className="text-[10px] text-text-muted">
            {new Date(mensaje.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {mensaje.viaVoz && <span className="text-[10px] text-text-muted">🎤</span>}
        </div>
      </div>
    </div>
  )
}
