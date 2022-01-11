import dayjs from 'dayjs';
import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { unionIntervals } from '$lib/core/utils/intervals';

export const getTimeBlocks = (localIntervals: Interval[]): Interval[] => {
	const today = dayjs().startOf('day');
	const timeIntervals = localIntervals.map(({ start, end }) => ({
		start: onDay(start, today),
		end: onDay(end, today),
	}));
	return unionIntervals(timeIntervals);
};
