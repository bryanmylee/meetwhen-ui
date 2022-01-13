import type { Interval } from '$lib/core/types/Interval';
import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
import { dateTimeDecomposeId } from '$lib/core/utils/dayjs/dateTimeIds';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
import { getDatesBetween } from './getDatesBetween';

export interface GetIntervalsBetweenArgs {
	fromId: string;
	toId: string;
	dateIds: string[];
	resolution: number;
}

export const getIntervalsBetween = ({
	fromId,
	toId,
	dateIds,
	resolution,
}: GetIntervalsBetweenArgs): Interval[] => {
	const [fromDateId, fromTimeId] = dateTimeDecomposeId(fromId);
	const [toDateId, toTimeId] = dateTimeDecomposeId(toId);
	const betweenDates = getDatesBetween(
		dateFromId(toDateId),
		dateFromId(fromDateId),
		dateIds.map(dateFromId),
	);
	let startTime = timeFromId(fromTimeId);
	let currentTime = timeFromId(toTimeId);
	if (startTime.isAfter(currentTime)) {
		const temp = startTime;
		startTime = currentTime;
		currentTime = temp;
	}
	return betweenDates.map((date) => ({
		start: onDay(startTime, date),
		end: onDay(currentTime, date).add(resolution, 'minutes'),
	}));
};
