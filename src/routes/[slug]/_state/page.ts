import { session } from '$app/stores';
import { derived, writable } from 'svelte/store';
import { meeting } from './form';

export enum ModalState {
  NONE,
  ADD_GUEST,
  ADD_AUTH,
  EDIT_AUTH,
}
export const modalState = writable<ModalState>(ModalState.NONE);

export const isEditing = derived([modalState], ([$modalState]) => $modalState !== ModalState.NONE);

export const isJoined = derived([meeting, session], ([$meeting, $session]) => {
  if ($meeting === null || $session.user === null) {
    return false;
  }
  return (
    $meeting.schedules.find((schedule) => schedule.user.id === $session.user?.id) !== undefined
  );
});
