import type { LocalTimeInterval } from '$lib/gql/types';
import { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import { Set } from 'immutable';
import { derived, writable } from 'svelte/store';
import { fromId, getHoursInTimeInterval, toId } from '../utils';
import { getIntervalsFromIds, hourStepSize } from './core';
import { allDayHours, days } from './intervals';

// Stateful logic related to selections.

export const selectedIds = writable<string[]>([]);

export const selectedIntervals = derived(
  [getIntervalsFromIds, selectedIds],
  ([$getIntervalsFromIds, $selectedIds]) => $getIntervalsFromIds($selectedIds)
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
