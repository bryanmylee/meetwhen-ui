module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
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
          sixty: 'var(--primary-sixty)',
          thirty: 'var(--primary-thirty)',
        },
      },
    },
  },
  plugins: [require('./src/plugins/tailwind-color-shadows.cjs')],
};
