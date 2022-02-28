import {
	collection,
	getDocs,
	query,
	QuerySnapshot,
	where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { GuestUserData } from '$lib/models';

export const findGuestWithMeetingIdAndPasscode = async (
	repo: Firestore,
	meetingId: string,
	passcode: string,
): Promise<Maybe<Id<GuestUserData>>> => {
	const userSnapshot = (await getDocs(
		query(
			collection(repo, 'guest-user'),
			where('meetingId', '==', meetingId),
			where('passcode', '==', passcode),
		),
	)) as QuerySnapshot<GuestUserData>;
	if (userSnapshot.docs.length !== 1) {
		return undefined;
	}
	const userData = userSnapshot.docs[0].data();
	return {
		id: userSnapshot.docs[0].id,
		...userData,
	};
};
