import type { Readable } from 'svelte/store';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { pairedContext } from '$lib/core/utils';
import type { SafeUser } from '$lib/models';

export const [useFirebaseApp, setFirebaseApp] = pairedContext<FirebaseApp>();

export const [useAuth, setFirebaseAuth] = pairedContext<Auth>();

export const [useRepo, setRepo] = pairedContext<Firestore>();

export const [useUser, setUser] =
	pairedContext<Readable<Maybe<Nullable<SafeUser>>>>();
