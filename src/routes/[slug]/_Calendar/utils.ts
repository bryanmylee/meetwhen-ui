import type { Interval } from '$lib/gql/types/interval';
import { endOf } from '$lib/utils/dayjs-end-of';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const getLocalIntervals = (intervals: Interval[]): Interval[] => {
  if (intervals.length === 0) {
    return [];
  }
  intervals.sort((a, b) => a.beg.diff(b.beg));
  const results: Interval[] = [];
  let currIndex = 0;
  let working: Interval = intervals[currIndex];
  while (currIndex < intervals.length) {
    const { beg, end } = working;
    if (beg.isSame(end, 'day') || endOf(beg, 'day').isSame(end)) {
      results.push(working);
      currIndex++;
      working = currIndex < intervals.length ? intervals[currIndex] : null;
    } else {
      results.push({ beg, end: endOf(beg, 'day') });
      working = { beg: endOf(beg, 'day'), end };
    }
  }
  return results;
};

export const getDays = (intervals: Interval[]): Dayjs[] => {
  // Dayjs classes do not conform with Set equality.
  const result = new Set<number>();
  intervals.forEach((interval) => {
    result.add(interval.beg.startOf('day').unix());
  });
  return Array.from(result).sort().map(dayjs.unix);
};
