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

export const isHttpUrl: Validator<string> = (value) => {
	try {
		const url = new URL(value);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			throw new Error();
		}
		return {
			error: '',
		};
	} catch {
		return {
			error: 'Please enter a valid link',
		};
	}
};
