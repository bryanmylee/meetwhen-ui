import {
	linkWithRedirect,
	signInWithRedirect,
	EmailAuthProvider,
	linkWithCredential,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import type { Auth, User, UserCredential } from 'firebase/auth';
import { providers } from '../providers';
import type { OAuthProviderType } from '../providers';

export interface PasswordSignInProps {
	email: string;
	password: string;
	currentUser: Maybe<Nullable<User>>;
}

export const passwordSignIn = async (
	auth: Auth,
	{ email, password, currentUser }: PasswordSignInProps,
): Promise<UserCredential> => {
	if (currentUser == null) {
		return await signInWithEmailAndPassword(auth, email, password);
	}
	const credential = EmailAuthProvider.credential(email, password);
	return linkWithCredential(currentUser, credential);
};

export interface OAuthSignInProps {
	providerType: OAuthProviderType;
	currentUser: Maybe<Nullable<User>>;
}

export const oAuthSignIn = async (
	auth: Auth,
	{ providerType, currentUser }: OAuthSignInProps,
): Promise<UserCredential> => {
	const provider = providers[providerType];
	if (currentUser == null) {
		return await signInWithRedirect(auth, provider);
	}
	return await linkWithRedirect(currentUser, provider);
};
