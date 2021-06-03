import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import time, { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';
import {
  fromId,
  getHoursInTimeInterval,
  getIntervalsByDayUnix,
  getLocalIntervals,
  isIntervalInTimeInterval,
  unionIntervals,
  unionTimeIntervals,
} from './utils';

export const intervals = writable<Interval[]>([]);

export const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));

const localIntervalsByDayUnix = derived([localIntervals], ([$localIntervals]) =>
  getIntervalsByDayUnix($localIntervals)
);

export const days = derived([localIntervalsByDayUnix], ([$localIntervalsByDayUnix]) =>
  Object.keys($localIntervalsByDayUnix).map((unix) => dayjs.unix(parseInt(unix, 10)))
);

export const getColIndexByDay = derived([days], ([$days]) => (toFind: Dayjs) =>
  $days.findIndex((day) => day.isSame(toFind, 'day'))
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

export const hourStepSize = writable(0.5);

export const totalHours = derived([availables, hourStepSize], ([$availables, $hourStepSize]) => {
  let hours: Time[] = [];
  $availables.forEach((available) => {
    const hoursInAvailable = getHoursInTimeInterval(available, $hourStepSize);
    hours = [...hours, ...hoursInAvailable];
  });
  return hours;
});

export const numRows = derived(
  [availables, totalHours],
  ([$availables, $totalHours]) => $availables.length + $totalHours.length - 1
);

const rowIndexByTimeUnix = derived([availables, hourStepSize], ([$availables, $hourStepSize]) => {
  const rowIndexByTimeUnix: Record<number, number> = {};
  let index = 0;
  $availables.forEach((available) => {
    const hours = getHoursInTimeInterval(available, $hourStepSize);
    hours.forEach(({ unix }) => {
      rowIndexByTimeUnix[unix] = index++;
    });
    index++;
  });
  return rowIndexByTimeUnix;
});

export const getRowIndexByTime = derived(
  [rowIndexByTimeUnix],
  ([$rowIndexByTimeUnix]) => (time: Time) => $rowIndexByTimeUnix[time.unix]
);

export const selectedIds = writable<string[]>([]);

export const selectedDays = derived([selectedIds], ([$selectedIds]) => $selectedIds.map(fromId));

export const selectedIntervals = derived(
  [selectedDays, hourStepSize],
  ([$selectedDays, $hourStepSize]) => {
    const intervals: Interval[] = $selectedDays.map((day) => ({
      beg: day,
      end: day.add($hourStepSize, 'hour'),
    }));
    return unionIntervals(intervals);
  }
);

export const selectedLocalIntervals = derived([selectedIntervals], ([$selectedIntervals]) =>
  getLocalIntervals($selectedIntervals)
);
