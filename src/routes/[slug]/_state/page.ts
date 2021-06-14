import { session } from '$app/stores';
import { derived, writable } from 'svelte/store';
import { meeting } from './form';

export type ModalState = 'none' | 'add-guest' | 'add-auth' | 'edit-guest' | 'edit-auth' | 'login-guest';
export const modalState = writable<ModalState>('none');

export const isEditing = derived([modalState], ([$modalState]) => {
  const editingStates: ModalState[] = ['add-auth', 'add-guest', 'edit-auth'];
  return editingStates.includes($modalState)
});

export const isJoined = derived([meeting, session], ([$meeting, $session]) => {
  if ($meeting === null || $session.user === null) {
    return false;
  }
  return (
    $meeting.schedules.find((schedule) => schedule.user.id === $session.user?.id) !== undefined
  );
});
