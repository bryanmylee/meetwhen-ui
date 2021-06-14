import { session } from '$app/stores';
import type { AddGuestScheduleVars } from '$lib/gql/addGuestSchedule';
import type { AddScheduleVars } from '$lib/gql/addSchedule';
import type { Interval, Meeting } from '$lib/gql/types';
import { withError } from '$lib/utils/with-error';
import { derived, writable } from 'svelte/store';

export const meeting = writable<Meeting>(null);
export const username = withError('');
export const password = withError('');
export const intervals = withError<Interval[]>([]);

export const resetForm = (): void => {
  username.reset();
  password.reset();
  intervals.reset();
};

export const addGuestScheduleVars = derived(
  [meeting, username, password, intervals],
  ([$meeting, $username, $password, $intervals]) => {
    return {
      meetingId: $meeting?.id ?? '',
      username: $username.value,
      password: $password.value,
      intervals: $intervals.value,
    } as AddGuestScheduleVars;
  }
);

export const addScheduleVars = derived(
  [meeting, intervals],
  ([$meeting, $intervals]) => {
    return {
      meetingId: $meeting?.id ?? '',
      intervals: $intervals.value,
    } as AddScheduleVars;
  }
);

export const editScheduleVars = addScheduleVars;

export const editGuestScheduleVars = derived([editScheduleVars, session], ([$editScheduleVars, $session]) => ({
  token: $session.token,
  ...$editScheduleVars,
}));
