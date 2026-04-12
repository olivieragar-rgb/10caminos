import { useState } from 'react'

export default function ApiKeySetup({ onGuardar }) {
  const [apiKey, setApiKey] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleGuardar = async () => {
    if (!apiKey.trim()) return
    setGuardando(true)
    await onGuardar(apiKey.trim())
    setGuardando(false)
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
      <span className="text-4xl mb-4">🤖</span>
      <h3 className="text-base font-medium text-text-primary mb-2">Configurar asistente IA</h3>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Para usar el chat necesitas una API key de Anthropic.
        Se guarda localmente en tu dispositivo.
      </p>

      <div className="w-full space-y-3">
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGuardar()}
          placeholder="sk-ant-..."
          className="w-full bg-bg-surface border border-border-dark rounded-xl px-4 py-3
                     text-sm text-text-primary placeholder-text-muted outline-none
                     focus:border-accent/50 min-h-[48px]"
        />
        <button
          onClick={handleGuardar}
          disabled={!apiKey.trim() || guardando}
          className="w-full py-3 rounded-xl bg-accent text-white text-sm font-medium
                     disabled:opacity-40 min-h-[48px] active:scale-98 transition-transform"
        >
          {guardando ? 'Guardando...' : 'Guardar API key'}
        </button>
      </div>

      <p className="text-[10px] text-text-muted mt-4">
        La API key solo se usa para el Chat IA. El resto de la app funciona offline.
      </p>
    </div>
  )
}
