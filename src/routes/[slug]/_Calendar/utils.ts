import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import { endOf } from '$lib/utils/dayjs-end-of';
import type { Moment } from '$lib/utils/moment';
import time, { Time } from '$lib/utils/time';
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

export const getHoursInInterval = ({ beg, end }: Interval): Time[] => {
  const result: Dayjs[] = [];
  let current = beg;
  while (current.isBefore(end)) {
    result.push(current);
    current = current.add(1, 'hour');
  }
  return result.map(Time.dayjs);
};

export const union = (intervals: Interval[]): Interval[] => {
  const moments: Moment[] = [];
  intervals.forEach(({ beg, end }) => {
    moments.push({ unix: beg.unix(), end: false }, { unix: end.unix(), end: true });
  });
  moments.sort((a, b) => a.unix - b.unix);
  const result: Interval[] = [];
  let currentBeg: Dayjs = null;
  let depth = 0;
  moments.forEach((moment) => {
    if (moment.end) {
      depth--;
      if (depth === 0) {
        result.push({ beg: currentBeg, end: dayjs.unix(moment.unix) });
      }
    } else {
      depth++;
      if (depth === 1) {
        currentBeg = dayjs.unix(moment.unix);
      }
    }
  });
  return result;
};

export const unionTimeIntervals = (intervals: LocalTimeInterval[]): LocalTimeInterval[] => {
  const moments: Moment[] = [];
  intervals.forEach(({ beg, end }) => {
    moments.push({ unix: beg.unix, end: false }, { unix: end.unix, end: true });
  });
  moments.sort((a, b) => a.unix - b.unix);
  const result: LocalTimeInterval[] = [];
  let currentBeg: Time = null;
  let depth = 0;
  moments.forEach((moment) => {
    if (moment.end) {
      depth--;
      if (depth === 0) {
        result.push({ beg: currentBeg, end: time(moment.unix) });
      }
    } else {
      depth++;
      if (depth === 1) {
        currentBeg = time(moment.unix);
      }
    }
  });
  return result;
};

export const setTimeOfDay = (day: Dayjs, time: Time): Dayjs => {
  return day.hour(time.hour).minute(time.minute).second(time.second);
};

export const isIn = (inner: Interval, outer: Interval): boolean => {
  return !inner.beg.isBefore(outer.beg) && !inner.end.isAfter(outer.end);
};
