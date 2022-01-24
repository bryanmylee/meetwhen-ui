import type { Id } from '$lib/core/types/Id';
import type { Maybe } from '$lib/core/types/Maybe';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting } from '$lib/models/Meeting';
import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { customAlphabet } from 'nanoid';
import dayjs from 'dayjs';

const generateSlug = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	12,
);

export const addMeeting = async (
	repo: Firestore,
	meeting: Omit<Meeting, 'slug' | 'created' | 'ownerId'>,
	currentUser?: User,
): Promise<Maybe<Id<Meeting>>> => {
	const slug = generateSlug();
	const created = dayjs();
	const ownerId = currentUser?.uid;
	const meetingData = MeetingConverter.serialize({
		...meeting,
		slug,
		created,
		ownerId,
	});
	console.log(meetingData);
	const doc = await addDoc(collection(repo, 'meetings'), meetingData);
	return {
		id: doc.id,
		slug,
		created,
		ownerId,
		...meeting,
	};
};
