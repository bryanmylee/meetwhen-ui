import type { Interval, IntervalDTO } from '$lib/gql/types';
import { union } from '$lib/utils/interval';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';
import { getIntervalsByDayUnix, getLocalIntervals } from './utils';

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
export const localIntervalsUnionedOnDay = derived(
  [localIntervalsByDayUnix],
  ([$localIntervalsByDayUnix]) => {
    const intervals: IntervalDTO[] = [];
    Object.entries($localIntervalsByDayUnix).forEach(([dayUnixStr, intervalsInDay]) => {
      const dayUnix = parseInt(dayUnixStr, 10);
      intervalsInDay.forEach(({ beg, end }) => {
        const intervalInDay: IntervalDTO = {
          beg: beg.unix() - dayUnix,
          end: end.unix() - dayUnix,
        };
        intervals.push(intervalInDay);
      });
    });
    return union(intervals);
  }
);
