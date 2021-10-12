import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export interface WithError<T> {
	value: T;
	error: string;
}

export interface WithErrorStore<T> extends Writable<WithError<T>> {
	reset: () => void;
}

export const withError = <T>(initialValue: T, resetErrorOnChange = true): WithErrorStore<T> => {
	const store = writable<WithError<T>>({
		value: initialValue,
		error: '',
	});

	let previous: WithError<T> = {
		value: initialValue,
		error: '',
	};

	const update = (fn: (v: WithError<T>) => WithError<T>) => {
		store.update(($store) => {
			const newStore = fn($store);
			if (newStore.value !== previous.value && resetErrorOnChange) {
				newStore.error = '';
			}
			previous = { ...newStore };
			return newStore;
		});
	};

	const set = (newValue: WithError<T>) => update(() => newValue);

	return {
		subscribe: store.subscribe,
		update,
		set,
		reset: () => set({ value: initialValue, error: '' }),
	};
};
