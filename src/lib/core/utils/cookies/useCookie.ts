import { writable } from 'svelte/store';
import type { Updater, Writable } from 'svelte/store';
import { setCookie } from '.';

export const useCookie = <T extends string>(
	name: string,
	initValue: T,
): Writable<T> => {
	const value = writable<T>(initValue);
	const update = (fn: Updater<T>) => {
		value.update(($value) => {
			const newValue = fn($value);
			setCookie(undefined, name, newValue, { path: '/' });
			return newValue;
		});
	};
	return {
		subscribe: value.subscribe,
		update,
		set: (newValue) => update(() => newValue),
	};
};
