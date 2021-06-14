import type { Interval } from '$lib/gql/types';
import { derived, writable } from 'svelte/store';
import { fromId, getLocalIntervals, toId, unionIntervals } from '../utils/intervals';

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

export const getIdsFromIntervals = derived(
  [hourStepSize],
  ([$hourStepSize]) => (intervals: Interval[]): string[] => {
    const ids: string[] = [];
    intervals.forEach((interval) => {
      for (
        let current = interval.beg;
        !current.isSame(interval.end);
        current = current.add($hourStepSize, 'hour')
      ) {
        ids.push(toId(current));
      }
    });
    return ids;
  }
);
