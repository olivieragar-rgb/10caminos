export default function ChatBubble({ mensaje }) {
  const esUser = mensaje.rol === 'user'
  return (
    <div className={`flex ${esUser ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div className="max-w-[80%] px-3 py-2"
        style={{
          background: esUser ? 'rgba(233,69,96,0.15)' : '#342848',
          border: `2px solid ${esUser ? 'rgba(233,69,96,0.4)' : '#4a3860'}`,
          borderRadius: '2px',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
        }}>
        <p className="font-body text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
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
