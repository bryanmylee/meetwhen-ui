const plugin = require('tailwindcss/plugin');

const noScrollbarPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.no-scrollbar': {
			'&::-webkit-scrollbar': {
				display: 'none',
			},
			'-ms-overflow-style': 'none',
			'scrollbar-width': 'none',
		},
	});
});

module.exports = noScrollbarPlugin;
