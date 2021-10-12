const plugin = require('tailwindcss/plugin');

const toShadowString = (...params) =>
	params.map(([x, y, b, s, c]) => `${x}px ${y}px ${b}px ${s}px ${c}`).join(',');

const getShadow = {
	sm: (shade) => toShadowString([0, 1, 2, 0, shade]),
	DEFAULT: (shade1, shade2) => toShadowString([0, 1, 12, 0, shade1], [0, 1, 2, 0, shade2]),
	md: (shade1, shade2) => toShadowString([0, 4, 18, -1, shade1], [0, 2, 4, -1, shade2]),
	lg: (shade1, shade2) => toShadowString([0, 10, 45, -3, shade1], [0, 4, 6, -2, shade2]),
	xl: (shade1, shade2) => toShadowString([0, 20, 25, -5, shade1], [0, 10, 10, -5, shade2]),
};

module.exports = plugin(({ addUtilities, theme }) => {
	addUtilities({
		'.shadow': {
			boxShadow: getShadow.DEFAULT('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.06)'),
		},
		'.shadow-md': {
			boxShadow: getShadow.md('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.06)'),
		},
		'.shadow-lg': {
			boxShadow: getShadow.lg('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.06)'),
		},
		'.shadow-sm-primary': {
			boxShadow: getShadow.sm(theme('colors.primary.fifty'), theme('colors.primary.thirty')),
		},
		'.shadow-primary': {
			boxShadow: getShadow.DEFAULT(theme('colors.primary.fifty'), theme('colors.primary.thirty')),
		},
		'.shadow-md-primary': {
			boxShadow: getShadow.md(theme('colors.primary.fifty'), theme('colors.primary.thirty')),
		},
		'.shadow-lg-primary': {
			boxShadow: getShadow.lg(theme('colors.primary.fifty'), theme('colors.primary.thirty')),
		},
		'.shadow-xl-primary': {
			boxShadow: getShadow.xl(theme('colors.primary.fifty'), theme('colors.primary.thirty')),
		},
	});
});
