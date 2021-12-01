import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import {
	getHoursInInterval,
	getHoursInTimeInterval,
	getIntervalsByDayUnix,
	getLocalIntervals,
	isIntervalInTimeInterval,
	unionTimeIntervals,
} from '$lib/utils/intervals';
import time, { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

// Stateful logic for all intervals and availables.
export interface IntervalsState {
	intervals: Writable<Interval[]>;
	localIntervals: Readable<Interval[]>;
	days: Readable<Dayjs[]>;
	getIntervalsByDay: Readable<(day: Dayjs) => Interval[]>;
	getIntervalsInAvailableByDay: Readable<(available: LocalTimeInterval, day: Dayjs) => Interval[]>;
	availables: Readable<LocalTimeInterval[]>;
	hoursInDay: Readable<Time[]>;
	allDayHours: Readable<Dayjs[]>;
}

export const getIntervalsState = (hourStepSize: Readable<number>): IntervalsState => {
	const intervals = writable<Interval[]>([]);

	const localIntervals = derived([intervals], ([$intervals]) => getLocalIntervals($intervals));

	const localIntervalsByDayUnix = derived([localIntervals], ([$localIntervals]) =>
		getIntervalsByDayUnix($localIntervals)
	);

	const days = derived([localIntervalsByDayUnix], ([$localIntervalsByDayUnix]) =>
		Object.keys($localIntervalsByDayUnix).map((unix) => dayjs.unix(parseInt(unix, 10)))
	);

	const getIntervalsByDay = derived(
		[localIntervalsByDayUnix],
		([$localIntervalsByDayUnix]) =>
			(day: Dayjs) =>
				$localIntervalsByDayUnix[day.unix()]
	);

	const getIntervalsInAvailableByDay = derived(
		[getIntervalsByDay],
		([$getIntervalsByDay]) =>
			(available: LocalTimeInterval, day: Dayjs) => {
				const intervals = $getIntervalsByDay(day);
				return intervals.filter((interval) => isIntervalInTimeInterval(interval, available));
			}
	);

	/**
	 * An available represents a continuous interval across all days.
	 *
	 *   INTERVALS  ->  AVAILABLES
	 *
	 *   |--|           |===|
	 *   |  |           |   |
	 *   |--|  |--|     |   |
	 *         |  |     |   |
	 *   |--|  |--|     |   |
	 *   |  |           |   |
	 *   |--|           |===|
	 */
	const availables = derived([localIntervals], ([$localIntervals]) => {
		const intervals: LocalTimeInterval[] = $localIntervals.map(({ beg, end }) => {
			const dayUnix = beg.startOf('day').unix();
			return {
				beg: time(beg.unix() - dayUnix),
				// produces unix that can be larger than 86400.
				end: time(end.unix() - dayUnix),
			};
		});
		return unionTimeIntervals(intervals);
	});

	const hoursInDay = derived([availables, hourStepSize], ([$availables, $hourStepSize]) => {
		let hours: Time[] = [];
		$availables.forEach((available) => {
			const hoursInAvailable = getHoursInTimeInterval(available, $hourStepSize);
			hours = [...hours, ...hoursInAvailable];
		});
		return hours;
	});

	const allDayHours = derived(
		[localIntervals, hourStepSize],
		([$localIntervals, $hourStepSize]) => {
			const result: Dayjs[] = [];
			$localIntervals.forEach((interval) => {
				const hours = getHoursInInterval(interval, $hourStepSize);
				hours.forEach((hour) => {
					result.push(hour.onDayjs(interval.beg));
				});
			});
			return result;
		}
	);

	return {
		intervals,
		localIntervals,
		days,
		getIntervalsByDay,
		getIntervalsInAvailableByDay,
		availables,
		hoursInDay,
		allDayHours,
	};
};
