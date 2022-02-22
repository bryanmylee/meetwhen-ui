import type { GuestUserData } from '$lib/models';
import { setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface AddGuestUserData {
	userId: string;
	passcode: string;
	meetingId: string;
}

export const addGuestUserData = async (
	repo: Firestore,
	{ userId, meetingId, passcode }: AddGuestUserData,
): Promise<GuestUserData> => {
	await setDoc(doc(repo, 'guest-users', userId), {
		meetingId,
		passcode,
	});
	return {
		meetingId,
		passcode,
	};
};
