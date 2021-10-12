import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
/**
 * All Loading components must be used in a context with setLoadingContext.
 */
export const IS_LOADING = 'is-loading';
export type IsLoading = Writable<boolean>;

export const setLoadingContext = (init: boolean): IsLoading => {
	const isLoading = writable(init);
	setContext(IS_LOADING, isLoading);
	return isLoading;
};

export const getLoadingContext = (): IsLoading => {
	const isLoading = getContext<IsLoading>(IS_LOADING);
	if (isLoading === undefined) {
		throw new Error('Loading component used without loading context');
	}
	return isLoading;
};

export const withLoading = <T extends unknown, U>(
	isLoading: IsLoading,
	fn: (...args: T[]) => Promise<U>
): ((...args: T[]) => Promise<U>) => {
	return async (...args: T[]) => {
		isLoading.set(true);
		const result = await fn(...args);
		isLoading.set(false);
		return result;
	};
};
