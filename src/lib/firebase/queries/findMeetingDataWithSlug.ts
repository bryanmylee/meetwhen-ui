import type { Id } from '$lib/core/types/Id';
import type { Maybe } from '$lib/core/types/Maybe';
import type { MeetingData } from '$lib/models/Meeting';
import {
	collection,
	Firestore,
	getDocs,
	query,
	where,
} from 'firebase/firestore';

export const findMeetingDataWithSlug = async (
	repo: Firestore,
	slug: string,
): Promise<Maybe<Id<MeetingData>>> => {
	const meetingSnapshot = await getDocs(
		query(collection(repo, 'meeting'), where('slug', '==', slug)),
	);
	if (meetingSnapshot.docs.length !== 1) {
		return undefined;
	}
	const doc = meetingSnapshot.docs[0];
	return { ...doc.data(), id: doc.id } as Id<MeetingData>;
};
