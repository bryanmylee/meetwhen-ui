import { MeetingConverter } from '$lib/models';
import type { Meeting, MeetingData } from '$lib/models';
import {
	collection,
	getDocs,
	query,
	QuerySnapshot,
	where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { findAllSchedulesWithMeetingId } from '../schedules/findAllSchedulesWithMeetingId';

export const findMeetingWithSlug = async (
	repo: Firestore,
	slug: string,
): Promise<Maybe<Id<Meeting>>> => {
	const meetingSnapshot = (await getDocs(
		query(collection(repo, 'meetings'), where('slug', '==', slug)),
	)) as QuerySnapshot<MeetingData>;
	if (meetingSnapshot.docs.length !== 1) {
		return undefined;
	}
	const doc = meetingSnapshot.docs[0];
	const schedules = await findAllSchedulesWithMeetingId(repo, doc.id);
	const meeting = MeetingConverter.parse(doc.data());
	return { ...meeting, schedules, id: doc.id };
};
