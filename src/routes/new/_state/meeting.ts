import type { AddMeetingVars } from '$lib/gql/addMeeting';
import { derived, writable } from 'svelte/store';
import { intervals } from './intervals';

export const newEventName = writable('');
export const meetingInput = derived([newEventName, intervals], ([$newEventName, $intervals]) => {
  return {
    name: $newEventName,
    intervals: $intervals,
  } as AddMeetingVars;
});
