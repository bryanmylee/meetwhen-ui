import type { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import { derived } from 'svelte/store';
import { getHoursInTimeInterval } from '../utils';
import { hourStepSize } from './core';
import { availables, days, hoursInDay } from './intervals';

// Stateful logic for transforming data to UI.

export const getColIndexByDay = derived([days], ([$days]) => (toFind: Dayjs) =>
  $days.findIndex((day) => day.isSame(toFind, 'day'))
);

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
