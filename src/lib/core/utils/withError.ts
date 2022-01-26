import { writable } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';
import type { Validator } from '$lib/input/utils/validation/Validator';
import type { Action } from '../types/Action';

export interface WithError<T> {
	value: T;
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
				touched.set(false);
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

	const touched = writable(false);
	const unsubTouched = touched.subscribe(($touched) => {
		if ($touched) {
			validate();
		}
	});

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
					touched.set(true);
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
		subscribe(run, invalidate) {
			const unsubStore = store.subscribe(run, invalidate);
			return () => {
				unsubStore();
				unsubTouched();
			};
		},
		update,
		set,
		touch,
		reset: () => set({ value: initialValue, error: '', errors: [] }),
		resetError: () =>
			update(($store) => ({ ...$store, error: '', errors: [] })),
		validate,
	};
};
