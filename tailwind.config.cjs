const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			borderWidth: {
				3: '3px',
			},
			boxShadow: {
				wide: '0 1px 9px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'md-wide':
					'0 4px 18px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
			},
			colors: {
				primary: {
					50: 'var(--primary-50)',
					100: 'var(--primary-100)',
					200: 'var(--primary-200)',
					300: 'var(--primary-300)',
					400: 'var(--primary-400)',
					'400+1': 'var(--primary-400\\+1)',
					'400-1': 'var(--primary-400-1)',
					'400+2': 'var(--primary-400\\+2)',
					'400-2': 'var(--primary-400-2)',
					'400/30': 'var(--primary-400\\/30)',
					'400/50': 'var(--primary-400\\/50)',
					500: 'var(--primary-500)',
					600: 'var(--primary-600)',
					700: 'var(--primary-700)',
					800: 'var(--primary-800)',
					900: 'var(--primary-900)',
				},
			},
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
			},
			minHeight: (theme) => theme('height'),
			minWidth: (theme) => theme('width'),
			maxHeight: (theme) => theme('height'),
			maxWidth: (theme) => theme('width'),
		},
	},
	plugins: [
		require('./tailwindcss/bgShade.cjs'),
		require('./tailwindcss/brand.cjs'),
		require('./tailwindcss/card.cjs'),
		require('./tailwindcss/focus.cjs'),
		require('./tailwindcss/focusOnly.cjs'),
		require('./tailwindcss/noScrollbar.cjs'),
		require('./tailwindcss/size.cjs'),
		require('./tailwindcss/skeleton.cjs'),
		require('./tailwindcss/textStyles.cjs'),
		require('tailwindcss-global-dark'),
	],
};

module.exports = config;
