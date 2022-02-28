import { derived } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';

export const bound = <T, U>(
	other: Writable<T>,
	from: (t: T) => U,
	to: (u: U) => T,
): Writable<U> => {
	const { subscribe } = derived(other, from);
	const update = (fn: Updater<U>) => {
		other.update((old) => {
			return to(fn(from(old)));
		});
	};
	const set = (value: U) => {
		other.set(to(value));
	};
	return {
		subscribe,
		update,
		set,
	};
};
