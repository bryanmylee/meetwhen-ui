const postcss = require('postcss');
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
					implementation: postcss,
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
			babel: {
				presets: [
					[
						'@babel/preset-env',
						{
							loose: true,
							modules: false,
							targets: { esmodules: true },
						},
					],
				],
			},
		}),
	},
	webpackFinal: async (config) => {
		config.resolve = {
			alias: {
				$lib: `${__dirname}/../src/lib`,
			},
			extensions: ['.js', '.ts'],
		};
		return config;
	},
};
