import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Firestore, CollectionReference } from 'firebase/firestore';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting, MeetingData } from '$lib/models/Meeting';

export const getMeetingsFromIds = async (
	repo: Firestore,
	meetingIds: string[],
): Promise<Meeting[]> => {
	if (meetingIds.length === 0) {
		return [];
	}
	const meetingsRef = collection(
		repo,
		'meeting',
	) as CollectionReference<MeetingData>;
	const meetingsQuery = query(meetingsRef, where('__name__', 'in', meetingIds));
	const meetingsSnapshot = await getDocs(meetingsQuery);
	if (meetingsSnapshot.empty) return [];
	return meetingsSnapshot.docs
		.map((document) => document.data())
		.map(MeetingConverter.parse);
};
