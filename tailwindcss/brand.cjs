const plugin = require('tailwindcss/plugin');

const brandPlugin = plugin(({ addComponents }) => {
	addComponents({
		'.text-brand': {
			'@apply font-semibold !text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-400':
				{},
		},
	});
});

module.exports = brandPlugin;
