import type { CustomUserData } from '$lib/models/CustomUserData';
import { setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface AddAnonymousUser {
	userId: string;
	meetingId: string;
}

export const addAnonymousUser = async (
	repo: Firestore,
	{ userId, meetingId }: AddAnonymousUser,
): Promise<CustomUserData> => {
	await setDoc(doc(repo, 'anonymous-users', userId), {
		meetingId,
	});
	return {
		meetingId,
	};
};
