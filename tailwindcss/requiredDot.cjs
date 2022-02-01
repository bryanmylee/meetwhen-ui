const plugin = require('tailwindcss/plugin');

const requiredDot = plugin(({ addUtilities }) => {
	addUtilities({
		'.required-dot': {
			'&::after': {
				content: '"•"',
				'@apply ml-1 text-red-400': {},
			},
		},
	});
});

module.exports = requiredDot;
