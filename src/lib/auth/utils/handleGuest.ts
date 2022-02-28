import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { Auth, UserCredential, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { findGuestWithMeetingIdAndPasscode } from '$lib/firebase';
import { addNewGuest, fetchUserEmail } from '$lib/api';
import { getGuestEmail } from './getGuestEmail';
import type { Interval } from '$lib/core/types';
import { deleteGuest } from '$lib/api/deleteGuest';

export interface GuestJoinProps {
	username: string;
	meetingId: string;
	intervals: Interval[];
}

export interface GuestJoinResult {
	credential: UserCredential;
	passcode: string;
}

export const guestJoin = async (
	auth: Auth,
	repo: Firestore,
	{ username, meetingId, intervals }: GuestJoinProps,
): Promise<GuestJoinResult> => {
	const { passcode } = await addNewGuest({
		username,
		meetingId,
		intervals,
	});
	const email = getGuestEmail(username, meetingId);
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		passcode,
	);
	return {
		passcode,
		credential: userCredential,
	};
};

export interface GuestSignInProps {
	meetingId: string;
	passcode: string;
}

export const guestSignIn = async (
	auth: Auth,
	repo: Firestore,
	{ meetingId, passcode }: GuestSignInProps,
): Promise<UserCredential> => {
	const guestData = await findGuestWithMeetingIdAndPasscode(
		repo,
		meetingId,
		passcode,
	);
	if (guestData === undefined) {
		throw new Error('Invalid passcode');
	}
	const email = await fetchUserEmail(guestData.id);
	return await signInWithEmailAndPassword(auth, email, passcode);
};

export interface GuestLeaveProps {
	user: User;
}

export const guestLeave = async (
	auth: Auth,
	repo: Firestore,
	{ user }: GuestLeaveProps,
): Promise<void> => {
	const idToken = await user.getIdToken();
	await deleteGuest({ userId: user.uid, idToken });
	signOut(auth);
};
