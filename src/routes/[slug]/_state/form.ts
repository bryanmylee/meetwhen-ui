import type { AddScheduleVars } from '$lib/gql/addSchedule';
import type { Interval } from '$lib/gql/types';
import { withError } from '$lib/utils/with-error';
import { derived } from 'svelte/store';
import { meeting } from './page';

export const intervals = withError<Interval[]>([]);

export const resetForm = (): void => {
  intervals.reset();
};

export const addScheduleVars = derived([meeting, intervals], ([$meeting, $intervals]) => {
  return {
    meetingId: $meeting?.id ?? '',
    intervals: $intervals.value,
  } as AddScheduleVars;
});

export const editScheduleVars = addScheduleVars;
