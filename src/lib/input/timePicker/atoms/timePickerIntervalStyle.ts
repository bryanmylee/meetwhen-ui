import { gridItemStyle } from '$lib/core/components/grid';
import type { Interval } from '$lib/core/types/Interval';
import { dateToId } from '$lib/core/utils/dayjs/dateIds';
import { timeToId } from '$lib/core/utils/dayjs/timeIds';

export interface TimePickerIntervalProps {
	dateIdToColumnNumber: Record<string, number>;
	timeIdToRowNumber: Record<string, number>;
	resolution: number;
	interval: Interval;
}

export const timePickerIntervalStyle = ({
	dateIdToColumnNumber,
	timeIdToRowNumber,
	resolution,
	interval: { start, end },
}: TimePickerIntervalProps): string => {
	const adjustedEnd = end.subtract(resolution, 'minutes');
	return gridItemStyle({
		x: dateIdToColumnNumber[dateToId(start)],
		y: timeIdToRowNumber[timeToId(start)],
		endX: dateIdToColumnNumber[dateToId(adjustedEnd)] + 1,
		endY: timeIdToRowNumber[timeToId(adjustedEnd)] + 1,
	});
};
