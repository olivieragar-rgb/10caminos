/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep':       '#0a0a0f',
        'bg-card':       '#14141f',
        'bg-card-hover': '#1a1a2e',
        'bg-surface':    '#1e1e30',
        'text-primary':  '#e8e6e3',
        'text-secondary':'#8a8690',
        'text-muted':    '#4a4654',
        'accent':        '#e94560',
        'xp-bar':        '#ffd700',
        'green-xp':      '#00e676',
        'yellow-pause':  '#ffab00',
        'gray-nada':     '#616161',
        'red-alert':     '#ff1744',
        'border-dark':   '#2a2a3e',
        'racha-fire':    '#ff6d00',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'ui-monospace', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'xp':     '0 0 8px #ffd70030',
        'accent': '0 0 8px #e9456040',
        'green':  '0 0 8px #00e67630',
      },
    },
  },
  plugins: [],
}
