import { writable, Writable } from 'svelte/store';

export interface WithError<T> {
  value: T;
  error: string;
}

export const withError = <T>(
  initialValue: T,
  resetErrorOnChange = true
): Writable<WithError<T>> => {
  const store = writable<WithError<T>>({
    value: initialValue,
    error: '',
  });

  let previous: WithError<T> = {
    value: initialValue,
    error: '',
  };

  const updateStore = (fn: (v: WithError<T>) => WithError<T>) => {
    store.update(($store) => {
      const newStore = fn($store);
      console.log({ new: newStore, old: previous });
      if (newStore.value !== previous.value && resetErrorOnChange) {
        newStore.error = '';
      }
      previous = { ...newStore };
      return newStore;
    });
  };

  return {
    subscribe: store.subscribe,
    update: updateStore,
    set: (newStore: WithError<T>) => updateStore(() => newStore),
  };
};
