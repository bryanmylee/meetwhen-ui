import type { GetValidator } from './Validator';

export interface ArrayNotEmptyProps {
	errorMessage?: string;
}

export const arrayNotEmpty: GetValidator<unknown[], ArrayNotEmptyProps> =
	({ errorMessage = 'Cannot be empty' } = {}) =>
	(value) => {
		if (value.length === 0) {
			return {
				error: errorMessage,
			};
		}
		return {
			error: '',
		};
	};
