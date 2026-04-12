import { useState, useRef, useCallback } from 'react'

export function useVoice(onResult) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recRef = useRef(null)

  const SR = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null

  const startListening = useCallback(() => {
    if (!SR) { setError('Tu navegador no soporta reconocimiento de voz'); return }
    setError(null)
    const rec = new SR()
    rec.lang = 'es-ES'
    rec.continuous = false
    rec.interimResults = false
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onerror = e => { setError(e.error); setListening(false) }
    rec.onresult = e => onResult(e.results[0][0].transcript)
    recRef.current = rec
    rec.start()
  }, [SR, onResult])

  const stopListening = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, error, startListening, stopListening, supported: !!SR }
}
