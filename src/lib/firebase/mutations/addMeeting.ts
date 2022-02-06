import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { customAlphabet } from 'nanoid';
import dayjs from 'dayjs';
import type { Id } from '$lib/core/types/Id';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting } from '$lib/models/Meeting';
import { getTotalInterval } from '$lib/core/utils/intervals';
import { fetchLinkPreviews } from '$lib/meeting/utils/fetchLinkPreviews';

const generateSlug = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	12,
);

export interface AddMeeting
	extends Omit<Meeting, 'slug' | 'created' | 'ownerId' | 'total' | 'links'> {
	links: string[];
}

export const addMeeting = async (
	repo: Firestore,
	meeting: AddMeeting,
	currentUser?: User,
): Promise<Id<Meeting>> => {
	const slug = generateSlug();
	const created = dayjs();
	const ownerId = currentUser?.uid;
	const total = getTotalInterval(meeting.intervals);
	const links = await fetchLinkPreviews(meeting.links);
	const meetingData = MeetingConverter.serialize({
		...meeting,
		slug,
		created,
		ownerId,
		total,
		links,
	});
	const doc = await addDoc(collection(repo, 'meetings'), meetingData);
	return {
		...meeting,
		id: doc.id,
		slug,
		created,
		ownerId,
		total,
		links,
	};
};
