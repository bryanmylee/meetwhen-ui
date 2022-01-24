import type { Id } from '$lib/core/types/Id';
import type { Maybe } from '$lib/core/types/Maybe';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting } from '$lib/models/Meeting';
import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { customAlphabet } from 'nanoid';

const generateSlug = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	12,
);

export const addMeeting = async (
	repo: Firestore,
	meeting: Omit<Meeting, 'slug' | 'ownerId'>,
	currentUser?: User,
): Promise<Maybe<Id<Meeting>>> => {
	const slug = generateSlug();
	const meetingData = MeetingConverter.serialize({ ...meeting, slug });
	const doc = await addDoc(collection(repo, 'meetings'), meetingData);
	return {
		id: doc.id,
		slug,
		...(currentUser ? { ownerId: currentUser.uid } : {}),
		...meeting,
	};
};
