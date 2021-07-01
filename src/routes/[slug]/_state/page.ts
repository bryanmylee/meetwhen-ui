import { session } from '$app/stores';
import type { Meeting } from '$lib/gql/types';
import { derived, writable } from 'svelte/store';

export const meeting = writable<Meeting>(null);

export type ModalState =
  | 'none'
  | 'add-guest'
  | 'add-auth'
  | 'edit-guest'
  | 'edit-auth'
  | 'login-guest';
export const modalState = writable<ModalState>('none');

export const isEditing = derived([modalState], ([$modalState]) => {
  const editingStates: ModalState[] = ['add-auth', 'add-guest', 'edit-auth', 'edit-guest'];
  return editingStates.includes($modalState);
});

export const isJoined = derived([meeting, session], ([$meeting, $session]) => {
  if ($meeting === null || $session.user === null) {
    return false;
  }
  return (
    $meeting.schedules.find((schedule) => schedule.user.id === $session.user?.id) !== undefined
  );
});

export interface GuestUser {
  id: string;
  name: string;
  guestOf: string;
}

export const guestUser = writable<GuestUser | null>(null);

export const showShare = writable(false);
