import '../src/app.css';
import ColorDecorator from './ColorDecorator.svelte';

export const decorators = [() => ColorDecorator];

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	darkMode: {
		darkClass: 'dark',
		classTarget: 'html',
		stylePreview: true,
	},
};
