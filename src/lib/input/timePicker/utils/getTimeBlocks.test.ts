import type { Interval } from '$lib/core/types/Interval';
import { getTimeBlocks } from './getTimeBlocks';
import { parseTime } from '$lib/core/utils/parseTime';
import { serialize } from '$lib/core/utils/intervals';

it('gets blocks in a day', () => {
	const intervals: Interval[] = [
		{
			start: parseTime('08:00'),
			end: parseTime('09:00'),
		},
		{
			start: parseTime('08:30'),
			end: parseTime('09:30'),
		},
		{
			start: parseTime('10:00'),
			end: parseTime('11:00'),
		},
	];

	const blocks = getTimeBlocks(intervals);
	const expected = [
		{
			start: parseTime('08:00'),
			end: parseTime('09:30'),
		},
		{
			start: parseTime('10:00'),
			end: parseTime('11:00'),
		},
	].map(serialize);

	expect(blocks.map(serialize)).toEqual(expected);
});

it('gets blocks in multiple days', () => {
	const intervals: Interval[] = [
		{
			start: parseTime('08:00').add(1, 'day'),
			end: parseTime('09:00').add(1, 'day'),
		},
		{
			start: parseTime('08:30'),
			end: parseTime('09:30'),
		},
		{
			start: parseTime('10:00').add(1, 'day'),
			end: parseTime('11:00').add(1, 'day'),
		},
	];

	const blocks = getTimeBlocks(intervals);
	const expected = [
		{
			start: parseTime('08:00'),
			end: parseTime('09:30'),
		},
		{
			start: parseTime('10:00'),
			end: parseTime('11:00'),
		},
	].map(serialize);

	expect(blocks.map(serialize)).toEqual(expected);
});
