import type { Firestore, QueryConstraint } from 'firebase/firestore';
import type { Dayjs } from 'dayjs';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting, MeetingData } from '$lib/models/Meeting';
import {
	collection,
	getDocs,
	query,
	QuerySnapshot,
	where,
} from 'firebase/firestore';
import { getTotalInterval } from '$lib/core/utils/intervals';

export const findAllMeetingsOwnedByUser = async (
	repo: Firestore,
	userId: string,
	constraints?: QueryConstraint[],
): Promise<Id<Meeting>[]> => {
	const allConstraints = [
		where('ownerId', '==', userId),
		...(constraints ?? []),
	];
	const meetingSnapshot = (await getDocs(
		query(collection(repo, 'meetings'), ...allConstraints),
	)) as QuerySnapshot<MeetingData>;
	return meetingSnapshot.docs
		.map((doc) => [doc.id, doc.data()] as const)
		.map(([id, data]) => ({ ...MeetingConverter.parse(data), id }));
};

export const getEndFromMeetings = (meetings: Meeting[]): Dayjs => {
	return getTotalInterval(meetings[meetings.length - 1].intervals).end;
};

export interface FindAllMeetingsOwnedByUserProps {
	now?: Dayjs;
	limit?: number;
	afterEnd?: Dayjs;
}
