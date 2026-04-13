import { useState, useRef, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db'
import { useChat } from '../../hooks/useChat'
import ChatBubble from './ChatBubble'
import VoiceButton from './VoiceButton'
import ApiKeySetup from './ApiKeySetup'

// ── Panel de notas personales (alternativa NotebookLM) ───────────────────────
function NotasPersonalesPanel({ onClose }) {
  const cfg   = useLiveQuery(() => db.configuracion.get('notasPersonales'), [], null)
  const [texto, setTexto] = useState('')
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    if (cfg !== null && cfg !== undefined) setTexto(cfg?.value || '')
  }, [cfg])

  const guardar = async () => {
    await db.configuracion.put({ key: 'notasPersonales', value: texto })
    setGuardado(true)
    setTimeout(() => setGuardado(false), 1500)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3"
           style={{ borderBottom: '2px solid #4a3860' }}>
        <button onClick={onClose}
          className="font-pixel text-[8px] text-text-muted px-2 py-1.5 active:translate-y-[1px]"
          style={{ border: '2px solid #4a3860', borderRadius: '2px', background: '#342848' }}>
          ← VOLVER
        </button>
        <div>
          <p className="font-pixel text-[9px] text-xp-bar">MI CUADERNO</p>
          <p className="font-pixel text-[7px] text-text-muted mt-0.5">El asistente lee esto en cada conversación</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3">
        <p className="font-pixel text-[7px] text-text-muted mb-2">
          Pega aquí notas de NotebookLM, reflexiones, contexto personal... Claude lo tendrá siempre disponible.
        </p>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Mis notas, contexto, objetivos profundos, extractos de otros cuadernos..."
          className="w-full font-body text-sm text-text-primary placeholder-text-muted outline-none resize-none"
          style={{
            background: '#2a2035',
            border: '2px solid #4a3860',
            borderRadius: '2px',
            padding: '12px',
            minHeight: '320px',
          }}
        />
        <p className="font-pixel text-[7px] text-text-muted mt-1">
          {texto.length} caracteres
        </p>
      </div>

      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid #4a3860' }}>
        <button onClick={guardar}
          className="w-full py-3 font-pixel text-[9px] active:translate-y-[1px]"
          style={{
            background: guardado
              ? 'linear-gradient(180deg, #50c878, #3a9858)'
              : 'linear-gradient(180deg, #342848, #2a2035)',
            border: `2px solid ${guardado ? '#50c878' : '#6a5880'}`,
            borderRadius: '2px',
            color: guardado ? '#1a2035' : '#c4a882',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
          }}>
          {guardado ? '✓ GUARDADO' : '💾 GUARDAR NOTAS'}
        </button>
      </div>
    </div>
  )
}

// ── Vista principal del chat ──────────────────────────────────────────────────
export default function ChatView() {
  const { mensajes, enviando, apiKey, sendMessage, guardarApiKey, limpiarHistorial } = useChat()
  const [input, setInput]       = useState('')
  const [showNotas, setShowNotas] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes])

  const handleSend = () => {
    if (!input.trim() || enviando) return
    sendMessage(input.trim(), false)
    setInput('')
  }

  const handleVoiceResult = (texto) => sendMessage(texto, true)

  if (apiKey === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-pixel text-[8px] text-text-muted">...</span>
      </div>
    )
  }

  if (!apiKey) return <ApiKeySetup onGuardar={guardarApiKey} />

  if (showNotas) return <NotasPersonalesPanel onClose={() => setShowNotas(false)} />

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between"
           style={{ borderBottom: '2px solid #4a3860' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <p className="font-pixel text-[9px] text-xp-bar">ASISTENTE IA</p>
            <p className="font-pixel text-[7px] text-text-muted mt-0.5">CLAUDE · REQUIERE INTERNET</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNotas(true)}
            className="font-pixel text-[7px] text-blue-mana px-2 py-1.5 active:translate-y-[1px]"
            style={{ border: '2px solid #4488cc60', borderRadius: '2px', background: 'rgba(68,136,204,0.1)' }}
            title="Mi cuaderno de notas">
            📓 NOTAS
          </button>
          <button onClick={() => { if (confirm('¿Limpiar historial?')) limpiarHistorial() }}
            className="font-pixel text-[7px] text-text-muted px-2 py-1.5"
            style={{ border: '1px solid #4a3860', borderRadius: '2px' }}>
            🗑
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
        {mensajes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12 gap-3">
            <span className="text-3xl">💬</span>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              Habla con tu asistente. Puede gestionar rutas, marcar caminos, crear recompensas, editar cualquier dato de la app, o simplemente escucharte.
            </p>
            <div className="mt-2 text-left w-full space-y-1">
              {[
                '"Marca Sano y en forma como avance hoy"',
                '"Crea una ruta para aprender a cocinar"',
                '"¿Cómo llevo esta semana?"',
                '"Añade una recompensa en nivel 5 para mí"',
              ].map((s, i) => (
                <button key={i} onClick={() => { setInput(s.replace(/"/g, '')); }}
                  className="w-full text-left px-3 py-2 font-body text-[11px] text-text-muted active:translate-y-[1px]"
                  style={{ background: '#2a2035', border: '1px solid #4a3860', borderRadius: '2px' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          mensajes.map(m => <ChatBubble key={m.id} mensaje={m} />)
        )}

        {enviando && (
          <div className="px-4 flex justify-start mb-2">
            <div className="px-4 py-3" style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-text-muted animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2" style={{ borderTop: '2px solid #4a3860' }}>
        <div className="flex gap-2 items-end">
          <VoiceButton onResult={handleVoiceResult} disabled={enviando} />
          <div className="flex-1 flex items-end gap-2 px-3 py-2"
               style={{ background: '#342848', border: '2px solid #4a3860', borderRadius: '2px' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
              }}
              placeholder="Escribe o mantén el micrófono..."
              rows={1}
              className="flex-1 bg-transparent font-body text-sm text-text-primary placeholder-text-muted
                         outline-none resize-none max-h-24 leading-relaxed"
              style={{ minHeight: '24px' }}
            />
            <button onClick={handleSend} disabled={!input.trim() || enviando}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                         disabled:opacity-40 active:translate-y-[1px] font-pixel text-[14px] text-white"
              style={{ background: '#e94560', border: '2px solid #ff6080', borderRadius: '2px', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
