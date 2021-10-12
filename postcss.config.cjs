const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		require('tailwindcss/nesting'),
		require('tailwindcss'),
		//But others, like autoprefixer, need to run after,
		require('autoprefixer'),
		!dev &&
			require('cssnano')({
				preset: 'default',
			}),
	],
};

module.exports = config;
