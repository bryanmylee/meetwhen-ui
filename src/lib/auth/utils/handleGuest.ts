import {
	updateProfile,
	createUserWithEmailAndPassword,
	deleteUser,
	reauthenticateWithCredential,
	EmailAuthProvider,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import type { Auth, UserCredential, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import {
	addGuestUserData,
	deleteGuestUserData,
	getGuestUserWithId,
	findGuestWithMeetingIdAndPasscode,
} from '$lib/firebase';
import { generateSignInCode } from './generateSignInCode';
import { getGuestEmail } from './getGuestEmail';
import { fetchUserEmail } from '$lib/api/fetchUserEmail';

export interface GuestJoinProps {
	username: string;
	meetingId: string;
}

export interface GuestJoinResult {
	credential: UserCredential;
	passcode: string;
}

export const guestJoin = async (
	auth: Auth,
	repo: Firestore,
	{ username, meetingId }: GuestJoinProps,
): Promise<GuestJoinResult> => {
	const email = getGuestEmail(username, meetingId);
	const passcode = generateSignInCode();
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		passcode,
	);
	await updateProfile(userCredential.user, {
		displayName: username,
	});
	await addGuestUserData(repo, {
		userId: userCredential.user.uid,
		passcode,
		meetingId,
	});
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
	if (user.email === null) {
		throw new Error('Failed to delete user due to missing email');
	}
	const userData = await getGuestUserWithId(repo, user.uid);
	if (userData === undefined) {
		throw new Error('Failed to delete user due to missing user data');
	}
	const userCredential = EmailAuthProvider.credential(
		user.email,
		userData.passcode,
	);
	await reauthenticateWithCredential(user, userCredential);
	await deleteUser(user);
	await deleteGuestUserData(repo, {
		userId: user.uid,
	});
};
