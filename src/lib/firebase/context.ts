import type { Writable } from 'svelte/store';
import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import type { Auth, User } from 'firebase/auth';
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';

export const { get: getFirebaseAnalytics, set: setFirebaseAnalytics } =
	pairedContext<Writable<Maybe<Analytics>>>();

export const { get: getFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: getFirebaseAuth, set: setFirebaseAuth } =
	pairedContext<Auth>();

export const { get: getFirebaseUser, set: setFirebaseUser } =
	pairedContext<Writable<Maybe<User>>>();
