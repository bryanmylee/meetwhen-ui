import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { customAlphabet } from 'nanoid';
import dayjs from 'dayjs';
import type { Id } from '$lib/core/types/Id';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting } from '$lib/models/Meeting';
import { getTotalInterval } from '$lib/core/utils/intervals';

const generateSlug = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	12,
);

export const addMeeting = async (
	repo: Firestore,
	meeting: Omit<Meeting, 'slug' | 'created' | 'ownerId' | 'total'>,
	currentUser?: User,
): Promise<Id<Meeting>> => {
	const slug = generateSlug();
	const created = dayjs();
	const ownerId = currentUser?.uid;
	const total = getTotalInterval(meeting.intervals);
	const meetingData = MeetingConverter.serialize({
		...meeting,
		slug,
		created,
		ownerId,
		total,
	});
	const doc = await addDoc(collection(repo, 'meetings'), meetingData);
	return {
		id: doc.id,
		slug,
		created,
		ownerId,
		total,
		...meeting,
	};
};
