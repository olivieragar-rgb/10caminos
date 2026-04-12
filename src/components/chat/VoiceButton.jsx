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
      className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full
                  border transition-all duration-150 select-none
                  ${listening
                    ? 'bg-red-alert/20 border-red-alert/60 scale-110'
                    : 'bg-bg-surface border-border-dark text-text-muted'}
                  ${disabled ? 'opacity-40' : 'active:scale-95'}`}
      title="Mantén pulsado para hablar"
    >
      <span className="text-lg">{listening ? '🔴' : '🎤'}</span>
    </button>
  )
}
