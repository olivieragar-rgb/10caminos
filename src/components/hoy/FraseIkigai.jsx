import { FRASES_IKIGAI } from '../../constants'
import { hoyISO } from '../../utils/dates'

/** Calcula el día del año para rotar frases de forma determinista */
function diaDelAno(fechaISO) {
  const d = new Date(fechaISO)
  const inicio = new Date(d.getFullYear(), 0, 0)
  const diff = d - inicio
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function FraseIkigai() {
  const frase = FRASES_IKIGAI[diaDelAno(hoyISO()) % FRASES_IKIGAI.length]

  return (
    <div className="mx-4 mb-3 px-4 py-3 rounded-xl border border-border-dark bg-bg-card/60
                    animate-fade-in-up">
      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1 font-medium">
        ✦ Ikigai del día
      </p>
      <p className="text-sm text-text-secondary italic leading-relaxed">
        "{frase}"
      </p>
    </div>
  )
}
