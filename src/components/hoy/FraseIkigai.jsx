import { useState, useEffect } from 'react'
import { FRASES_IKIGAI } from '../../constants'
import { hoyISO } from '../../utils/dates'

function diaDelAno(fechaISO) {
  const d = new Date(fechaISO)
  const inicio = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d - inicio) / (1000 * 60 * 60 * 24))
}

export default function FraseIkigai() {
  const frase = FRASES_IKIGAI[diaDelAno(hoyISO()) % FRASES_IKIGAI.length]
  const [visible, setVisible] = useState('')

  useEffect(() => {
    setVisible('')
    let i = 0
    const id = setInterval(() => {
      i++
      setVisible(frase.slice(0, i))
      if (i >= frase.length) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [frase])

  return (
    <div className="mx-4 mb-3 px-4 py-3"
         style={{ background: 'linear-gradient(180deg, #2a2035 0%, #1a1520 100%)', border: '2px solid #4a3860', borderRadius: '2px', boxShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}>
      <p className="font-pixel text-[7px] uppercase tracking-wider mb-2" style={{ color: '#c4a882' }}>
        ✦ IKIGAI DEL DÍA
      </p>
      <p className="font-body text-[12px] italic leading-relaxed min-h-[1.5em]" style={{ color: '#a89b8c' }}>
        "{visible}<span style={{ opacity: visible.length < frase.length ? 1 : 0 }}>▌</span>"
      </p>
    </div>
  )
}
