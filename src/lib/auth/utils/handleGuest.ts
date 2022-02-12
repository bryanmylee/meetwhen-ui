import {
	updateProfile,
	createUserWithEmailAndPassword,
	deleteUser,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from 'firebase/auth';
import type { Auth, UserCredential, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { addGuestUserData } from '$lib/firebase/mutations/addGuestUserData';
import { deleteGuestUserData } from '$lib/firebase/mutations/deleteGuestUserData';
import { generateSignInCode } from './generateSignInCode';
import { getGuestEmail } from './getGuestEmail';
import { getGuestUserWithId } from '$lib/firebase/queries/getGuestUserWithId';

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
