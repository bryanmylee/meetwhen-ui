// Each action takes the previous dependent states and returns the updated value.
type Action = ([index, focusedIndex, maxIndex, showDropdown]: [
  number,
  number,
  number,
  boolean
]) => [number, number, number, boolean];

const getDecremented = (n: number) => (n > 0 ? n - 1 : n);
const getIncremented = (n: number, max: number) => (n < max ? n + 1 : n);

export const keyActions: Record<string, Action> = {
  ArrowUp: ([index, focusedIndex, maxIndex, showDropdown]) => {
    if (showDropdown) {
      return [index, getDecremented(focusedIndex), maxIndex, showDropdown];
    }
    return [getDecremented(index), focusedIndex, maxIndex, showDropdown];
  },
  ArrowDown: ([index, focusedIndex, maxIndex, showDropdown]) => {
    if (showDropdown) {
      return [index, getIncremented(focusedIndex, maxIndex), maxIndex, showDropdown];
    }
    return [getIncremented(index, maxIndex), focusedIndex, maxIndex, showDropdown];
  },
  Escape: ([index, focusedIndex, maxIndex]) => {
    return [index, focusedIndex, maxIndex, false];
  },
  Tab: ([index, focusedIndex, maxIndex, showDropdown]) => {
    if (showDropdown) {
      return [focusedIndex, focusedIndex, maxIndex, false];
    }
    return [index, focusedIndex, maxIndex, false];
  },
  ' ': ([index, focusedIndex, maxIndex, showDropdown]) => {
    if (showDropdown) {
      return [focusedIndex, focusedIndex, maxIndex, !showDropdown];
    }
    return [index, index, maxIndex, !showDropdown];
  },
  get Enter() {
    return this[' '];
  },
};
