import { writable } from 'svelte/store';

class History {
  constructor(initialState) {
    this.states = [ initialState ];
    this.currentIndex = 0;
  }

  current() {
    return this.states[this.currentIndex];
  }

  push(state) {
    // Remove all redo states
    if (this.canRedo()) {
      this.states.splice(this.currentIndex + 1);
    }
    // Add the new state
    this.currentIndex++;
    this.states.push(state);
  }

  undo() {
    if (this.canUndo()) {
      this.currentIndex--;
    }
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
    }
  }

  canRedo() {
    return this.currentIndex < this.states.length - 1;
  }
}

// Creates a new local history stack wherever called.
// Useful for separating history stacks between pages.
export function createHistory(initialState) {
  const { subscribe, update } = writable(new History(initialState));

  return {
    subscribe,
    push: (newState) => update((hist) => {
      hist.push({
        // Merge the previous state with any new pieces of state
        ...hist.current(),
        ...newState,
      });
      return hist;
    }),
    undo: () => update((hist) => {
      hist.undo();
      console.log(hist);
      return hist;
    }),
    redo: () => update((hist) => {
      hist.redo();
      return hist;
    }),
  };
}
