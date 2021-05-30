import type { Interval } from '$lib/gql/types';
import type { Dayjs } from 'dayjs';
import { derived, Readable, writable, Writable } from 'svelte/store';
import { getDays, getLocalIntervals } from './utils';

interface CalendarState {
  intervals: Writable<Interval[]>;
  localIntervals: Readable<Interval[]>;
  days: Readable<Dayjs[]>;
}

export const getCalendarState = (): CalendarState => {
  const intervals = writable<Interval[]>([]);
  const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));
  const days = derived([localIntervals], ([$localIntervals]) => getDays($localIntervals));
  return {
    intervals,
    localIntervals,
    days,
  };
};
