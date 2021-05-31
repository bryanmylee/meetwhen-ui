import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import time from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';
import { getIntervalsByDayUnix, getLocalIntervals, isIn, unionTimeIntervals } from './utils';

export const intervals = writable<Interval[]>([]);

export const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));

const localIntervalsByDayUnix = derived([localIntervals], ([$localIntervals]) =>
  getIntervalsByDayUnix($localIntervals)
);

export const days = derived([localIntervalsByDayUnix], ([$localIntervalsByDayUnix]) =>
  Object.keys($localIntervalsByDayUnix).map((unix) => dayjs.unix(parseInt(unix, 10)))
);

export const getIntervalsInDay = derived(
  [localIntervalsByDayUnix],
  ([$localIntervalsByDayUnix]) => (day: Dayjs) => $localIntervalsByDayUnix[day.unix()]
);

/**
 * Given multiple local intervals per day, get the union of intervals in all days.
 */
export const availables = derived([localIntervals], ([$localIntervals]) => {
  const intervals: LocalTimeInterval[] = $localIntervals.map(({ beg, end }) => {
    const dayUnix = beg.startOf('day').unix();
    return {
      beg: time(beg.unix() - dayUnix),
      end: time(end.unix() - dayUnix),
    };
  });
  return unionTimeIntervals(intervals);
});

export const getIntervalsInAvailableInDay = derived(
  [getIntervalsInDay],
  ([$getIntervalsInDay]) => (available: LocalTimeInterval, day: Dayjs) => {
    const intervals = $getIntervalsInDay(day);
    return intervals.filter((interval) => isIn(interval, available));
  }
);
