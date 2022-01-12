import dayjs from 'dayjs';
import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
import {
	getIntervalDiscretes,
	getLocalIntervals,
	groupIntervalsByDay,
	isIntervalInTimeInterval,
	serialize,
	unionIntervals,
} from './intervals';
import { dateToId } from './dayjs/dateIds';

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
});

describe('groupIntervalsByDay', () => {
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
		const result = groupIntervalsByDay(intervals);
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
		const result = groupIntervalsByDay(intervals);
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