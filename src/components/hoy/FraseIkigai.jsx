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
         style={{ background: '#181726', border: '1px solid #302e4e', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
      <p className="font-pixel text-[7px] uppercase tracking-wider mb-2" style={{ color: '#9590a8' }}>
        ✦ IKIGAI DEL DÍA
      </p>
      <p className="font-body text-[12px] italic leading-relaxed min-h-[1.5em]" style={{ color: '#ede9e1' }}>
        "{visible}<span style={{ opacity: visible.length < frase.length ? 1 : 0 }}>▌</span>"
      </p>
    </div>
  )
}
