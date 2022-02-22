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

export const withLoading = <Args extends unknown[], Return>(
	isLoading: Writable<boolean>,
	fn: (...args: Args) => Promise<Return>,
): ((...args: Args) => Promise<Return>) => {
	return async (...args: Args) => {
		isLoading.set(true);
		const result = await fn(...args);
		isLoading.set(false);
		return result;
	};
};
