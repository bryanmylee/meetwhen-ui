import { pairedContext } from '$lib/core/utils/pairedContext';
import { readable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

export const { set: setLoading, get: _getLoading } =
	pairedContext<Writable<boolean>>();

export const getLoading = (): Readable<boolean> => {
	const isLoading = _getLoading();
	if (isLoading === undefined) {
		return readable(false);
	}
	return isLoading;
};

export const withLoading = <T extends unknown, U>(
	isLoading: Writable<boolean>,
	fn: (...args: T[]) => Promise<U>,
): ((...args: T[]) => Promise<U>) => {
	return async (...args: T[]) => {
		isLoading.set(true);
		const result = await fn(...args);
		isLoading.set(false);
		return result;
	};
};
