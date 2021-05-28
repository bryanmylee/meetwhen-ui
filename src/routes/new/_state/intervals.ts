import { Interval } from '$lib/gql/types/interval';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';

export const selectedDates = writable<Dayjs[]>([dayjs().startOf('day')]);
export const from = writable<Dayjs>(undefined);
export const to = writable<Dayjs>(undefined);

export const intervals = derived([selectedDates, from, to], ([$selectedDates, $from, $to]) => {
  const _intervals = $selectedDates.map((selectedDate) => getInterval(selectedDate, $from, $to));
  return foldIntervals(_intervals);
});

const MIDNIGHT_TODAY = dayjs().startOf('day');

const getInterval = (date: Dayjs, from: Dayjs, to: Dayjs): Interval => {
  if (from === undefined || to === undefined) {
    return null;
  }
  const fromDayOffset = from.startOf('day').diff(MIDNIGHT_TODAY, 'day');
  const toDayOffset = to.startOf('day').diff(MIDNIGHT_TODAY, 'day');
  const fromTimestamp = date.hour(from.hour()).add(fromDayOffset, 'day');
  const toTimestamp = date.hour(to.hour()).add(toDayOffset, 'day');
  return new Interval({
    beg: fromTimestamp,
    end: toTimestamp,
  });
};

const foldIntervals = (intervals: Interval[]): Interval[] => {
  if (intervals.length <= 1) {
    return intervals;
  }
  const result: Interval[] = [];
  let previous = intervals[0];
  intervals.slice(1).forEach((current) => {
    if (previous.end.isSame(current.beg)) {
      previous = new Interval({
        beg: previous.beg,
        end: current.end,
      });
    } else {
      result.push(previous);
      previous = current;
    }
  });
  result.push(previous);
  return result;
};
