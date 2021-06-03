import type { Interval } from '$lib/gql/types';
import { derived, writable } from 'svelte/store';
import { fromId, getLocalIntervals, unionIntervals } from '../utils/intervals';

// Base functionality.
export const hourStepSize = writable(0.5);

export const getIntervalsFromIds = derived(
  [hourStepSize],
  ([$hourStepSize]) => (ids: string[]): Interval[] => {
    const dayHours = ids.map(fromId);
    const intervals: Interval[] = dayHours.map((dayHour) => ({
      beg: dayHour,
      end: dayHour.add($hourStepSize, 'hour'),
    }));
    return unionIntervals(intervals);
  }
);

export const getLocalIntervalsFromIds = derived(
  [getIntervalsFromIds],
  ([$getIntervalsFromIds]) => (ids: string[]): Interval[] =>
    getLocalIntervals($getIntervalsFromIds(ids))
);
