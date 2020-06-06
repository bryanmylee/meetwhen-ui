import { writable } from 'svelte/store';

export const isSelecting = writable(false);

export const user = writable({});