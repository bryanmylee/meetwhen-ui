import { gridArea } from '$lib/core/components/grid';
import type { Interval } from '$lib/core/types/Interval';
import { dateToId } from '$lib/core/utils/dayjs/dateIds';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';

export interface IntervalGridAreaProps {
	dateIdToColumnNumber: Record<string, number>;
	timeIdToRowNumber: Record<string, number>;
	resolution: number;
	interval: Interval;
}

export const intervalGridArea = ({
	dateIdToColumnNumber,
	timeIdToRowNumber,
	resolution,
	interval: { start, end },
}: IntervalGridAreaProps): string => {
	const adjustedEnd = end.subtract(resolution, 'minutes');
	return gridArea({
		x: dateIdToColumnNumber[dateToId(start)],
		y: timeIdToRowNumber[timeToId(start)],
		endX: dateIdToColumnNumber[dateToId(adjustedEnd)] + 1,
		endY: timeIdToRowNumber[timeToId(adjustedEnd)] + 1,
	});
};
