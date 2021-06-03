import { derived, writable } from 'svelte/store';

export enum ModalState {
  NONE,
  ADD_GUEST,
  ADD_AUTH,
}
export const modalState = writable<ModalState>(ModalState.NONE);

export const isEditing = derived([modalState], ([$modalState]) => $modalState !== ModalState.NONE);
