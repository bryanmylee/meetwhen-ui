import type { Readable } from 'svelte/store';
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
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';
import type { SafeUser } from '$lib/core/types/SafeUser';
import type { FirebaseConfig } from '$lib/env';

export const { get: getFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: getFirebaseAuth, set: setFirebaseAuth } =
	pairedContext<Auth>();

export const { get: getRepo, set: setRepo } = pairedContext<Firestore>();

export const { get: getUser, set: setUser } =
	pairedContext<Readable<Maybe<SafeUser>>>();

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
