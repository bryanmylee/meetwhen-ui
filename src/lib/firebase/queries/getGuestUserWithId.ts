import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { GuestUserData } from '$lib/models';

export const getGuestUserWithId = async (
	repo: Firestore,
	userId: string,
): Promise<Maybe<GuestUserData>> => {
	const userSnapshot = await getDoc(doc(repo, 'guest-user', userId));
	if (!userSnapshot.exists()) {
		return undefined;
	}
	return userSnapshot.data() as GuestUserData;
};
