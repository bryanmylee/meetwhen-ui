import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { customAlphabet } from 'nanoid';
import dayjs from 'dayjs';
import type { Id } from '$lib/core/types/Id';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting } from '$lib/models/Meeting';
import { getTotalInterval } from '$lib/core/utils/intervals';
import { fetchLinkPreviews } from '$lib/api/fetchLinkPreviews';

const generateSlug = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	12,
);

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
	const slug = generateSlug();
	const created = dayjs();
	const ownerId = currentUser?.uid;
	const total = getTotalInterval(addMeeting.intervals);
	const links = await fetchLinkPreviews(addMeeting.links);
	const newMeetingData = MeetingConverter.serialize({
		...addMeeting,
		slug,
		created,
		ownerId,
		total,
		links,
		schedules: [],
	});
	const doc = await addDoc(collection(repo, 'meetings'), newMeetingData);
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
