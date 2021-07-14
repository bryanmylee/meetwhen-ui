import type { AddMeetingVars } from '$lib/gql/addMeeting';
import { derived, writable } from 'svelte/store';
import { intervals } from './intervals';

export const name = writable('');
export const emoji = writable('📘');
export const meetingInput = derived([name, emoji, intervals], ([$name, $emoji, $intervals]) => {
  return {
    name: $name,
    emoji: $emoji,
    intervals: $intervals,
  } as AddMeetingVars;
});
