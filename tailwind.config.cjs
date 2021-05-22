module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      borderWidth: {
        3: '3px',
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          lighter: 'var(--primary-lighter)',
          darker: 'var(--primary-darker)',
          warmer: 'var(--primary-warmer)',
          cooler: 'var(--primary-cooler)',
          fifty: 'var(--primary-fifty)',
          thirty: 'var(--primary-thirty)',
        },
      },
    },
  },
  plugins: [require('./src/plugins/tailwind-color-shadows.cjs')],
};
