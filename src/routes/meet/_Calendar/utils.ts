import type { Interval } from '$lib/gql/types/interval';

export const getLocalizedIntervals = (intervals: Interval[]): Interval[] => {
  if (intervals.length === 0) {
    return [];
  }
};
