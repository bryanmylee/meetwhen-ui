/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dayjs from 'dayjs';
import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
import {
	getIntervalDiscretes,
	getLocalIntervals,
	getIntervalsFromDiscretes,
	groupIntervalsByDateId,
	isIntervalInTimeInterval,
	serialize,
	unionIntervals,
	subtractIntervals,
	intersectIntervals,
	localIntervalOnDay,
	getTotalInterval,
} from './intervals';
import { dateToId } from './dayjs/dateIds';
import type { Interval } from '../types/Interval';

const today = dayjs().startOf('day');

describe('getLocalIntervals', () => {
	it('splits intervals on midnight', () => {
		const intervals = [
			{
				start: today.hour(22),
				end: today.add(1, 'day').hour(2),
			},
		];
		const result = getLocalIntervals(intervals);
		const expected = [
			{
				start: today.hour(22),
				end: today.add(1, 'day'),
			},
			{
				start: today.add(1, 'day'),
				end: today.add(1, 'day').hour(2),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('keeps rest properties', () => {
		const intervals = [
			{
				start: today.hour(22),
				end: today.add(1, 'day').hour(2),
				extra: 'metadata',
			},
		];
		const result = getLocalIntervals(intervals);
		const expected = [
			{
				start: today.hour(22),
				end: today.add(1, 'day'),
				extra: 'metadata',
			},
			{
				start: today.add(1, 'day'),
				end: today.add(1, 'day').hour(2),
				extra: 'metadata',
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});
});

describe('groupIntervalsByDateId', () => {
	it('groups intervals in a day', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
			{
				start: today.hour(12),
				end: today.hour(15),
			},
		];
		const result = groupIntervalsByDateId(intervals);
		const expected = {
			[dateToId(today)]: [
				{
					start: today.hour(8),
					end: today.hour(10),
				},
				{
					start: today.hour(12),
					end: today.hour(15),
				},
			],
		};
		expect(Object.keys(result)).toEqual(Object.keys(expected));
		const todayKey = dateToId(today);
		expect(result[todayKey].map(serialize)).toEqual(
			expected[todayKey].map(serialize),
		);
	});

	it('groups intervals in multiple days', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
			{
				start: today.add(1, 'day').hour(12),
				end: today.add(1, 'day').hour(15),
			},
		];
		const result = groupIntervalsByDateId(intervals);
		const expected = {
			[dateToId(today)]: [
				{
					start: today.hour(8),
					end: today.hour(10),
				},
			],
			[dateToId(today.add(1, 'day'))]: [
				{
					start: today.add(1, 'day').hour(12),
					end: today.add(1, 'day').hour(15),
				},
			],
		};
		expect(Object.keys(result)).toEqual(Object.keys(expected));
		const todayKey = dateToId(today);
		const tomorrowKey = dateToId(today.add(1, 'day'));
		expect(result[todayKey].map(serialize)).toEqual(
			expected[todayKey].map(serialize),
		);
		expect(result[tomorrowKey].map(serialize)).toEqual(
			expected[tomorrowKey].map(serialize),
		);
	});
});

describe('getIntervalDiscretes', () => {
	it('gets half-hourly discretes', () => {
		const interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		const result = getIntervalDiscretes(interval, 30);
		const expected = [
			today.hour(8),
			today.hour(8).minute(30),
			today.hour(9),
			today.hour(9).minute(30),
		];
		expect(result).toEqual(expected);
	});

	it('gets hourly discretes', () => {
		const interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		const result = getIntervalDiscretes(interval, 60);
		const expected = [today.hour(8), today.hour(9)];
		expect(result).toEqual(expected);
	});
});

describe('getIntervalsFromDiscretes', () => {
	it('converts consecutive discrete values', () => {
		const discretes = [
			timeFromId('08:00'),
			timeFromId('08:30'),
			timeFromId('09:00'),
			timeFromId('09:30'),
		];
		const result = getIntervalsFromDiscretes(discretes, 30);
		const expected: Interval[] = [
			{ start: timeFromId('08:00'), end: timeFromId('10:00') },
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('converts gapped discrete values', () => {
		const discretes = [timeFromId('08:00'), timeFromId('09:00')];
		const result = getIntervalsFromDiscretes(discretes, 30);
		const expected: Interval[] = [
			{ start: timeFromId('08:00'), end: timeFromId('08:30') },
			{ start: timeFromId('09:00'), end: timeFromId('09:30') },
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});
});

describe('unionIntervals', () => {
	it('unions non-overlapping intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
			{
				start: today.hour(12),
				end: today.hour(15),
			},
		];
		const result = unionIntervals(intervals);
		const expected = intervals;
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('unions adjacent intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
			{
				start: today.hour(10),
				end: today.hour(12),
			},
		];
		const result = unionIntervals(intervals);
		const expected = [
			{
				start: today.hour(8),
				end: today.hour(12),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('unions overlapping intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
			{
				start: today.hour(9),
				end: today.hour(11),
			},
		];
		const result = unionIntervals(intervals);
		const expected = [
			{
				start: today.hour(8),
				end: today.hour(11),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});
});

describe('subtractIntervals', () => {
	it('subtracts non-overlapping intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		const toSub = [
			{
				start: today.hour(12),
				end: today.hour(15),
			},
		];
		const result = subtractIntervals(intervals, toSub);
		const expected = intervals;
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('subtracts adjacent intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		const toSub = [
			{
				start: today.hour(10),
				end: today.hour(12),
			},
		];
		const result = subtractIntervals(intervals, toSub);
		const expected = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('subtracts overlapping intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		const toSub = [
			{
				start: today.hour(9),
				end: today.hour(11),
			},
		];
		const result = subtractIntervals(intervals, toSub);
		const expected = [
			{
				start: today.hour(8),
				end: today.hour(9),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('subtracts contained intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(12),
			},
		];
		const toSub = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
		];
		const result = subtractIntervals(intervals, toSub);
		const expected = [
			{
				start: today.hour(8),
				end: today.hour(9),
			},
			{
				start: today.hour(10),
				end: today.hour(12),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('subtracts equal intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(12),
			},
		];
		const result = subtractIntervals(intervals, intervals);
		const expected: Interval[] = [];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('subtracts multiple intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(13),
			},
		];
		const toSub = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
			{
				start: today.hour(11),
				end: today.hour(12),
			},
		];
		const result = subtractIntervals(intervals, toSub);
		const expected = [
			{
				start: today.hour(8),
				end: today.hour(9),
			},
			{
				start: today.hour(10),
				end: today.hour(11),
			},
			{
				start: today.hour(12),
				end: today.hour(13),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});
});

describe('intersectIntervals', () => {
	it('intersects non-overlapping intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		const toIntersect = [
			{
				start: today.hour(12),
				end: today.hour(15),
			},
		];
		const result = intersectIntervals(intervals, toIntersect);
		const expected: Interval[] = [];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('intersects adjacent intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		const toIntersect = [
			{
				start: today.hour(10),
				end: today.hour(12),
			},
		];
		const result = intersectIntervals(intervals, toIntersect);
		const expected: Interval[] = [];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('intersects overlapping intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(10),
			},
		];
		const toIntersect = [
			{
				start: today.hour(9),
				end: today.hour(11),
			},
		];
		const result = intersectIntervals(intervals, toIntersect);
		const expected = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('intersects contained intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(12),
			},
		];
		const toIntersect = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
		];
		const result = intersectIntervals(intervals, toIntersect);
		const expected = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('intersects equal intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(12),
			},
		];
		const result = intersectIntervals(intervals, intervals);
		const expected: Interval[] = [
			{
				start: today.hour(8),
				end: today.hour(12),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});

	it('intersects multiple intervals', () => {
		const intervals = [
			{
				start: today.hour(8),
				end: today.hour(13),
			},
		];
		const toIntersect = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
			{
				start: today.hour(11),
				end: today.hour(12),
			},
		];
		const result = intersectIntervals(intervals, toIntersect);
		const expected = [
			{
				start: today.hour(9),
				end: today.hour(10),
			},
			{
				start: today.hour(11),
				end: today.hour(12),
			},
		];
		expect(result.map(serialize)).toEqual(expected.map(serialize));
	});
});

describe('isIntervalInTimeInterval', () => {
	it('checks fully contained intervals', () => {
		const interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		const timeInterval = {
			start: timeFromId('07:30'),
			end: timeFromId('10:30'),
		};
		const result = isIntervalInTimeInterval(interval, timeInterval);
		expect(result).toBe(true);
	});

	it('checks equal intervals', () => {
		const interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		const timeInterval = {
			start: timeFromId('08:00'),
			end: timeFromId('10:00'),
		};
		const result = isIntervalInTimeInterval(interval, timeInterval);
		expect(result).toBe(true);
	});

	it('checks non-contained intervals', () => {
		const interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		const timeInterval = {
			start: timeFromId('08:00'),
			end: timeFromId('09:30'),
		};
		const result = isIntervalInTimeInterval(interval, timeInterval);
		expect(result).toBe(false);
	});
});

describe('localIntervalOnDay', () => {
	it('adjusts day correctly', () => {
		const interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		const tomorrow = today.add(1, 'day');
		const result = localIntervalOnDay(interval, tomorrow);
		const expected: Interval = {
			start: tomorrow.hour(8),
			end: tomorrow.hour(10),
		};
		expect(serialize(result)).toEqual(serialize(expected));
	});

	it('accounts for ending on midnight', () => {
		const interval = {
			start: today.hour(11),
			end: today.hour(0).add(1, 'day'),
		};
		const tomorrow = today.add(1, 'day');
		const result = localIntervalOnDay(interval, tomorrow);
		const expected: Interval = {
			start: tomorrow.hour(11),
			end: tomorrow.hour(0).add(1, 'day'),
		};
		expect(serialize(result)).toEqual(serialize(expected));
	});
});

describe('getTotalInterval', () => {
	it('gets the total for one interval', () => {
		const result = getTotalInterval([
			{
				start: today.hour(22),
				end: today.add(1, 'day').hour(2),
			},
		]);
		const expected: Interval = {
			start: today.hour(22),
			end: today.add(1, 'day').hour(2),
		};
		expect(result).not.toBeUndefined();
		expect(serialize(result!)).toEqual(serialize(expected));
	});

	it('gets the total for unsorted intervals', () => {
		const result = getTotalInterval([
			{
				start: today.hour(22),
				end: today.hour(23),
			},
			{
				start: today.hour(8),
				end: today.hour(9),
			},
		]);
		const expected: Interval = {
			start: today.hour(8),
			end: today.hour(23),
		};
		expect(result).not.toBeUndefined();
		expect(serialize(result)).toEqual(serialize(expected));
	});

	it('gets the total for overlapping intervals', () => {
		const result = getTotalInterval([
			{
				start: today.hour(8),
				end: today.hour(10),
			},
			{
				start: today.hour(8),
				end: today.hour(9),
			},
		]);
		const expected: Interval = {
			start: today.hour(8),
			end: today.hour(10),
		};
		expect(result).not.toBeUndefined();
		expect(serialize(result)).toEqual(serialize(expected));
	});

	it('throws if no intervals are passed', () => {
		expect(() => {
			getTotalInterval([]);
		}).toThrowError('Cannot get a total from an empty set of intervals');
	});
});
