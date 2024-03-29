const plugin = require('tailwindcss/plugin');

const cardPlugin = plugin(({ addComponents }) => {
	addComponents({
		'.card': {
			'@apply rounded-xl shadow-md-wide bg-white gdark:bg-neutral-800': {},
		},
	});
});

module.exports = cardPlugin;
