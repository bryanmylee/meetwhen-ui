import { writable } from 'svelte/store';

export const isCreatingNewSelection = writable(false);

export const dragDropStates = {
  NONE: 'NONE',
  MOVING: 'MOVING',
  RESIZING_TOP: 'RESIZING_TOP',
  RESIZING_BOTTOM: 'RESIZING_BOTTOM',
};

export const dragDropState = writable(dragDropStates.NONE);
