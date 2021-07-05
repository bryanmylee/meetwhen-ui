import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import { fromId, getHoursInTimeInterval, toId } from '$lib/utils/intervals';
import { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import { Set } from 'immutable';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

// Stateful logic related to selections.
interface StateDependencies {
  getIntervalsFromIds: Readable<(ids: string[]) => Interval[]>;
  hourStepSize: Readable<number>;
  days: Readable<Dayjs[]>;
  allDayHours: Readable<Dayjs[]>;
}

export interface SelectionsState {
  selectedIds: Writable<string[]>;
  selectedIntervals: Readable<Interval[]>;
  getDaysBetween: Readable<(from: Dayjs, to: Dayjs) => Dayjs[]>;
  getDayHourIdsBetween: Readable<(from: string, to: string) => string[]>;
}

export const getSelectionsState = ({
  getIntervalsFromIds,
  hourStepSize,
  days,
  allDayHours,
}: StateDependencies): SelectionsState => {
  const selectedIds = writable<string[]>([]);

  const selectedIntervals = derived(
    [getIntervalsFromIds, selectedIds],
    ([$getIntervalsFromIds, $selectedIds]) => $getIntervalsFromIds($selectedIds)
  );

  const getDaysBetween = derived([days], ([$days]) => (from: Dayjs, to: Dayjs) => {
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

  const getDayHourIdsBetween = derived(
    [allDayHours, getAllDayHoursBetween],
    ([$allDayHours, $getAllDayHoursBetween]) => (from: string, to: string): string[] => {
      const allBetween = $getAllDayHoursBetween(fromId(from), fromId(to)).map(toId);
      return Set(allBetween)
        .intersect(Set($allDayHours.map(toId)))
        .toArray();
    }
  );

  return {
    selectedIds,
    selectedIntervals,
    getDaysBetween,
    getDayHourIdsBetween,
  };
};
