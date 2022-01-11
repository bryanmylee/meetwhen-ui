import type { Interval } from '$lib/core/types/Interval';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { getIntervalDiscretes } from '$lib/core/utils/intervals';
import dayjs from 'dayjs';
import type { TimeCell } from '../types/TimeCell';

export const getLocalTimeCells = (
	localIntervals: Interval[],
	resolution: number,
): TimeCell[] => {
	const today = dayjs();
	const timeCells: TimeCell[] = [];
	localIntervals.forEach((interval) => {
		const discretes = getIntervalDiscretes(interval, resolution);
		const intervalTimeCells: TimeCell[] = discretes.map((discrete) => ({
			isStartOfBlock: false,
			isEndOfBlock: false,
			time: onDay(discrete, today),
		}));
		intervalTimeCells[0].isStartOfBlock = true;
		intervalTimeCells[intervalTimeCells.length - 1].isEndOfBlock = true;
		timeCells.push(...intervalTimeCells);
	});
	timeCells.sort((a, b) => a.time.diff(b.time));
	return timeCells;
};
