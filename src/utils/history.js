import { writable, derived } from 'svelte/store';

class History {
  constructor(initialState) {
    this.stack = [ initialState ];
    this.index = 0;
  }

  current() {
    return this.stack[this.index];
  }

  push(state) {
    // Remove all redo stack
    if (this.canRedo()) {
      this.stack.splice(this.index + 1);
    }
    // Add the new state
    this.index++;
    this.stack.push(state);
  }

  undo() {
    if (this.canUndo()) {
      this.index--;
    }
  }

  canUndo() {
    return this.index > 0;
  }

  redo() {
    if (this.canRedo()) {
      this.index++;
    }
  }

  canRedo() {
    return this.index < this.stack.length - 1;
  }
}

// Creates a new local history stack wherever called.
// Useful for separating history stacks between pages.
export function createHistory(initialState) {
  const history = writable(new History(initialState));
  const state = derived(history, $history => $history.current());

  return {
    subscribe: state.subscribe,
    set: (newState) => history.update((hist) => {
      hist.push({
        ...hist.current(),
        ...newState,
      });
      return hist;
    }),
    push: (newState) => history.update((hist) => {
      hist.push({
        // Merge the previous state with any new pieces of state
        ...hist.current(),
        ...newState,
      });
      return hist;
    }),
    undo: () => history.update((hist) => {
      hist.undo();
      return hist;
    }),
    redo: () => history.update((hist) => {
      hist.redo();
      return hist;
    }),
  };
}
