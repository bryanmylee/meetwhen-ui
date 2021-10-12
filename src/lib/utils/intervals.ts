import type { Interval, LocalTimeInterval } from '$lib/gql/types';
import { endOf } from '$lib/utils/dayjs-end-of';
import type { Moment } from '$lib/utils/moment';
import time, { Time } from '$lib/utils/time';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const getLocalIntervals = <T extends Interval>(intervals: T[]): T[] => {
	if (intervals.length === 0) {
		return [];
	}
	intervals.sort((a, b) => a.beg.diff(b.beg));
	const results: T[] = [];
	let currIndex = 0;
	let working: T = intervals[currIndex];
	while (currIndex < intervals.length) {
		const { beg, end, ...props } = working;
		if (beg.isSame(end, 'day') || endOf(beg, 'day').isSame(end)) {
			results.push(working);
			currIndex++;
			working = currIndex < intervals.length ? intervals[currIndex] : null;
		} else {
			results.push({
				...props,
				beg,
				end: endOf(beg, 'day'),
			} as T);
			working = { ...props, beg: endOf(beg, 'day'), end } as T;
		}
	}
	return results;
};

// Dayjs classes are not strictly equal and do not conform with Map or Set equality.
export const getIntervalsByDayUnix = (intervals: Interval[]): Record<number, Interval[]> => {
	const result: Record<number, Interval[]> = {};
	intervals.forEach((interval) => {
		const key = interval.beg.startOf('day').unix();
		if (!(key in Object.keys(result))) {
			result[key] = [];
		}
		result[key].push(interval);
	});
	return result;
};

export const getHoursInInterval = ({ beg, end }: Interval, step = 1): Time[] => {
	const result: Dayjs[] = [];
	let current = beg;
	while (current.isBefore(end)) {
		result.push(current);
		current = current.add(step, 'hour');
	}
	return result.map(Time.dayjs);
};

export const getHoursInTimeInterval = ({ beg, end }: LocalTimeInterval, step = 1): Time[] => {
	const result: Time[] = [];
	let current = beg;
	while (current.unix < end.unix) {
		result.push(current);
		current = current.add(step, 'hour');
	}
	return result;
};

export const unionIntervals = (intervals: Interval[]): Interval[] => {
	const moments: Moment[] = [];
	intervals.forEach(({ beg, end }) => {
		moments.push({ unix: beg.unix(), end: false }, { unix: end.unix(), end: true });
	});
	moments.sort((a, b) => {
		if (a.unix === b.unix) {
			// order beginning moments first.
			return a.end === false ? -1 : 1;
		}
		return a.unix - b.unix;
	});
	const result: Interval[] = [];
	let currentBeg: Dayjs = null;
	let depth = 0;
	moments.forEach((moment) => {
		if (moment.end) {
			depth--;
			if (depth === 0) {
				result.push({ beg: currentBeg, end: dayjs.unix(moment.unix) });
			}
		} else {
			depth++;
			if (depth === 1) {
				currentBeg = dayjs.unix(moment.unix);
			}
		}
	});
	return result;
};

export const unionTimeIntervals = (intervals: LocalTimeInterval[]): LocalTimeInterval[] => {
	const moments: Moment[] = [];
	intervals.forEach(({ beg, end }) => {
		moments.push({ unix: beg.unix, end: false }, { unix: end.unix, end: true });
	});
	moments.sort((a, b) => {
		if (a.unix === b.unix) {
			// order beginning moments first.
			return a.end === false ? -1 : 1;
		}
		return a.unix - b.unix;
	});
	const result: LocalTimeInterval[] = [];
	let currentBeg: Time = null;
	let depth = 0;
	moments.forEach((moment) => {
		if (moment.end) {
			depth--;
			if (depth === 0) {
				result.push({ beg: currentBeg, end: time(moment.unix) });
			}
		} else {
			depth++;
			if (depth === 1) {
				currentBeg = time(moment.unix);
			}
		}
	});
	return result;
};

export const isIntervalInTimeInterval = (
	interval: Interval,
	timeInterval: LocalTimeInterval
): boolean => {
	if (timeInterval === null) {
		return false;
	}
	const { beg, end } = timeInterval;
	const day = interval.beg.startOf('day');
	const begDay = beg.onDayjs(day);
	const endDay = end.onDayjs(day);
	return !begDay.isAfter(interval.beg) && !endDay.isBefore(interval.end);
};

export const toId = (day: Dayjs): string => {
	return day.unix().toString();
};

export const fromId = (id: string): Dayjs => {
	return dayjs.unix(parseInt(id, 10));
};
