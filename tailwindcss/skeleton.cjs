const plugin = require('tailwindcss/plugin');

const skeletonPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		'.skeleton-text': {
			'@apply text-transparent bg-shade-100 animate-pulse rounded w-fit': {},
		},
	});
});

module.exports = skeletonPlugin;
