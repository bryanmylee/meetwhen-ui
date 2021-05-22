import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface UseLocalOptions<T> {
  initialValue?: T;
  encode?: (value: T) => string;
  decode?: (value: string) => T;
}

export const useLocal = <T>(key: string, options?: UseLocalOptions<T>): Writable<T> => {
  if (
    !(typeof options?.initialValue === 'string') &&
    !(options?.initialValue instanceof String) &&
    (options?.encode === undefined || options?.decode === undefined)
  ) {
    throw new Error('An encoder and decoder must be provided for non-string data');
  }

  const encode = options?.encode ?? ((value: T) => (value as unknown) as string);
  const decode = options?.decode ?? ((value: string) => (value as unknown) as T);

  const setLocalStorage = (value: T) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (value !== undefined) {
      window.localStorage.setItem(key, encode(value));
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

  const initialValue = options?.initialValue ?? getLocalStorage();

  const store = writable(initialValue, () => {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  });
  setLocalStorage(options?.initialValue);

  let currentValue: T;
  const handleStorageUpdate = () => {
    const storedValue = getLocalStorage();
    if (currentValue !== storedValue) {
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
