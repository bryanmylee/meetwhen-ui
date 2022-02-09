import type { Readable } from 'svelte/store';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';
import type { Nullable } from '$lib/core/types/Nullable';
import type { SafeUser } from '$lib/models/SafeUser';

export const { get: useFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: useAuth, set: setFirebaseAuth } = pairedContext<Auth>();

export const { get: useRepo, set: setRepo } = pairedContext<Firestore>();

export const { get: useUser, set: setUser } =
	pairedContext<Readable<Maybe<Nullable<SafeUser>>>>();
