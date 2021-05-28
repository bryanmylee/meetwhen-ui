import type { AddMeetingVars } from '$lib/gql/addMeeting';
import { derived, writable } from 'svelte/store';
import { intervals } from './intervals';

export const newMeetingName = writable('');
export const meetingInput = derived(
  [newMeetingName, intervals],
  ([$newMeetingName, $intervals]) => {
    return {
      name: $newMeetingName,
      intervals: $intervals,
    } as AddMeetingVars;
  }
);
