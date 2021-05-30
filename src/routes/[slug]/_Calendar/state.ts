import type { Interval } from '$lib/gql/types';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, Readable, writable, Writable } from 'svelte/store';
import { getIntervalsByDayUnix, getLocalIntervals } from './utils';

interface CalendarState {
  intervals: Writable<Interval[]>;
  localIntervals: Readable<Interval[]>;
  days: Readable<Dayjs[]>;
}

export const getCalendarState = (): CalendarState => {
  const intervals = writable<Interval[]>([]);
  const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));
  const localIntervalsByDayUnix = derived([localIntervals], ([$localIntervals]) =>
    getIntervalsByDayUnix($localIntervals)
  );
  const days = derived([localIntervalsByDayUnix], ([$localIntervalsByDayUnix]) =>
    Object.keys($localIntervalsByDayUnix).map((unix) => dayjs.unix(parseInt(unix, 10)))
  );
  return {
    intervals,
    localIntervals,
    days,
  };
};
