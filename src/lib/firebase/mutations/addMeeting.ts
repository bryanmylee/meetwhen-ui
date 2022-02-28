import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import dayjs from 'dayjs';
import { MeetingConverter } from '$lib/models';
import type { Meeting } from '$lib/models';
import { fetchLinkPreviews, fetchNewSlug } from '$lib/api';
import { getTotalInterval } from '$lib/core/utils';

export interface AddMeeting
	extends Pick<
		Meeting,
		'name' | 'description' | 'color' | 'emoji' | 'intervals'
	> {
	links: string[];
}

export const addMeeting = async (
	repo: Firestore,
	addMeeting: AddMeeting,
	currentUser?: User,
): Promise<Id<Meeting>> => {
	const slug = await fetchNewSlug();
	const created = dayjs();
	const ownerId = currentUser?.email?.endsWith('.guest')
		? undefined
		: currentUser?.uid;
	const total = getTotalInterval(addMeeting.intervals);
	const links =
		addMeeting.links.length === 0
			? undefined
			: await fetchLinkPreviews(addMeeting.links);
	const newMeetingData = MeetingConverter.serialize({
		...addMeeting,
		slug,
		created,
		ownerId,
		total,
		links,
	});
	const doc = await addDoc(collection(repo, 'meeting'), newMeetingData);
	return {
		...addMeeting,
		id: doc.id,
		slug,
		created,
		ownerId,
		total,
		links,
		schedules: [],
	};
};
