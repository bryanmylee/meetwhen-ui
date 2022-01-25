import { writable } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';
import type { Validator } from '$lib/input/utils/validation/Validator';

export interface WithError<T> {
	value: T;
	error: string;
	errors: string[];
}

export interface WithErrorable<T> extends Writable<WithError<T>> {
	reset: () => void;
	resetError: () => void;
}

export interface WithErrorOptions<T> {
	resetErrorOnChange?: boolean;
	validators?: Validator<T>[];
}

export const withError = <T>(
	initialValue: T,
	{ resetErrorOnChange = true, validators = [] }: WithErrorOptions<T> = {},
): WithErrorable<T> => {
	const store = writable<WithError<T>>({
		value: initialValue,
		error: '',
		errors: [],
	});

	let previous: WithError<T> = {
		value: initialValue,
		error: '',
		errors: [],
	};

	const update = (fn: Updater<WithError<T>>) => {
		store.update(($store) => {
			const nextStore = fn($store);
			if (nextStore.value !== previous.value && resetErrorOnChange) {
				nextStore.error = '';
				nextStore.errors = [];
			}
			const nextErrors = validators
				.map((validator) => {
					return validator(nextStore.value).error;
				})
				.filter((error) => error !== '');
			nextStore.errors = nextErrors;
			nextStore.error = nextErrors[0] ?? '';
			previous = { ...nextStore };
			return nextStore;
		});
	};

	const set = (nextStore: WithError<T>) => update(() => nextStore);

	return {
		subscribe: store.subscribe,
		update,
		set,
		reset: () => set({ value: initialValue, error: '', errors: [] }),
		resetError: () =>
			update(($store) => ({ ...$store, error: '', errors: [] })),
	};
};
