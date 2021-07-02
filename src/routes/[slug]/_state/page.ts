import { session } from '$app/stores';
import type { Meeting } from '$lib/gql/types';
import { derived, writable } from 'svelte/store';

export const meeting = writable<Meeting>(null);

export type PageState = 'none' | 'joining' | 'editing';
export const pageState = writable<PageState>('none');

const EDITING_STATES: PageState[] = ['joining', 'editing'];
export const isEditing = derived([pageState], ([$pageState]) => {
  return EDITING_STATES.includes($pageState);
});

export const isUserJoined = derived([meeting, session], ([$meeting, $session]) => {
  if ($meeting === null || $session.user === null) {
    return false;
  }
  return (
    $meeting.schedules.find((schedule) => schedule.user.id === $session.user?.id) !== undefined
  );
});

export const showShare = writable(false);
