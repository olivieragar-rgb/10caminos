export function speechSupported() {
  return typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function createRecognizer({ onResult, onEnd, onError }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const rec = new SR()
  rec.lang = 'es-ES'
  rec.continuous = false
  rec.interimResults = false
  rec.onresult = e => onResult?.(e.results[0][0].transcript)
  rec.onend = () => onEnd?.()
  rec.onerror = e => onError?.(e.error)
  return rec
}
