import type { LocalTimeInterval, Schedule } from '$lib/gql/types';
import { getHoursInTimeInterval } from '$lib/utils/intervals';
import type { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import { Set } from 'immutable';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

// Stateful logic for transforming data to UI.
interface StateDependencies {
  hourStepSize: Readable<number>;
  days: Readable<Dayjs[]>;
  availables: Readable<LocalTimeInterval[]>;
  schedules: Readable<Schedule[]>;
  hoursInDay: Readable<Time[]>;
}

export interface UiState {
  isFullscreen: Writable<boolean>;
  getColIndexByDay: Readable<(toFind: Dayjs) => number>;
  numRows: Readable<number>;
  getRowIndexByTime: Readable<(time: Time) => number>;
  availableHasLeftCorners: Readable<
    (day: Dayjs, available: LocalTimeInterval) => { top: boolean; bottom: boolean }
  >;
}

export const getUiState = ({
  hourStepSize,
  days,
  availables,
  schedules,
  hoursInDay,
}: StateDependencies): UiState => {
  const isFullscreen = writable(false);

  const getColIndexByDay = derived([days], ([$days]) => (toFind: Dayjs) =>
    $days.findIndex((day) => day.isSame(toFind, 'day'))
  );

  const numRows = derived(
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

  const getRowIndexByTime = derived([rowIndexByTimeUnix], ([$rowIndexByTimeUnix]) => (time: Time) =>
    $rowIndexByTimeUnix[time.unix]
  );

  const allScheduleBegEnds = derived([schedules], ([$schedules]) => {
    let begs: Set<number> = Set();
    let ends: Set<number> = Set();
    $schedules.forEach((schedule) => {
      begs = begs.union(schedule.intervals.map((interval) => interval.beg.unix()));
      ends = ends.union(schedule.intervals.map((interval) => interval.end.unix()));
    });
    console.log(ends.toArray());
    return [begs, ends] as [begs: Set<number>, ends: Set<number>];
  });

  const availableHasLeftCorners = derived(
    [allScheduleBegEnds],
    ([$allScheduleBegEnds]) => (day: Dayjs, available: LocalTimeInterval) => {
      const [begs, ends] = $allScheduleBegEnds;
      const hasTopLeftCorner = begs.includes(available.beg.onDayjs(day).unix());
      console.log(available.end.hour);
      const hasBottomLeftCorner = ends.includes(available.end.onDayjs(day).unix());
      return {
        top: hasTopLeftCorner,
        bottom: hasBottomLeftCorner,
      };
    }
  );

  return {
    isFullscreen,
    getColIndexByDay,
    numRows,
    getRowIndexByTime,
    availableHasLeftCorners,
  };
};
