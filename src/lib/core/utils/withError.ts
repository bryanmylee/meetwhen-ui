import { writable } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';

export interface WithError<T> {
	value: T;
	error: string;
}

export interface WithErrorable<T> extends Writable<WithError<T>> {
	reset: () => void;
	resetError: () => void;
}

export interface WithErrorOptions {
	resetErrorOnChange?: boolean;
}

export const withError = <T>(
	initialValue: T,
	{ resetErrorOnChange = true }: WithErrorOptions = {},
): WithErrorable<T> => {
	const store = writable<WithError<T>>({
		value: initialValue,
		error: '',
	});

	let previous: WithError<T> = {
		value: initialValue,
		error: '',
	};

	const update = (fn: Updater<WithError<T>>) => {
		store.update(($store) => {
			const nextStore = fn($store);
			if (nextStore.value !== previous.value && resetErrorOnChange) {
				nextStore.error = '';
			}
			previous = { ...nextStore };
			return nextStore;
		});
	};

	const set = (nextStore: WithError<T>) => update(() => nextStore);

	return {
		subscribe: store.subscribe,
		update,
		set,
		reset: () => set({ value: initialValue, error: '' }),
		resetError: () => update(($store) => ({ ...$store, error: '' })),
	};
};
