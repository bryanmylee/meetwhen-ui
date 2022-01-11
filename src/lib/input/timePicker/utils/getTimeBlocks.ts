import dayjs from 'dayjs';
import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { unionIntervals } from '$lib/core/utils/intervals';

export const getTimeBlocks = (localIntervals: Interval[]): Interval[] => {
	const today = dayjs().startOf('day');
	const timeIntervals = localIntervals.map(({ start, end }) => ({
		start: onDay(start, today),
		end: end.hour() === 0 ? onDay(end, today).add(1, 'day') : onDay(end, today),
	}));
	const blocks = unionIntervals(timeIntervals);
	blocks.sort((a, b) => a.start.diff(b.start));
	return blocks;
};
