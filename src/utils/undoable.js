import { writable, derived, get } from 'svelte/store';
import isEqual from 'lodash.isequal';

export default function undoable(initialValue) {
  const state = writable({
    value: initialValue,
    stack: [ initialValue ],
		index: 0,
  });

  const undo = () => {
    state.update(({ value, stack, index }) => {
			if (index > 0) value = stack[--index];
      return { value, stack, index };
    });
  };

  const redo = () => {
    state.update(({ value, stack, index }) => {
			if (index < stack.length - 1) value = stack[++index];
      return { value, stack, index };
    });
  };

  const clearStack = () => {
    state.update(({ value, stack, index }) => {
      stack = [ value ];
      index = 0;
      return { value, stack, index };
    })
  }

  const update = (fn) => {
    state.update(({ value, stack, index }) => {
			const newValue = fn(value);
			if (isEqual(newValue, value)) {
				return ({ value, stack, index });
			}
			stack.length = ++index;
			stack[index] = newValue;
			return ({ value: newValue, stack, index });
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
    update, set,
    undo, redo,
    canUndo, canRedo,
    clearStack,
  });
}