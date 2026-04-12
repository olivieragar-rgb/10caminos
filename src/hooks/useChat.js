import { useState, useEffect, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { llamarClaude } from '../services/claude'
import { v4 as uuidv4 } from 'uuid'

export function useChat() {
  const mensajes = useLiveQuery(
    () => db.chatHistorial.orderBy('fecha').toArray(),
    [], []
  )
  const [enviando, setEnviando] = useState(false)
  const [apiKey, setApiKey] = useState(undefined) // undefined = cargando

  useEffect(() => {
    db.configuracion.get('claudeApiKey').then(r => setApiKey(r?.value ?? null))
  }, [])

  const sendMessage = useCallback(async (texto, viaVoz = false) => {
    if (!apiKey || !texto.trim() || enviando) return

    setEnviando(true)

    const userMsg = {
      id: uuidv4(),
      fecha: new Date(),
      rol: 'user',
      mensaje: texto.trim(),
      viaVoz,
      accionEjecutada: null,
    }
    await db.chatHistorial.add(userMsg)

    try {
      const { respuesta, accion } = await llamarClaude(texto.trim(), mensajes || [], apiKey)
      await db.chatHistorial.add({
        id: uuidv4(),
        fecha: new Date(),
        rol: 'assistant',
        mensaje: respuesta,
        viaVoz: false,
        accionEjecutada: accion,
      })
    } catch (err) {
      await db.chatHistorial.add({
        id: uuidv4(),
        fecha: new Date(),
        rol: 'assistant',
        mensaje: `⚠️ Error: ${err.message}. Verifica tu API key y conexión.`,
        viaVoz: false,
        accionEjecutada: null,
      })
    } finally {
      setEnviando(false)
    }
  }, [apiKey, mensajes, enviando])

  const guardarApiKey = useCallback(async (key) => {
    await db.configuracion.put({ key: 'claudeApiKey', value: key })
    setApiKey(key)
  }, [])

  const limpiarHistorial = useCallback(async () => {
    await db.chatHistorial.clear()
  }, [])

  return {
    mensajes: mensajes || [],
    enviando,
    apiKey,
    sendMessage,
    guardarApiKey,
    limpiarHistorial,
  }
}
