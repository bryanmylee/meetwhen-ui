const path = require('path');
const preprocess = require('svelte-preprocess');

module.exports = {
	stories: [
		'../src/**/*.stories.mdx',
		'../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-svelte-csf',
		{
			name: '@storybook/addon-postcss',
			options: {
				postcssLoaderOptions: {
					implementation: require('postcss'),
				},
			},
		},
		'storybook-dark-mode',
	],
	framework: '@storybook/svelte',
	svelteOptions: {
		preprocess: preprocess({
			postcss: true,
			typescript: {
				compilerOptions: {
					target: 'es2018',
				},
			},
		}),
	},
	webpackFinal: async (config) => ({
		...config,
		resolve: {
			alias: {
				$lib: path.resolve(__dirname, '..', 'src', 'lib'),
			},
			extensions: ['.js', '.ts'],
		},
	}),
};
