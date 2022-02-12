import { addAnonymousUser } from '$lib/firebase/mutations/addAnonymousUser';
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';
import type { Auth, UserCredential } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { generateSignInCode } from './generateSignInCode';
import { getGuestEmail } from './getGuestEmail';

export interface AnonymousJoinProps {
	username: string;
	meetingId: string;
}

export const anonymousJoin = async (
	auth: Auth,
	repo: Firestore,
	{ username, meetingId }: AnonymousJoinProps,
): Promise<UserCredential> => {
	const email = getGuestEmail(username, meetingId);
	const password = generateSignInCode();
	console.log({ email, password });
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		password,
	);
	await updateProfile(userCredential.user, {
		displayName: username,
	});
	await addAnonymousUser(repo, {
		userId: userCredential.user.uid,
		meetingId,
	});
	return userCredential;
};
