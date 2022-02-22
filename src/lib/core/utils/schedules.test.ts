import dayjs from 'dayjs';
import type { Schedule } from '$lib/models';
import type { UserIdsInterval } from '../types/UserIdsInterval';
import { getOverlappedSchedules } from './schedules';
import { Set } from 'immutable';

const today = dayjs().startOf('day');

describe('getOverlappedSchedules', () => {
	it('overlaps schedules', () => {
		const schedules: Schedule[] = [
			{
				userId: '1',
				meetingId: '',
				intervals: [
					{
						start: today.hour(8),
						end: today.hour(10),
					},
				],
				total: { start: today.hour(8), end: today.hour(10) },
			},
			{
				userId: '2',
				meetingId: '',
				intervals: [
					{
						start: today.hour(9),
						end: today.hour(11),
					},
				],
				total: { start: today.hour(9), end: today.hour(11) },
			},
		];
		const expected: UserIdsInterval[] = [
			{
				start: today.hour(8),
				end: today.hour(9),
				userIds: Set(['1']),
			},
			{
				start: today.hour(9),
				end: today.hour(10),
				userIds: Set(['1', '2']),
			},
			{
				start: today.hour(10),
				end: today.hour(11),
				userIds: Set(['2']),
			},
		];
		const result = getOverlappedSchedules(schedules);
		expect(result.length).toBe(expected.length);
		result.forEach((res, i) => {
			expect(res.start).toEqual(expected[i].start);
			expect(res.end).toEqual(expected[i].end);
			expect(res.userIds).toEqual(expected[i].userIds);
		});
	});

	it('accounts for adjacent schedules', () => {
		const schedules: Schedule[] = [
			{
				userId: '1',
				meetingId: '',
				intervals: [
					{
						start: today.hour(8),
						end: today.hour(9),
					},
				],
				total: { start: today.hour(8), end: today.hour(9) },
			},
			{
				userId: '2',
				meetingId: '',
				intervals: [
					{
						start: today.hour(9),
						end: today.hour(10),
					},
				],
				total: { start: today.hour(9), end: today.hour(10) },
			},
			{
				userId: '3',
				meetingId: '',
				intervals: [
					{
						start: today.hour(9),
						end: today.hour(11),
					},
				],
				total: { start: today.hour(9), end: today.hour(11) },
			},
		];
		const expected: UserIdsInterval[] = [
			{
				start: today.hour(8),
				end: today.hour(9),
				userIds: Set(['1']),
			},
			{
				start: today.hour(9),
				end: today.hour(10),
				userIds: Set(['2', '3']),
			},
			{
				start: today.hour(10),
				end: today.hour(11),
				userIds: Set(['3']),
			},
		];
		const result = getOverlappedSchedules(schedules);
		expect(result.length).toBe(expected.length);
		result.forEach((res, i) => {
			expect(res.start).toEqual(expected[i].start);
			expect(res.end).toEqual(expected[i].end);
			expect(res.userIds).toEqual(expected[i].userIds);
		});
	});

	it('accounts for blanks between schedules', () => {
		const schedules: Schedule[] = [
			{
				userId: '1',
				meetingId: '',
				intervals: [
					{
						start: today.hour(8),
						end: today.hour(9),
					},
				],
				total: { start: today.hour(8), end: today.hour(9) },
			},
			{
				userId: '2',
				meetingId: '',
				intervals: [
					{
						start: today.hour(10),
						end: today.hour(11),
					},
				],
				total: { start: today.hour(10), end: today.hour(11) },
			},
		];
		const expected: UserIdsInterval[] = [
			{
				start: today.hour(8),
				end: today.hour(9),
				userIds: Set(['1']),
			},
			{
				start: today.hour(10),
				end: today.hour(11),
				userIds: Set(['2']),
			},
		];
		const result = getOverlappedSchedules(schedules);
		expect(result.length).toBe(expected.length);
		result.forEach((res, i) => {
			expect(res.start).toEqual(expected[i].start);
			expect(res.end).toEqual(expected[i].end);
			expect(res.userIds).toEqual(expected[i].userIds);
		});
	});

	it('overlaps multiple intervals per schedule', () => {
		const schedules: Schedule[] = [
			{
				userId: '1',
				meetingId: '',
				intervals: [
					{
						start: today.hour(8),
						end: today.hour(9),
					},
					{
						start: today.hour(10),
						end: today.hour(11),
					},
				],
				total: { start: today.hour(8), end: today.hour(11) },
			},
			{
				userId: '2',
				meetingId: '',
				intervals: [
					{
						start: today.hour(9),
						end: today.hour(10),
					},
					{
						start: today.hour(11),
						end: today.hour(12),
					},
				],
				total: { start: today.hour(9), end: today.hour(12) },
			},
		];
		const expected: UserIdsInterval[] = [
			{
				start: today.hour(8),
				end: today.hour(9),
				userIds: Set(['1']),
			},
			{
				start: today.hour(9),
				end: today.hour(10),
				userIds: Set(['2']),
			},
			{
				start: today.hour(10),
				end: today.hour(11),
				userIds: Set(['1']),
			},
			{
				start: today.hour(11),
				end: today.hour(12),
				userIds: Set(['2']),
			},
		];
		const result = getOverlappedSchedules(schedules);
		expect(result.length).toBe(expected.length);
		result.forEach((res, i) => {
			expect(res.start).toEqual(expected[i].start);
			expect(res.end).toEqual(expected[i].end);
			expect(res.userIds).toEqual(expected[i].userIds);
		});
	});
});
