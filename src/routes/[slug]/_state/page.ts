import { writable } from 'svelte/store';

export enum ModalState {}
export const showAddGuest = writable(false);
export const showConfirm = writable(false);
