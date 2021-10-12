module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	plugins: ['svelte3', '@typescript-eslint', 'import'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		'svelte3/ignore-styles': ({ lang, global }) => global || lang === 'postcss',
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	globals: {
		NodeJS: true,
	},
};
