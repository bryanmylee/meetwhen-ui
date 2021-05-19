module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          lighter: 'var(--primary-lighter)',
          darker: 'var(--primary-darker)',
          warmer: 'var(--primary-warmer)',
          cooler: 'var(--primary-cooler)',
        },
      },
    },
  },
  plugins: [],
};
