const plugin = require('tailwindcss/plugin');

const brandPlugin = plugin(({ addComponents }) => {
	addComponents({
		'.text-brand': {
			'@apply font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400-2 via-primary-400 to-primary-400+1':
				{},
		},
	});
});

module.exports = brandPlugin;
