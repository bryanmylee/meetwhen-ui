import { getContext, setContext } from 'svelte';

export interface PairedContext<T> {
	get: () => T;
	set: (context: T) => void;
}

export const pairedContext = <T>(): PairedContext<T> => {
	const KEY = {};
	return {
		get: () => getContext<T>(KEY),
		set: (context: T) => setContext(KEY, context),
	};
};
