/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: 'var(--primary-50)',
					100: 'var(--primary-100)',
					200: 'var(--primary-200)',
					300: 'var(--primary-300)',
					400: 'var(--primary-400)',
					'400/30': 'var(--primary-400\\/30)',
					'400/50': 'var(--primary-400\\/50)',
					500: 'var(--primary-500)',
					600: 'var(--primary-600)',
					700: 'var(--primary-700)',
					800: 'var(--primary-800)',
					900: 'var(--primary-900)',
				},
			},
			borderWidth: {
				3: '3px',
			},
		},
	},
	plugins: [
		require('./tailwindcss/size.cjs'),
		require('tailwindcss-global-dark'),
	],
};

module.exports = config;
