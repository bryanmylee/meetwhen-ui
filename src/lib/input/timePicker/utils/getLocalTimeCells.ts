import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';
import { getIntervalDiscretes } from '$lib/core/utils/intervals';
import dayjs from 'dayjs';
import { Set } from 'immutable';
import type { TimeCell } from '../types/TimeCell';
import { getLocalTimeBlocks } from './getLocalTimeBlocks';

export const getLocalTimeCells = (
	localIntervals: Interval[],
	resolution: number,
): TimeCell[] => {
	const today = dayjs();
	const localTimeBlocks = getLocalTimeBlocks(localIntervals);
	const endOfBlockTimeIds = Set(
		localTimeBlocks.map(({ end }) => timeToId(end)),
	);
	const timeCells: TimeCell[] = [];
	localIntervals.forEach((interval) => {
		const discretes = getIntervalDiscretes(interval, resolution);
		const intervalTimeCells: TimeCell[] = discretes.map((discrete) => ({
			isEndOfBlock: false,
			time: onDay(discrete, today),
		}));
		if (endOfBlockTimeIds.includes(timeToId(interval.end))) {
			intervalTimeCells[intervalTimeCells.length - 1].isEndOfBlock = true;
		}
		timeCells.push(...intervalTimeCells);
	});
	timeCells.sort((a, b) => a.time.diff(b.time));
	return timeCells;
};
