import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { getIntervalDiscretes } from '$lib/core/utils/intervals';
import dayjs from 'dayjs';
import type { TimeCell } from '../types/TimeCell';
import { getLocalTimeBlocks } from './getLocalTimeBlocks';

export const getLocalTimeCells = (
	localIntervals: Interval[],
	resolution: number,
	day = dayjs().startOf('day'),
): TimeCell[] => {
	if (localIntervals.length === 0) {
		return [];
	}
	const localTimeBlocks = getLocalTimeBlocks(localIntervals);
	const latestTime = onDay(
		localTimeBlocks[localTimeBlocks.length - 1].end.subtract(
			resolution,
			'minutes',
		),
		day,
	);
	const timeCells: TimeCell[] = [];
	localIntervals.forEach((interval) => {
		const discretes = getIntervalDiscretes(interval, resolution);
		const intervalTimeCells: TimeCell[] = discretes.map((discrete) => ({
			isStartOfBlock: false,
			isEndOfBlock: false,
			isEndOfDate: false,
			time: onDay(discrete, day),
		}));
		intervalTimeCells[0].isStartOfBlock = true;
		const lastIntervalTimeCell =
			intervalTimeCells[intervalTimeCells.length - 1];
		lastIntervalTimeCell.isEndOfBlock = true;
		lastIntervalTimeCell.isEndOfDate = latestTime.isSame(
			onDay(lastIntervalTimeCell.time, day),
		);
		timeCells.push(...intervalTimeCells);
	});
	timeCells.sort((a, b) => a.time.diff(b.time));
	return timeCells;
};
