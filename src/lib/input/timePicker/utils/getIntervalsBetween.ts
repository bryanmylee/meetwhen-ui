import type { Interval } from '$lib/core/types';
import {
	dateFromId,
	dateTimeDecomposeId,
	onDay,
	timeFromId,
} from '$lib/core/utils/dayjs';
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
