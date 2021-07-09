import type { ShallowMeeting } from '$lib/gql/types';
import { groupById } from '$lib/utils/group-by-id';
import { derived, writable } from 'svelte/store';

export const joinedMeetings = writable<ShallowMeeting[]>([]);
export const ownedMeetings = writable<ShallowMeeting[]>([]);

export const joinedMeetingsById = derived([joinedMeetings], ([$joinedMeetings]) =>
  groupById($joinedMeetings)
);
export const ownedMeetingsById = derived([ownedMeetings], ([$ownedMeetings]) =>
  groupById($ownedMeetings)
);
export const meetingsById = derived(
  [joinedMeetingsById, ownedMeetingsById],
  ([$joinedMeetingsById, $ownedMeetingsById]) => ({
    ...$joinedMeetingsById,
    ...$ownedMeetingsById,
  })
);
export const meetings = derived([meetingsById], ([$meetingsById]) => Object.values($meetingsById));
export const upcomingMeetings = derived([meetings], ([$meetings]) => {
  return $meetings;
});
