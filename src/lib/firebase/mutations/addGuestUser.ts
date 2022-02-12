import type { CustomUserData } from '$lib/models/CustomUserData';
import { setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface AddGuestUser {
	userId: string;
	meetingId: string;
}

export const addGuestUser = async (
	repo: Firestore,
	{ userId, meetingId }: AddGuestUser,
): Promise<CustomUserData> => {
	await setDoc(doc(repo, 'guest-users', userId), {
		meetingId,
	});
	return {
		meetingId,
	};
};
