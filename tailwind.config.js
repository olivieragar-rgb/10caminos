/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep':       '#0e0e1a',
        'bg-card':       '#181726',
        'bg-card-hover': '#211f34',
        'bg-surface':    '#23213a',
        'bg-elevated':   '#2d2b47',
        'text-primary':  '#ede9e1',
        'text-secondary':'#9590a8',
        'text-muted':    '#5c5875',
        'accent':        '#e94560',
        'xp-bar':        '#f0c040',
        'green-xp':      '#4ade80',
        'yellow-pause':  '#fbbf24',
        'gray-nada':     '#6b7280',
        'red-alert':     '#f43f5e',
        'border-dark':   '#302e4e',
        'border-bright': '#4a4770',
        'racha-fire':    '#f97316',
        'blue-mana':     '#60a5fa',
      },
      fontFamily: {
        pixel: ['"Cinzel"', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        body:  ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 4px 16px rgba(0,0,0,0.4)',
        'card-sm': '0 2px 8px rgba(0,0,0,0.35)',
        'xp':      '0 0 10px #f0c04035',
        'accent':  '0 0 10px #e9456040',
        'green':   '0 0 10px #4ade8035',
        'pill':    '0 8px 32px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        'card': '8px',
        'pill': '100px',
      },
    },
  },
  plugins: [],
}
