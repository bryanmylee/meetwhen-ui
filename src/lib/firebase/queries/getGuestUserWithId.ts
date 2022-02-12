import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { UserData } from '$lib/models/UserData';
import type { Maybe } from '$lib/core/types/Maybe';

export const getGuestUserWithId = async (
	repo: Firestore,
	userId: string,
): Promise<Maybe<UserData>> => {
	const userSnapshot = await getDoc(doc(repo, 'guest-users', userId));
	if (!userSnapshot.exists()) {
		return undefined;
	}
	return userSnapshot.data() as UserData;
};
