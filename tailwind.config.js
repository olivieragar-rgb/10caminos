/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep':       '#1a1520',
        'bg-card':       '#2a2035',
        'bg-card-hover': '#3a2d45',
        'bg-surface':    '#342848',
        'text-primary':  '#f0e6d3',
        'text-secondary':'#a89b8c',
        'text-muted':    '#6b5e52',
        'accent':        '#e94560',
        'xp-bar':        '#ffd700',
        'green-xp':      '#50c878',
        'yellow-pause':  '#f0c040',
        'gray-nada':     '#706060',
        'red-alert':     '#e83030',
        'border-dark':   '#4a3860',
        'racha-fire':    '#ff6020',
        'blue-mana':     '#4488cc',
      },
      fontFamily: {
        pixel: ['"Cinzel"', 'serif'],
        mono:  ['"Share Tech Mono"', 'monospace'],
        body:  ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pixel':  '4px 4px 0px rgba(0,0,0,0.6)',
        'pixel-sm': '2px 2px 0px rgba(0,0,0,0.6)',
        'xp':     '0 0 8px #ffd70030',
        'accent': '0 0 8px #e9456040',
        'green':  '0 0 8px #50c87830',
      },
      borderRadius: {
        'rpg': '2px',
      },
    },
  },
  plugins: [],
}
