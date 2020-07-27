import { writable } from 'svelte/store';

export const isSelecting = writable(false);
export const dragDropState = writable('NONE');
