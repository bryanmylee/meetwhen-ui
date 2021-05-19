const mode = process.env.NODE_ENV;
const dev = mode === 'development';

module.exports = {
  plugins: [
    // Some plugins, like postcss-nested, need to run before Tailwind
    require('postcss-nested'),

    require('tailwindcss'),

    // But others, like autoprefixer, need to run after
    require('autoprefixer'),

    !dev &&
      require('cssnano')({
        preset: 'default',
      }),
  ],
};
