import type { Dayjs } from 'dayjs';
import { Set } from 'immutable';
import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
import {
	dateTimeDecomposeId,
	dateTimeToId,
} from '$lib/core/utils/dayjs/dateTimeIds';
import { onDay } from '$lib/core/utils/dayjs/onDay';
import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
import { getIntervalDiscretes } from '$lib/core/utils/intervals';
import { getDatesBetween } from './getDatesBetween';

export const getTimePickerInterpolate =
	(dates: Dayjs[], validIdSet: Set<string>, resolution: number) =>
	(fromId: string, toId: string): string[] => {
		const [fromDateId, fromTimeId] = dateTimeDecomposeId(fromId);
		const [toDateId, toTimeId] = dateTimeDecomposeId(toId);
		let fromDate = dateFromId(fromDateId);
		let toDate = dateFromId(toDateId);
		let fromTime = timeFromId(fromTimeId);
		let toTime = timeFromId(toTimeId);
		if (fromDate.isAfter(toDate)) {
			const temp = fromDate;
			fromDate = toDate;
			toDate = temp;
		}
		if (fromTime.isAfter(toTime)) {
			const temp = fromTime;
			fromTime = toTime;
			toTime = temp;
		}
		const datesBetween = getDatesBetween(fromDate, toDate, dates);
		const timeDiscretes = getIntervalDiscretes({
			start: fromTime,
			end: toTime.add(resolution, 'minutes'),
		});
		const interpolatedDiscretes = datesBetween.flatMap((date) =>
			timeDiscretes.map((discrete) => onDay(discrete, date)),
		);
		const interpolatedIds = Set(interpolatedDiscretes.map(dateTimeToId));
		return interpolatedIds.intersect(validIdSet).toArray();
	};
