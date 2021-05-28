import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';

export const selectedDates = writable<Dayjs[]>([dayjs().startOf('day')]);
export const from = writable<Dayjs>(undefined);
export const to = writable<Dayjs>(undefined);

export const intervals = derived([selectedDates, from, to], ([$selectedDates, $from, $to]) => {
  return $selectedDates.map((selectedDate) => getInterval(selectedDate, $from, $to));
});

const MIDNIGHT_TODAY = dayjs().startOf('day');

const getInterval = (date: Dayjs, from: Dayjs, to: Dayjs) => {
  if (from === undefined || to === undefined) {
    return {
      beg: 0,
      end: 0,
    };
  }
  const fromDayOffset = from.startOf('day').diff(MIDNIGHT_TODAY, 'day');
  const toDayOffset = to.startOf('day').diff(MIDNIGHT_TODAY, 'day');
  const fromTimestamp = date.hour(from.hour()).add(fromDayOffset, 'day');
  const toTimestamp = date.hour(to.hour()).add(toDayOffset, 'day');
  return {
    beg: fromTimestamp.unix(),
    end: toTimestamp.unix(),
  };
};
