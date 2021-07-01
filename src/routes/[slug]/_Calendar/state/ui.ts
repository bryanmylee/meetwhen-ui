import type { LocalTimeInterval } from '$lib/gql/types';
import type { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { getHoursInTimeInterval } from '../utils/intervals';

// Stateful logic for transforming data to UI.
interface StateDependencies {
  hourStepSize: Readable<number>;
  days: Readable<Dayjs[]>;
  availables: Readable<LocalTimeInterval[]>;
  hoursInDay: Readable<Time[]>;
}

export interface UiState {
  isFullscreen: Writable<boolean>;
  getColIndexByDay: Readable<(toFind: Dayjs) => number>;
  numRows: Readable<number>;
  getRowIndexByTime: Readable<(time: Time) => number>;
}

export const getUiState = ({
  hourStepSize,
  days,
  availables,
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

  return {
    isFullscreen,
    getColIndexByDay,
    numRows,
    getRowIndexByTime,
  };
};
