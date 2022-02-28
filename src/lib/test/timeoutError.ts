import { Updater, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

export const timeoutError = <T>(
	init: T,
	timeout = 2000,
): [Writable<T>, Readable<string>] => {
	const value = writable(init);
	const error = writable('');
	let timeoutId = 0;
	const update = (fn: Updater<T>) => {
		error.set('');
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			error.set(`${timeout}ms timeout`);
		}, timeout);
		value.update(fn);
	};
	const set = (newValue: T) => update(() => newValue);
	return [
		{
			subscribe: value.subscribe,
			update,
			set,
		},
		{
			subscribe: error.subscribe,
		},
	];
};
