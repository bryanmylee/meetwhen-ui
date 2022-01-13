import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { endOf } from '$lib/core/utils/dayjs/endOf';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { dateToId } from '$lib/core/utils/dayjs/dateIds';
import type { Interval } from '$lib/core/types/Interval';
import type { UnixInterval } from '$lib/core/types/UnixInterval';
import type { Moment } from '$lib/core/types/Moment';
import type { Maybe } from '$lib/core/types/Maybe';

export const serialize = (interval: Interval): UnixInterval => ({
	start: interval.start.unix(),
	end: interval.end.unix(),
});

export const deserialize = (interval: UnixInterval): Interval => ({
	start: dayjs.unix(interval.start),
	end: dayjs.unix(interval.end),
});

/**
 * Convert a set of intervals into local time by splitting intervals along date boundaries.
 * @param intervals The standard intervals to format in local time.
 * @returns The intervals split along date boundaries in local time.
 */
export const getLocalIntervals = <T extends Interval>(intervals: T[]): T[] => {
	if (intervals.length === 0) {
		return [];
	}
	intervals.sort((a, b) => a.start.diff(b.start));
	const results: T[] = [];
	let currIndex = 0;
	let working: T = intervals[currIndex];
	while (currIndex < intervals.length) {
		const { start, end, ...rest } = working;
		if (start.isSame(end, 'day') || endOf(start, 'day').isSame(end)) {
			results.push(working);
			currIndex++;
			if (currIndex >= intervals.length) {
				break;
			}
			working = intervals[currIndex];
		} else {
			results.push({
				...rest,
				start,
				end: endOf(start, 'day'),
			} as T);
			working = { ...rest, start: endOf(start, 'day'), end } as T;
		}
	}
	return results;
};

/**
 * Group intervals by the day they start in.
 * Dayjs objects do not work as keys in Map or Set, therefore we key the groups
 * by the dateId of the day.
 * @param intervals The intervals to group.
 * @returns The intervals grouped by dateId.
 */
export const groupIntervalsByDateId = (
	intervals: Interval[],
): Record<string, Interval[]> => {
	const result: Record<string, Interval[]> = {};
	intervals.forEach((interval) => {
		const key = dateToId(interval.start);
		if (!Object.keys(result).includes(key)) {
			result[key] = [];
		}
		result[key].push(interval);
	});
	return result;
};

/**
 * Convert an interval into a list of discrete Dayjs values within the interval.
 * @param interval The interval to convert.
 * @param resolution The number of minutes in between each discrete value in the interval.
 * @returns An ordered list of discrete Dayjs values within the interval.
 */
export const getIntervalDiscretes = (
	{ start, end }: Interval,
	resolution = 30,
): Dayjs[] => {
	const result: Dayjs[] = [];
	let current = start;
	while (current.isBefore(end)) {
		result.push(current);
		current = current.add(resolution, 'minutes');
	}
	return result;
};

/**
 * Convert discrete values into a list of intervals.
 * @param discretes A list of discrete Dayjs values.
 * @param resolution The duration of each discrete value.
 * @returns The intervals represented by the discrete values.
 */
export const getIntervalsFromDiscretes = (
	discretes: Dayjs[],
	resolution = 30,
): Interval[] => {
	const intervals: Interval[] = discretes.map((d) => ({
		start: d,
		end: d.add(resolution, 'minutes'),
	}));
	return unionIntervals(intervals);
};

const momentsToIntervals = (moments: Moment[]): Interval[] => {
	moments.sort((a, b) => {
		if (a.value.isSame(b.value)) {
			// order beginning moments first.
			return a.isEnd ? 1 : -1;
		}
		return a.value.diff(b.value);
	});
	const intervals: Interval[] = [];
	let currStart: Maybe<Dayjs> = undefined;
	let depth = 0;
	moments.forEach((moment) => {
		if (moment.isEnd) {
			depth--;
			if (
				depth === 0 &&
				currStart !== undefined &&
				currStart.isBefore(moment.value)
			) {
				intervals.push({ start: currStart, end: moment.value });
			}
		} else {
			depth++;
			if (depth === 1) {
				currStart = moment.value;
			}
		}
	});
	return intervals;
};

/**
 * Unions a list of intervals together such that no overlapping intervals exist.
 * @param intervals The intervals to union.
 * @returns A list of non-overlapping intervals.
 */
export const unionIntervals = (intervals: Interval[]): Interval[] => {
	const moments: Moment[] = [];
	intervals.forEach(({ start, end }) => {
		moments.push({ value: start, isEnd: false }, { value: end, isEnd: true });
	});
	return momentsToIntervals(moments);
};

/**
 * Subtracts a list of intervals from another.
 * @param intervals The intervals to subtract from.
 * @param toSub The intervals to subtract.
 * @returns The subtracted list of intervals.
 */
export const subtractIntervals = (
	intervals: Interval[],
	toSub: Interval[],
): Interval[] => {
	const moments: Moment[] = [];
	intervals.forEach(({ start, end }) => {
		moments.push({ value: start, isEnd: false }, { value: end, isEnd: true });
	});
	toSub.forEach(({ start, end }) => {
		moments.push({ value: start, isEnd: true }, { value: end, isEnd: false });
	});
	return momentsToIntervals(moments);
};

/**
 * Check if an interval is contained by or equal to the time of an interval.
 * @param interval The interval to check if contained by the time of @see timeInterval.
 * @param timeInterval The interval to check if time contains @see interval.
 * @returns True if @see interval is contained by or equal to the time of @see timeInterval
 */
export const isIntervalInTimeInterval = (
	interval: Interval,
	timeInterval: Maybe<Interval>,
): boolean => {
	if (timeInterval === undefined) {
		return false;
	}
	const { start, end } = timeInterval;
	const day = interval.start.startOf('day');
	const startOnDay = onDay(start, day);
	const endOnDay = onDay(end, day);
	return (
		!startOnDay.isAfter(interval.start) && !endOnDay.isBefore(interval.end)
	);
};
