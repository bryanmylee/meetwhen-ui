import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface UseLocalOptions<T> {
	init?: T;
	code?: Coder<T>;
}

type Encoder<T> = (value: T) => string;
type Decoder<T> = (str: string) => T;
type Coder<T> = [Encoder<T>, Decoder<T>];

export const IDENTITY = <T>(): Coder<T> => [
	(v: T): string => v as unknown as string,
	(v: string): T => v as unknown as T,
];
export const STRING: Coder<string> = [(v: string): string => v, (v: string): string => v];
export const NUMBER: Coder<number> = [
	(v: number): string => v.toString(),
	(v: string): number => parseFloat(v),
];
export const BOOLEAN: Coder<boolean> = [
	(v: boolean): string => v.toString(),
	(v: string): boolean => v === 'true',
];

export const useLocal = <T>(key: string, options?: UseLocalOptions<T>): Writable<T> => {
	const [encode, decode] = options?.code ?? IDENTITY();

	const setLocalStorage = (value: T) => {
		if (typeof window === 'undefined') {
			return;
		}
		if (value !== undefined) {
			window.localStorage.setItem(key, encode(value));
		} else {
			window.localStorage.removeItem(key);
		}
	};

	const getLocalStorage = () => {
		if (typeof window === 'undefined') {
			return;
		}
		const result = window.localStorage.getItem(key);
		if (result == null) {
			return undefined;
		}
		return decode(result);
	};

	const initialValue = options?.init ?? getLocalStorage();

	const store = writable(initialValue, () => {
		if (typeof window === 'undefined') {
			return;
		}
		window.addEventListener('storage', handleStorageUpdate);
		return () => {
			window.removeEventListener('storage', handleStorageUpdate);
		};
	});

	let currentValue: T;
	const handleStorageUpdate = () => {
		const storedValue = getLocalStorage();
		if (currentValue !== storedValue) {
			currentValue = storedValue;
			store.set(storedValue);
		}
	};

	const updateStoreAndLocal = (fn: (v: T) => T) => {
		store.update(($store) => {
			currentValue = fn($store);
			setLocalStorage(currentValue);
			return currentValue;
		});
	};

	return {
		subscribe: store.subscribe,
		update: updateStoreAndLocal,
		set: (value: T) => updateStoreAndLocal(() => value),
	};
};
