import type { Maybe } from '$lib/core/types/Maybe';
import {
	signInAnonymously,
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
	currentUser: Maybe<User>;
}

export const passwordSignIn = async (
	auth: Auth,
	{ email, password, currentUser }: PasswordSignInProps,
): Promise<UserCredential> => {
	if (currentUser === undefined) {
		return await signInWithEmailAndPassword(auth, email, password);
	}
	const credential = EmailAuthProvider.credential(email, password);
	return linkWithCredential(currentUser, credential);
};

export interface AnonymousSignInProps {
	currentUser: Maybe<User>;
}

export const anonymousSignIn = async (
	auth: Auth,
	{ currentUser }: AnonymousSignInProps,
): Promise<UserCredential> => {
	if (currentUser !== undefined) {
		throw new Error('Cannot sign in anonymously when already signed in.');
	}
	return signInAnonymously(auth);
};

export interface OAuthSignInProps {
	providerType: OAuthProviderType;
	currentUser: Maybe<User>;
}

export const oAuthSignIn = async (
	auth: Auth,
	{ providerType, currentUser }: OAuthSignInProps,
): Promise<UserCredential> => {
	const provider = providers[providerType];
	if (currentUser === undefined) {
		return await signInWithRedirect(auth, provider);
	}
	return await linkWithRedirect(currentUser, provider);
};
