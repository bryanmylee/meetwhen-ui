import type { Schedule } from '$lib/gql/types';
import { derived, writable } from 'svelte/store';
import { getLocalIntervals } from '../utils/intervals';
import { unionSchedules } from '../utils/schedules';

// Logic for all user schedules and the nested intervals.

export const schedules = writable<Schedule[]>([]);

export const intervalsWithUsers = derived([schedules], ([$schedules]) =>
  getLocalIntervals(unionSchedules($schedules))
);
