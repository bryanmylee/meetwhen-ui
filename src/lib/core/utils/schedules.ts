import type { Schedule } from '$lib/models/Schedule';
import type { Dayjs } from 'dayjs';
import { Set } from 'immutable';
import type { Maybe } from '../types/Maybe';
import type { Moment } from '../types/Moment';
import type { UserIdsInterval } from '../types/UserIdsInterval';

export interface UserIdMoment extends Moment {
	userId: string;
}

const userIdMomentsToIntervals = (
	moments: UserIdMoment[],
): UserIdsInterval[] => {
	moments.sort((a, b) => {
		if (a.value.isSame(b.value)) {
			// order beginning moments first.
			return a.isEnd ? 1 : -1;
		}
		return a.value.diff(b.value);
	});
	const intervals: UserIdsInterval[] = [];
	let currStart: Maybe<Dayjs> = undefined;
	let currentUserIds = Set<string>();
	moments.forEach((moment) => {
		if (currStart !== undefined) {
			intervals.push({
				start: currStart,
				end: moment.value,
				userIds: currentUserIds,
			});
		}
		currStart = moment.value;
		if (moment.isEnd) {
			currentUserIds = currentUserIds.remove(moment.userId);
		} else {
			currentUserIds = currentUserIds.add(moment.userId);
		}
	});
	return intervals.filter(
		({ start, end, userIds }) => !start.isSame(end) && userIds.size !== 0,
	);
};

export const getOverlappedSchedules = (
	schedules: Schedule[],
): UserIdsInterval[] => {
	const moments: UserIdMoment[] = [];
	schedules.forEach(({ userId, intervals }) => {
		intervals.forEach(({ start, end }) => {
			moments.push(
				{ value: start, isEnd: false, userId },
				{ value: end, isEnd: true, userId },
			);
		});
	});
	return userIdMomentsToIntervals(moments);
};
