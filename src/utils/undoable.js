import { writable, derived, get } from 'svelte/store';

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
  
  const update = (fn) => {
    state.update(({ value, stack, index }) => {
      value = fn(value);
			stack.length = ++index;
			console.log(stack);
			stack[index] = value;
			return ({ value, stack, index });
    });
  };
  
  const set = (value) => {
    update(() => value);
  };
  
  const value = derived(state, ($state) => $state.value);
  const newStore = { subscribe: value.subscribe, update, set };
  const canUndo = derived(state, ({ index }) => index > 0);
  const canRedo = derived(state, ({ index, stack }) => index < stack.length - 1);
  
  return [ newStore, undo, redo, canUndo, canRedo ];
}