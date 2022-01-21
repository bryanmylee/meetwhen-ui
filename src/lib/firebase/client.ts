import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
	useDeviceLanguage,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseConfig } from '$lib/env';

export interface FirebaseClient {
	app: FirebaseApp;
	auth: Auth;
	repo: Firestore;
}

export let firebaseClient: FirebaseClient;

export const initFirebaseClient = (
	firebaseConfig: FirebaseConfig,
): FirebaseClient => {
	const app = initializeApp(firebaseConfig);

	const auth = getAuth(app);
	setPersistence(auth, browserSessionPersistence);
	useDeviceLanguage(auth);

	const repo = getFirestore();

	firebaseClient = { app, auth, repo };
	return firebaseClient;
};
