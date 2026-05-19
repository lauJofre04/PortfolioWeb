module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts,css}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--fondo)',
        surface: 'var(--fondo-secundario)',
        card: 'var(--card-bg)',
        border: 'var(--border)',
        text: 'var(--texto)',
        muted: 'var(--texto-secundario)',
        primary: 'var(--primary)',
        navbar: 'var(--navbar-bg)',
        navbarText: 'var(--navbar-text)',
      },
      boxShadow: {
        soft: '0 12px 34px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.bg-surface': { backgroundColor: 'var(--fondo-secundario)' },
        '.bg-card': { backgroundColor: 'var(--card-bg)' },
        '.border-base': { borderColor: 'var(--border)' },
        '.text-muted': { color: 'var(--texto-secundario)' },
        '.shadow-soft': { boxShadow: '0 12px 34px rgba(0, 0, 0, 0.08)' },
        '.rounded-4xl': { borderRadius: '1.5rem' },
      }, ['responsive', 'hover']);
    }
  ],
};
