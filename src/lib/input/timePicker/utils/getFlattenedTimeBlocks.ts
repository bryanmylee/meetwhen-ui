import dayjs from 'dayjs';
import type { Interval } from '$lib/core/types/Interval';
import { localIntervalOnDay, unionIntervals } from '$lib/core/utils/intervals';

/**
 * Get time blocks for a set of intervals across all dates.
 * @param localIntervals The local intervals to block together.
 * @returns The time blocks sorted in ascending order.
 */
export const getFlattenedTimeBlocks = (
	localIntervals: Interval[],
	day = dayjs().startOf('day'),
): Interval[] => {
	const timeIntervals = localIntervals.map((interval) =>
		localIntervalOnDay(interval, day),
	);
	const blocks = unionIntervals(timeIntervals);
	blocks.sort((a, b) => a.start.diff(b.start));
	return blocks;
};
