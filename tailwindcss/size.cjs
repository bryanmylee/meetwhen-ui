const plugin = require('tailwindcss/plugin');

const sizePlugin = plugin(({ addUtilities, theme, e }) => {
	const widths = theme('width', {});
	const utilityEntries = Object.entries(widths)
		.map(([sizeKey, size]) => [
			'.' + e(`wh-${sizeKey}`),
			{ width: size, height: size },
		])
		.filter(([sizeKey]) => sizeKey !== 'screen');
	addUtilities(Object.fromEntries(utilityEntries));
});

module.exports = {
	size: sizePlugin,
};
