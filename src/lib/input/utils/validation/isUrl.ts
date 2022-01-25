import type { Validator } from './Validator';

export const isUrl: Validator<string> = (value) => {
	try {
		new URL(value);
		return {
			error: '',
		};
	} catch (error) {
		return {
			error: 'Please enter a valid link',
		};
	}
};
