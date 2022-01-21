import type { Readable } from 'svelte/store';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';
import type { SafeUser } from '$lib/core/types/SafeUser';

export const { get: getFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: getFirebaseAuth, set: setFirebaseAuth } =
	pairedContext<Auth>();

export const { get: getRepo, set: setRepo } = pairedContext<Firestore>();

export const { get: getUser, set: setUser } =
	pairedContext<Readable<Maybe<SafeUser>>>();
