import { session } from '$app/stores';
import type { Meeting } from '$lib/gql/types';
import { derived, writable } from 'svelte/store';

export const meeting = writable<Meeting>(null);

export type PageState =
  | 'none'
  | 'add-guest'
  | 'add-auth'
  | 'edit-guest'
  | 'edit-auth'
  | 'login-guest';
export const pageState = writable<PageState>('none');

export const isEditing = derived([pageState], ([$pageState]) => {
  const editingStates: PageState[] = ['add-auth', 'add-guest', 'edit-auth', 'edit-guest'];
  return editingStates.includes($pageState);
});

export const isJoined = derived([meeting, session], ([$meeting, $session]) => {
  if ($meeting === null || $session.user === null) {
    return false;
  }
  return (
    $meeting.schedules.find((schedule) => schedule.user.id === $session.user?.id) !== undefined
  );
});

export const showShare = writable(false);
