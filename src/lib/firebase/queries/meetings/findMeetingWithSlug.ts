import { MeetingConverter } from '$lib/models';
import type { Meeting, MeetingData } from '$lib/models';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Firestore, Query } from 'firebase/firestore';
import { findAllSchedulesWithMeetingId } from '../schedules/findAllSchedulesWithMeetingId';

export const findMeetingWithSlugQuery = (
	repo: Firestore,
	slug: string,
): Query<MeetingData> =>
	query(
		collection(repo, 'meetings'),
		where('slug', '==', slug),
	) as Query<MeetingData>;

export const findMeetingWithSlug = async (
	repo: Firestore,
	slug: string,
): Promise<Maybe<Id<Meeting>>> => {
	const meetingSnapshot = await getDocs(findMeetingWithSlugQuery(repo, slug));
	if (meetingSnapshot.docs.length !== 1) {
		return undefined;
	}
	const doc = meetingSnapshot.docs[0];
	const schedules = await findAllSchedulesWithMeetingId(repo, doc.id);
	const meeting = MeetingConverter.parse(doc.data());
	return { ...meeting, schedules, id: doc.id };
};
