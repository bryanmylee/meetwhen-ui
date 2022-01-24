import type { Id } from '$lib/core/types/Id';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting, MeetingData } from '$lib/models/Meeting';
import {
	collection,
	getDocs,
	query,
	QuerySnapshot,
	where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export const findAllMeetingsOwnedByUser = async (
	repo: Firestore,
	userId: string,
): Promise<Id<Meeting>[]> => {
	const meetingSnapshot = (await getDocs(
		query(collection(repo, 'meetings'), where('ownerId', '==', userId)),
	)) as QuerySnapshot<MeetingData>;
	return meetingSnapshot.docs
		.map((doc) => [doc.id, doc.data()] as const)
		.map(([id, data]) => ({ ...MeetingConverter.parse(data), id }));
};
