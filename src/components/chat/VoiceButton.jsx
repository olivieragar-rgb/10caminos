import { useVoice } from '../../hooks/useVoice'

export default function VoiceButton({ onResult, disabled }) {
  const { listening, startListening, stopListening, supported } = useVoice(onResult)

  if (!supported) return null

  return (
    <button
      onPointerDown={startListening}
      onPointerUp={stopListening}
      onPointerLeave={stopListening}
      disabled={disabled}
      className={`w-11 h-11 flex-shrink-0 flex items-center justify-center
                  select-none transition-transform duration-150
                  ${disabled ? 'opacity-40' : 'active:translate-y-[1px]'}`}
      style={{
        background: listening ? 'rgba(232,48,48,0.2)' : '#342848',
        border: `2px solid ${listening ? '#e83030' : '#4a3860'}`,
        borderRadius: '2px',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
      }}
      title="Mantén pulsado para hablar"
    >
      <span className="text-lg">{listening ? '🔴' : '🎤'}</span>
    </button>
  )
}
