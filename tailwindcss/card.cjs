const plugin = require('tailwindcss/plugin');

const cardPlugin = plugin(({ addComponents }) => {
	addComponents({
		'.card': {
			'@apply ring-1 ring-neutral-100 gdark:ring-neutral-600': {},
			'@apply rounded-xl shadow bg-shade-0': {},
		},
	});
});

module.exports = cardPlugin;
