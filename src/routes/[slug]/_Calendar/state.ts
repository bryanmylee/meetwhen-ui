import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import time, { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Set } from 'immutable';
import { derived, writable } from 'svelte/store';
import {
  fromId,
  getHoursInInterval,
  getHoursInTimeInterval,
  getIntervalsByDayUnix,
  getLocalIntervals,
  isIntervalInTimeInterval,
  toId,
  unionIntervals,
  unionTimeIntervals,
} from './utils';

// CORE

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

// UI

export const numRows = derived(
  [availables, hoursInDay],
  ([$availables, $hoursInDay]) => $availables.length + $hoursInDay.length - 1
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

// SELECTIONS

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

export const getDaysBetween = derived([days], ([$days]) => (from: Dayjs, to: Dayjs) => {
  const fromIndex = $days.findIndex((day) => day.isSame(from, 'day'));
  const toIndex = $days.findIndex((day) => day.isSame(to, 'day'));
  return $days.slice(fromIndex, toIndex + 1);
});

/**
 * Generate all day hours between to selected day hours, regardless of the available intervals.
 */
const getAllDayHoursBetween = derived(
  [hourStepSize, getDaysBetween],
  ([$hourStepSize, $getDaysBetween]) => (from: Dayjs, to: Dayjs): Dayjs[] => {
    const [earliestDay, latestDay] = from.isBefore(to) ? [from, to] : [to, from];
    const fromHour = Time.dayjs(from);
    const toHour = Time.dayjs(to);
    const [earliestHour, latestHour] =
      fromHour.unix < toHour.unix ? [fromHour, toHour] : [toHour, fromHour];
    const timeInterval: LocalTimeInterval = {
      beg: earliestHour,
      end: latestHour.add($hourStepSize, 'hour'),
    };
    const hours = getHoursInTimeInterval(timeInterval, $hourStepSize);
    const result: Dayjs[] = [];
    $getDaysBetween(earliestDay, latestDay).forEach((day) => {
      hours.forEach((hour) => {
        result.push(hour.onDayjs(day));
      });
    });
    return result;
  }
);

export const getDayHourIdsBetween = derived(
  [allDayHours, getAllDayHoursBetween],
  ([$allDayHours, $getAllDayHoursBetween]) => (from: string, to: string): string[] => {
    const allBetween = $getAllDayHoursBetween(fromId(from), fromId(to)).map(toId);
    return Set(allBetween)
      .intersect(Set($allDayHours.map(toId)))
      .toArray();
  }
);
