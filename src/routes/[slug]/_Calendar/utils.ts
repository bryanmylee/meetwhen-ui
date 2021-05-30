import type { Interval } from '$lib/gql/types';
import { endOf } from '$lib/utils/dayjs-end-of';
import type { Dayjs } from 'dayjs';

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

// Dayjs classes are not strictly equal and do not conform with Map or Set equality.
export const getIntervalsByDayUnix = (intervals: Interval[]): Record<number, Interval[]> => {
  const result: Record<number, Interval[]> = {};
  intervals.forEach((interval) => {
    const key = interval.beg.startOf('day').unix();
    if (!result.hasOwnProperty(key)) {
      result[key] = [];
    }
    result[key].push(interval);
  });
  return result;
};

export const getHoursInInterval = ({ beg, end }: Interval): Dayjs[] => {
  const result: Dayjs[] = [];
  let current = beg;
  while (current.isBefore(end)) {
    result.push(current);
    current = current.add(1, 'hour');
  }
  return result;
};
