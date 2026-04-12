import { useState, useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatBubble from './ChatBubble'
import VoiceButton from './VoiceButton'
import ApiKeySetup from './ApiKeySetup'

export default function ChatView() {
  const { mensajes, enviando, apiKey, sendMessage, guardarApiKey, limpiarHistorial } = useChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  // Auto-scroll al fondo
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes])

  const handleSend = () => {
    if (!input.trim() || enviando) return
    sendMessage(input.trim(), false)
    setInput('')
  }

  const handleVoiceResult = (texto) => {
    sendMessage(texto, true)
  }

  // Cargando API key
  if (apiKey === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-text-muted text-sm font-mono">...</span>
      </div>
    )
  }

  // Sin API key
  if (!apiKey) {
    return <ApiKeySetup onGuardar={guardarApiKey} />
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-border-dark">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <p className="text-sm font-medium text-text-primary">Asistente IA</p>
            <p className="text-[10px] text-text-muted">Claude · Requiere internet</p>
          </div>
        </div>
        <button onClick={() => { if (confirm('¿Limpiar historial?')) limpiarHistorial() }}
          className="text-[10px] text-text-muted px-2 py-1">
          Limpiar
        </button>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
        {mensajes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
            <span className="text-3xl mb-3">💬</span>
            <p className="text-sm text-text-secondary">
              Habla con tu asistente. Puedes pedirle que gestione tus rutas, añada notas o te cuente tu progreso.
            </p>
          </div>
        ) : (
          mensajes.map(m => <ChatBubble key={m.id} mensaje={m} />)
        )}

        {enviando && (
          <div className="px-4 flex justify-start mb-2">
            <div className="bg-bg-surface border border-border-dark rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-border-dark">
        <div className="flex gap-2 items-end">
          <VoiceButton onResult={handleVoiceResult} disabled={enviando} />
          <div className="flex-1 bg-bg-surface border border-border-dark rounded-2xl
                          flex items-end gap-2 px-3 py-2 focus-within:border-accent/50
                          transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
              }}
              placeholder="Escribe o mantén el micrófono..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted
                         outline-none resize-none max-h-24 leading-relaxed"
              style={{ minHeight: '24px' }}
            />
            <button onClick={handleSend} disabled={!input.trim() || enviando}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                         bg-accent rounded-full disabled:opacity-40 active:scale-95
                         transition-all">
              <span className="text-sm text-white">↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
