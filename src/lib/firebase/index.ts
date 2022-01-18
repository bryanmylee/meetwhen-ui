import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
	browserSessionPersistence,
	getAuth,
	onAuthStateChanged,
	setPersistence,
} from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';
import { firebaseConfig } from './firebaseConfig';

export const { get: getFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: getFirebaseAuth, set: setFirebaseAuth } =
	pairedContext<Auth>();

export const { get: getFirebaseUser, set: setFirebaseUser } =
	pairedContext<Readable<Maybe<User>>>();

export const initFirebaseContext = (): void => {
	// Prevent re-initializing the Firebase SDK during hot reloading.
	if (getFirebaseApp()) {
		return;
	}

	const app = initializeApp(firebaseConfig);

	const auth = getAuth(app);
	setPersistence(auth, browserSessionPersistence);

	const user = readable<Maybe<User>>(undefined, (set) => {
		return onAuthStateChanged(auth, ($user) => {
			set($user ?? undefined);
		});
	});

	setFirebaseApp(app);
	setFirebaseAuth(auth);
	setFirebaseUser(user);
};
