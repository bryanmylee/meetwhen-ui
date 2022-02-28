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
		'.focus-within': {
			'@apply ring-primary-400': {},
			'&:focus-within': {
				'@apply ring outline-none': {},
			},
			'& :focus': {
				'@apply outline-none': {},
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
		'.focus-text': {
			'@apply ring-primary-400 rounded ring-offset-2 gdark:ring-offset-neutral-800':
				{},
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
