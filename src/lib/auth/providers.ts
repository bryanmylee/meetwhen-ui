import {
	GoogleAuthProvider,
	OAuthProvider,
	TwitterAuthProvider,
} from 'firebase/auth';

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
export const twitterProvider = new TwitterAuthProvider();
