import { writable, derived } from 'svelte/store';
import isEqual from 'lodash.isequal';

export default function undoable(initialValue) {
  const state = writable({
    value: initialValue,
    stack: [initialValue],
    currentIndex: 0,
  });

  function undo() {
    state.update(({ value, stack, currentIndex }) => {
      if (currentIndex <= 0) {
        return { value, stack, currentIndex };
      }
      return {
        value: stack[currentIndex - 1],
        stack,
        currentIndex: currentIndex - 1,
      };
    });
  }

  function redo() {
    state.update(({ value, stack, currentIndex }) => {
      if (currentIndex >= stack.length - 1) {
        return { value, stack, currentIndex };
      }
      return {
        value: stack[currentIndex + 1],
        stack,
        currentIndex: currentIndex + 1,
      };
    });
  }

  function clearStack() {
    state.update(({ value }) => ({ value, stack: [value], currentIndex: 0}));
  }

  function update(fn) {
    state.update(({ value, stack, currentIndex }) => {
      const newValue = fn(value);
      if (isEqual(newValue, value)) {
        return { value, stack, currentIndex };
      }
      return {
        value: newValue,
        stack: [...stack.slice(0, currentIndex + 1), newValue],
        currentIndex: currentIndex + 1,
      };
    });
  }

  function set(newValue) {
    update(() => newValue);
  }

  const value = derived(state, ($state) => $state.value);
  const canUndo = derived(state, ({ currentIndex }) => currentIndex > 0);
  const canRedo = derived(state, ({ currentIndex, stack }) => currentIndex < stack.length - 1);
  return {
    subscribe: value.subscribe,
    update,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    clearStack,
  };
}
