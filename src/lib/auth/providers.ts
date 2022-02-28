import {
	GoogleAuthProvider,
	OAuthProvider,
	TwitterAuthProvider,
	GithubAuthProvider,
} from 'firebase/auth';

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
export const twitterProvider = new TwitterAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const providers = {
	google: googleProvider,
	apple: appleProvider,
	twitter: twitterProvider,
	github: githubProvider,
} as const;

export type OAuthProviderType = keyof typeof providers;
