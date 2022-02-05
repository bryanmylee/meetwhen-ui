const plugin = require('tailwindcss/plugin');

const textStylesPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.text-title-lg': {
			'@apply text-4xl font-semibold': {},
		},
		'.text-title-1': {
			'@apply text-2xl font-semibold': {},
		},
		'.text-title-2': {
			'@apply text-xl font-semibold': {},
		},
		'.text-title-3': {
			'@apply text-lg font-semibold': {},
		},
		'.text-subtitle': {
			'@apply text-lg font-medium': {},
		},
		'.text-headline': {
			'@apply font-semibold': {},
		},
		'.text-body': {
			'@apply text-base': {},
		},
		'.text-label': {
			'@apply text-sm font-semibold': {},
		},
		'.text-label-sm': {
			'@apply text-xs font-semibold': {},
		},
		'.text-error': {
			'@apply text-xs italic': {},
		},
	});
});

module.exports = textStylesPlugin;
