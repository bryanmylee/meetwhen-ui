import jsCookies from 'js-cookie';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const useCookie = <T extends string>(key: string): Writable<T> => {
	const initialValue = jsCookies.get(key) ?? '';
	const store = writable<T>(initialValue);

	const setCookie = (value: T) => {
		jsCookies.set(key, value);
	};

	const updateStoreAndCookie = (fn: (v: T) => T) => {
		store.update(($store) => {
			const currentValue = fn($store);
			setCookie(currentValue);
			return currentValue;
		});
	};

	return {
		subscribe: store.subscribe,
		update: updateStoreAndCookie,
		set: (value: T) => updateStoreAndCookie(() => value),
	};
};
