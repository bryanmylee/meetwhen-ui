import type { AddGuestScheduleVars } from '$lib/gql/addGuestSchedule';
import type { AddScheduleVars } from '$lib/gql/addSchedule';
import type { Interval } from '$lib/gql/types';
import { withError } from '$lib/utils/with-error';
import { derived } from 'svelte/store';
import { meeting } from './page';

export const username = withError('');
export const password = withError('');
export const intervals = withError<Interval[]>([]);

export const resetForm = (): void => {
  username.reset();
  password.reset();
  intervals.reset();
};

export const addScheduleVars = derived([meeting, intervals], ([$meeting, $intervals]) => {
  return {
    meetingId: $meeting?.id ?? '',
    intervals: $intervals.value,
  } as AddScheduleVars;
});

export const editScheduleVars = addScheduleVars;

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

export const editGuestScheduleVars = addScheduleVars;

export const loginGuestVars = derived(
  [meeting, username, password],
  ([$meeting, $username, $password]) => ({
    meetingId: $meeting?.id ?? '',
    username: $username.value,
    password: $password.value,
  })
);
