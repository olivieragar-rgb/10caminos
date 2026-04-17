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
      <h3 className="font-pixel text-[10px] text-xp-bar mb-2">CONFIGURAR ASISTENTE IA</h3>
      <p className="font-body text-sm text-text-secondary mb-6 leading-relaxed">
        Para usar el chat necesitas una API key de Anthropic.
        Se guarda localmente en tu dispositivo.
      </p>

      <div className="w-full space-y-3"
        style={{
          background: '#181726',
          border: '1px solid #302e4e',
          borderRadius: '12px',
          padding: '16px',
        }}>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGuardar()}
          placeholder="sk-ant-..."
          className="w-full px-4 py-3 font-body text-sm text-text-primary placeholder-text-muted outline-none min-h-[48px]"
          style={{ background: '#2d2b47', border: '1px solid #4a4770', borderRadius: '8px' }}
        />
        <button
          onClick={handleGuardar}
          disabled={!apiKey.trim() || guardando}
          className="w-full py-3 font-pixel text-[9px] text-white disabled:opacity-40 min-h-[48px] active:translate-y-[1px]"
          style={{ background: 'linear-gradient(180deg, #e94560, #c03040)', border: '1px solid #ff6080', borderRadius: '8px', boxShadow: '0 4px 12px rgba(233,69,96,0.3)' }}
        >
          {guardando ? 'GUARDANDO...' : 'GUARDAR API KEY'}
        </button>
      </div>

      <p className="font-pixel text-[7px] text-text-muted mt-4">
        La API key solo se usa para el Chat IA. El resto de la app funciona offline.
      </p>
    </div>
  )
}
