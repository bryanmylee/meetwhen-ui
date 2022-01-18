import type { Readable } from 'svelte/store';
import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';

export const { get: getFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: getFirebaseAuth, set: setFirebaseAuth } =
	pairedContext<Auth>();

export const { get: getFirebaseUser, set: setFirebaseUser } =
	pairedContext<Readable<Maybe<User>>>();
