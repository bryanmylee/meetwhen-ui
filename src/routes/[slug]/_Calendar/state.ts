import type { Interval } from '$lib/gql/types';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { derived, writable } from 'svelte/store';
import { getIntervalsByDayUnix, getLocalIntervals } from './utils';

export const intervals = writable<Interval[]>([]);

export const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));

const localIntervalsByDayUnix = derived([localIntervals], ([$localIntervals]) =>
  getIntervalsByDayUnix($localIntervals)
);

export const days = derived([localIntervalsByDayUnix], ([$localIntervalsByDayUnix]) =>
  Object.keys($localIntervalsByDayUnix).map((unix) => dayjs.unix(parseInt(unix, 10)))
);

export const getIntervalsInDay = derived(
  [localIntervalsByDayUnix],
  ([$localIntervalsByDayUnix]) => (day: Dayjs) => $localIntervalsByDayUnix[day.unix()]
);
