import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import time, { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';
import {
  getHoursInInterval,
  getHoursInTimeInterval,
  getIntervalsByDayUnix,
  getLocalIntervals,
  isIntervalInTimeInterval,
  unionTimeIntervals,
} from '../utils/intervals';
import { hourStepSize } from './core';

// Stateful logic for all intervals and availables.

export const intervals = writable<Interval[]>([]);

export const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));

const localIntervalsByDayUnix = derived([localIntervals], ([$localIntervals]) =>
  getIntervalsByDayUnix($localIntervals)
);

export const days = derived([localIntervalsByDayUnix], ([$localIntervalsByDayUnix]) =>
  Object.keys($localIntervalsByDayUnix).map((unix) => dayjs.unix(parseInt(unix, 10)))
);

export const getIntervalsByDay = derived(
  [localIntervalsByDayUnix],
  ([$localIntervalsByDayUnix]) => (day: Dayjs) => $localIntervalsByDayUnix[day.unix()]
);

export const getIntervalsInAvailableByDay = derived(
  [getIntervalsByDay],
  ([$getIntervalsByDay]) => (available: LocalTimeInterval, day: Dayjs) => {
    const intervals = $getIntervalsByDay(day);
    return intervals.filter((interval) => isIntervalInTimeInterval(interval, available));
  }
);

/**
 * An available represents a continuous interval across all days.
 *
 *   INTERVALS  ->  AVAILABLES
 *
 *   |--|           |===|
 *   |  |           |   |
 *   |--|  |--|     |   |
 *         |  |     |   |
 *   |--|  |--|     |   |
 *   |  |           |   |
 *   |--|           |===|
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

export const hoursInDay = derived([availables, hourStepSize], ([$availables, $hourStepSize]) => {
  let hours: Time[] = [];
  $availables.forEach((available) => {
    const hoursInAvailable = getHoursInTimeInterval(available, $hourStepSize);
    hours = [...hours, ...hoursInAvailable];
  });
  return hours;
});

export const allDayHours = derived(
  [localIntervals, hourStepSize],
  ([$localIntervals, $hourStepSize]) => {
    const result: Dayjs[] = [];
    $localIntervals.forEach((interval) => {
      const hours = getHoursInInterval(interval, $hourStepSize);
      hours.forEach((hour) => {
        result.push(hour.onDayjs(interval.beg));
      });
    });
    return result;
  }
);
