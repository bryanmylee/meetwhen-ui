import type { Interval } from '$lib/core/types';
import { getFlattenedTimeBlocks } from './getFlattenedTimeBlocks';
import { timeFromId } from '$lib/core/utils/dayjs';
import { serialize } from '$lib/core/utils';

it('gets blocks in a day', () => {
	const intervals: Interval[] = [
		{
			start: timeFromId('08:00'),
			end: timeFromId('09:00'),
		},
		{
			start: timeFromId('08:30'),
			end: timeFromId('09:30'),
		},
		{
			start: timeFromId('10:00'),
			end: timeFromId('11:00'),
		},
	];

	const blocks = getFlattenedTimeBlocks(intervals);
	const expected = [
		{
			start: timeFromId('08:00'),
			end: timeFromId('09:30'),
		},
		{
			start: timeFromId('10:00'),
			end: timeFromId('11:00'),
		},
	].map(serialize);

	expect(blocks.map(serialize)).toEqual(expected);
});

it('gets blocks in multiple days', () => {
	const intervals: Interval[] = [
		{
			start: timeFromId('08:00').add(1, 'day'),
			end: timeFromId('09:00').add(1, 'day'),
		},
		{
			start: timeFromId('08:30'),
			end: timeFromId('09:30'),
		},
		{
			start: timeFromId('10:00').add(1, 'day'),
			end: timeFromId('11:00').add(1, 'day'),
		},
	];

	const blocks = getFlattenedTimeBlocks(intervals);
	const expected = [
		{
			start: timeFromId('08:00'),
			end: timeFromId('09:30'),
		},
		{
			start: timeFromId('10:00'),
			end: timeFromId('11:00'),
		},
	].map(serialize);

	expect(blocks.map(serialize)).toEqual(expected);
});

it('gets blocks with adjacent intervals over midnight', () => {
	const intervals: Interval[] = [
		{
			start: timeFromId('22:00'),
			end: timeFromId('00:00').add(1, 'day'),
		},
		{
			start: timeFromId('00:00').add(1, 'day'),
			end: timeFromId('02:00').add(1, 'day'),
		},
	];

	const blocks = getFlattenedTimeBlocks(intervals);
	const expected = [
		{
			start: timeFromId('00:00'),
			end: timeFromId('02:00'),
		},
		{
			start: timeFromId('22:00'),
			end: timeFromId('00:00').add(1, 'day'),
		},
	].map(serialize);

	expect(blocks.map(serialize)).toEqual(expected);
});
