import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import time from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';
import { getIntervalsByDayUnix, getLocalIntervals, unionTimeIntervals } from './utils';

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
 * Given multiple local intervals per day, we need to find the union between intervals in all days.
 */
export const localTimeIntervals = derived(
  [localIntervalsByDayUnix],
  ([$localIntervalsByDayUnix]) => {
    const intervals: LocalTimeInterval[] = [];
    Object.entries($localIntervalsByDayUnix).forEach(([dayUnixStr, intervalsInDay]) => {
      const dayUnix = parseInt(dayUnixStr, 10);
      intervalsInDay.forEach(({ beg, end }) => {
        const intervalInDay: LocalTimeInterval = {
          beg: time(beg.unix() - dayUnix),
          end: time(end.unix() - dayUnix),
        };
        intervals.push(intervalInDay);
      });
    });
    return unionTimeIntervals(intervals);
  }
);
