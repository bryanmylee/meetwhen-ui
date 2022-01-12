import { Set } from 'immutable';
import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { getIntervalDiscretes } from '$lib/core/utils/intervals';
import dayjs from 'dayjs';
import type { TimeCell } from '../types/TimeCell';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';

export const getLocalTimeCells = (
	localIntervals: Interval[],
	localTimeBlocks: Interval[],
	resolution: number,
	day = dayjs().startOf('day'),
): TimeCell[] => {
	if (localIntervals.length === 0) {
		return [];
	}
	const blockEndTimeIds = Set(
		localTimeBlocks
			.map((block) => block.end.subtract(resolution, 'minutes'))
			.map(timeToId),
	);
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
			isStartOfInterval: false,
			isEndOfInterval: false,
			isEndOfBlock: false,
			isEndOfDate: false,
			time: onDay(discrete, day),
		}));
		intervalTimeCells[0].isStartOfInterval = true;
		const lastIntervalTimeCell =
			intervalTimeCells[intervalTimeCells.length - 1];
		lastIntervalTimeCell.isEndOfInterval = true;
		lastIntervalTimeCell.isEndOfBlock = blockEndTimeIds.some(
			(id) => timeToId(lastIntervalTimeCell.time) === id,
		);
		lastIntervalTimeCell.isEndOfDate = latestTime.isSame(
			onDay(lastIntervalTimeCell.time, day),
		);
		timeCells.push(...intervalTimeCells);
	});
	timeCells.sort((a, b) => a.time.diff(b.time));
	return timeCells;
};
