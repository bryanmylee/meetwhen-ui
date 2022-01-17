const plugin = require('tailwindcss/plugin');

const focusPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.focus': {
			'@apply ring-primary-400': {},
			'&:focus': {
				'@apply ring outline-none': {},
			},
			'&:global(.error)': {
				'@apply ring ring-red-400': {},
			},
		},
		'.focus-inset': {
			'@apply ring-primary-400 ring-inset': {},
			'&:focus': {
				'@apply ring outline-none': {},
			},
			'&:global(.error)': {
				'@apply ring ring-red-400': {},
			},
		},
	});
});

module.exports = focusPlugin;
