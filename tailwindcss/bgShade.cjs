const plugin = require('tailwindcss/plugin');

const bgShadePlugin = plugin(({ addUtilities, theme }) => {
	const grades = [50, 100, 200, 300, 400, 500, 600, 700];
	const neutrals = theme('colors.neutral', {});
	const shadeUtilities = {};
	for (let i = 0; i < grades.length; i++) {
		const lightKey = grades[i];
		const darkKey = grades[grades.length - 1 - i];
		shadeUtilities[`.bg-shade-${lightKey}`] = {
			backgroundColor: neutrals[lightKey],
			':global(.dark) &': {
				backgroundColor: neutrals[darkKey],
			},
		};
	}
	addUtilities(shadeUtilities);
});

module.exports = bgShadePlugin;
