import type { Interval } from '$lib/core/types/Interval';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';
import { getIntervalDiscretes } from '$lib/core/utils/intervals';
import { Set } from 'immutable';
import type { TimeCell } from '../types/TimeCell';
import { getTimeBlocks } from './getTimeBlocks';

export const getTimeCells = (
	intervals: Interval[],
	resolution: number,
): TimeCell[] => {
	const timeBlocks = getTimeBlocks(intervals);
	const endOfBlockTimeIds = Set(timeBlocks.map(({ end }) => timeToId(end)));
	const timeCells: TimeCell[] = [];
	intervals.forEach((interval) => {
		const discretes = getIntervalDiscretes(interval, resolution);
		const intervalTimeCells: TimeCell[] = discretes.map((discrete) => ({
			isEndOfBlock: false,
			time: discrete,
		}));
		if (endOfBlockTimeIds.includes(timeToId(interval.end))) {
			intervalTimeCells[intervalTimeCells.length - 1].isEndOfBlock = true;
		}
		timeCells.push(...intervalTimeCells);
	});
	return timeCells;
};
