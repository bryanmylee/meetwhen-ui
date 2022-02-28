import { getContext, setContext } from 'svelte';

export type PairedContext<T> = [() => T, (context: T) => void];

export const pairedContext = <T>(): PairedContext<T> => {
	const KEY = {};
	return [() => getContext<T>(KEY), (context: T) => setContext(KEY, context)];
};
