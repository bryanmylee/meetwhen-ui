import type { CustomUserData } from '$lib/models/CustomUserData';
import { setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface AddGuestUserData {
	userId: string;
	meetingId: string;
}

export const addGuestUserData = async (
	repo: Firestore,
	{ userId, meetingId }: AddGuestUserData,
): Promise<CustomUserData> => {
	await setDoc(doc(repo, 'guest-users', userId), {
		meetingId,
	});
	return {
		meetingId,
	};
};
