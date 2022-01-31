import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
	collection,
	getDocs,
	limit as limitAs,
	orderBy,
	query,
	QuerySnapshot,
	startAfter,
	startAt,
	where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Id } from '$lib/core/types/Id';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting, MeetingData } from '$lib/models/Meeting';
import { getTotalInterval } from '$lib/core/utils/intervals';

export interface FindAllUpcomingMeetingsOwnedByUserProps {
	now?: Dayjs;
	limit?: number;
	atEnd?: Dayjs;
	afterEnd?: Dayjs;
}

export const findAllUpcomingMeetingsOwnedByUser = async (
	repo: Firestore,
	userId: string,
	{
		now = dayjs(),
		limit = 5,
		atEnd,
		afterEnd,
	}: FindAllUpcomingMeetingsOwnedByUserProps = {},
): Promise<Id<Meeting>[]> => {
	const constraits = [
		where('ownerId', '==', userId),
		where('total.end', '>=', now.unix()),
		orderBy('total.end', 'asc'),
		limitAs(limit),
	];
	if (atEnd !== undefined && afterEnd !== undefined) {
		throw new Error('Cannot paginate with both `atEnd` and `afterEnd`');
	}
	if (atEnd !== undefined) {
		constraits.push(startAt(atEnd.unix()));
	} else if (afterEnd !== undefined) {
		constraits.push(startAfter(afterEnd.unix()));
	}
	const meetingSnapshot = (await getDocs(
		query(collection(repo, 'meetings'), ...constraits),
	)) as QuerySnapshot<MeetingData>;
	return meetingSnapshot.docs
		.map((doc) => [doc.id, doc.data()] as const)
		.map(([id, data]) => ({ ...MeetingConverter.parse(data), id }));
};

export const getEndFromMeetings = (meetings: Meeting[]): Dayjs => {
	return getTotalInterval(meetings[meetings.length - 1].intervals).end;
};
