const plugin = require('tailwindcss/plugin');

const focusOnlyPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.focus-only': {
			'&:not(:focus)': {
				position: 'absolute' /* Outside the DOM flow */,
				border: '0',
				margin: '-1px',
				padding: '0',
				height: '1px',
				width: '1px' /* Nearly collapsed */,
				overflow: 'hidden',
				clip: 'rect(1px, 1px, 1px, 1px)' /* All other browsers */,
			},
		},
	});
});

module.exports = focusOnlyPlugin;
