import { newEventName } from '$lib/app-state';
import type { AddMeetingVars } from '$lib/gql/addMeeting';
import { derived } from 'svelte/store';
import { intervals } from './intervals';

export const meetingInput = derived([newEventName, intervals], ([$newEventName, $intervals]) => {
  return {
    name: $newEventName,
    intervals: $intervals,
  } as AddMeetingVars;
});
