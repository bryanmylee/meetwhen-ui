const plugin = require('tailwindcss/plugin');

const focusOnlyPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.focus-only': {
			'&:not(:focus)': {
				position: 'absolute !important' /* Outside the DOM flow */,
				height: '1px',
				width: '1px' /* Nearly collapsed */,
				overflow: 'hidden',
				clip: 'rect(1px, 1px, 1px, 1px)' /* All other browsers */,
			},
		},
	});
});

module.exports = focusOnlyPlugin;
