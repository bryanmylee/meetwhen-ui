import { writable } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';
import type { Validator } from '$lib/input/utils/validation/Validator';
import type { Action } from '../types/Action';

export interface WithError<T> {
	value: T;
	touched: boolean;
	error: string;
	errors: string[];
}

export interface WithErrorable<T> extends Writable<WithError<T>> {
	reset: () => void;
	resetError: () => void;
	validate: () => void;
	touch: Action;
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
		touched: false,
		error: '',
		errors: [],
	});

	let previous: WithError<T> = {
		value: initialValue,
		touched: false,
		error: '',
		errors: [],
	};

	const update = (fn: Updater<WithError<T>>) => {
		store.update(($store) => {
			const nextStore = fn($store);
			if (nextStore.value !== previous.value && resetErrorOnChange) {
				nextStore.error = '';
				nextStore.errors = [];
				nextStore.touched = false;
			}
			if (nextStore.touched) {
				validate();
			}
			previous = { ...nextStore };
			return nextStore;
		});
	};

	const set = (nextStore: WithError<T>) => update(() => nextStore);

	const validate = () => {
		store.update(($store) => {
			const errors = validators
				.map((validator) => {
					return validator($store.value).error;
				})
				.filter((error) => error !== '');
			return {
				...$store,
				error: errors[0] ?? '',
				errors,
			};
		});
	};

	/*
	 * in only: entered the parent.
	 * out, in: entered child.
	 * out only: exited the parent.
	 */
	const touch: Action = (node) => {
		let focusedIn = false;
		let focusedOut = false;
		const handleFocusOut = () => {
			focusedOut = true;
			setTimeout(() => {
				if (focusedOut && !focusedIn) {
					store.update(($store) => ({
						...$store,
						touched: true,
					}));
				}
				focusedIn = false;
				focusedOut = false;
			});
		};
		const handleFocusIn = () => {
			focusedIn = true;
			setTimeout(() => {
				focusedIn = false;
			});
		};
		node.addEventListener('focusout', handleFocusOut);
		node.addEventListener('focusin', handleFocusIn);
		return {
			destroy() {
				node.removeEventListener('focusout', handleFocusOut);
				node.removeEventListener('focusin', handleFocusIn);
			},
		};
	};

	return {
		subscribe: store.subscribe,
		update,
		set,
		touch,
		reset: () =>
			set({ value: initialValue, touched: false, error: '', errors: [] }),
		resetError: () =>
			update(($store) => ({ ...$store, error: '', errors: [] })),
		validate,
	};
};
