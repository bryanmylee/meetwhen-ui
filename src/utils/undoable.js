import { writable, derived } from 'svelte/store';
import isEqual from 'lodash.isequal';

export default function undoable(initialValue) {
  const state = writable({
    value: initialValue,
    stack: [initialValue],
    index: 0,
  });

  const undo = () => {
    state.update(({ value, stack, index }) => {
      if (index <= 0) {
        return { value, stack, index };
      }
      return {
        value: stack[index - 1],
        stack,
        index: index - 1,
      };
    });
  };

  const redo = () => {
    state.update(({ value, stack, index }) => {
      if (index >= stack.length - 1) {
        return { value, stack, index };
      }
      return {
        value: stack[index + 1],
        stack,
        index: index + 1,
      };
    });
  };

  const clearStack = () => {
    state.update(({ value }) => ({ value, stack: [value], index: 0 }));
  };

  const update = (fn) => {
    state.update(({ value, stack, index }) => {
      const newValue = fn(value);
      if (isEqual(newValue, value)) {
        return ({ value, stack, index });
      }
      return {
        value: newValue,
        stack: [...stack, newValue],
        index: index + 1,
      };
    });
  };

  const set = (value) => {
    update(() => value);
  };

  const value = derived(state, ($state) => $state.value);
  const canUndo = derived(state, ({ index }) => index > 0);
  const canRedo = derived(state, ({ index, stack }) => index < stack.length - 1);
  return ({
    subscribe: value.subscribe,
    update,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    clearStack,
  });
}
