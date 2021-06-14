import type { AddGuestScheduleVars } from '$lib/gql/addGuestSchedule';
import type { AddScheduleVars } from '$lib/gql/addSchedule';
import type { Interval } from '$lib/gql/types';
import { withError } from '$lib/utils/with-error';
import { derived, writable } from 'svelte/store';

export const meetingId = writable('');
export const username = withError('');
export const password = withError('');
export const intervals = withError<Interval[]>([]);

export const resetForm = (): void => {
  username.reset();
  password.reset();
  intervals.reset();
};

export const addGuestScheduleVars = derived(
  [meetingId, username, password, intervals],
  ([$meetingId, $username, $password, $intervals]) => {
    return {
      meetingId: $meetingId,
      username: $username.value,
      password: $password.value,
      intervals: $intervals.value,
    } as AddGuestScheduleVars;
  }
);

export const addScheduleVars = derived(
  [meetingId, intervals],
  ([$meetingId, $intervals]) => {
    return {
      meetingId: $meetingId,
      intervals: $intervals.value,
    } as AddScheduleVars;
  }
);
