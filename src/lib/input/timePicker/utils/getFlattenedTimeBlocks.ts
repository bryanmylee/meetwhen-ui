import dayjs from 'dayjs';
import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { unionIntervals } from '$lib/core/utils/intervals';

/**
 * Get time blocks for a set of intervals across all dates.
 * @param localIntervals The local intervals to block together.
 * @returns The time blocks sorted in ascending order.
 */
export const getFlattenedTimeBlocks = (
	localIntervals: Interval[],
	day = dayjs().startOf('day'),
): Interval[] => {
	const timeIntervals = localIntervals.map(({ start, end }) => ({
		start: onDay(start, day),
		end: end.hour() === 0 ? onDay(end, day).add(1, 'day') : onDay(end, day),
	}));
	const blocks = unionIntervals(timeIntervals);
	blocks.sort((a, b) => a.start.diff(b.start));
	return blocks;
};
