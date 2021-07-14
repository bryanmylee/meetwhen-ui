import type { AddMeetingVars } from '$lib/gql/addMeeting';
import { derived, writable } from 'svelte/store';
import { intervals } from './intervals';

export const name = writable('');
export const emoji = writable('📘');
export const color = writable('#29a3e0');
export const meetingInput = derived(
  [name, emoji, color, intervals],
  ([$name, $emoji, $color, $intervals]) => {
    return {
      name: $name,
      emoji: $emoji,
      color: $color,
      intervals: $intervals,
    } as AddMeetingVars;
  }
);
