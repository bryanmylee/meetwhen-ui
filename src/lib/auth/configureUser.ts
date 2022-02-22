import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onIdTokenChanged, onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { browser } from '$app/env';
import { session } from '$app/stores';
import { destroyCookie, setCookie } from '$lib/core/utils/cookies';
import type { SafeUser } from '$lib/models';

const TEN_MINUTE_MS = 10 * 60 * 1000;

/**
 * Get information on the current user.
 * @param auth Firebase Auth
 * @param initSession The initial session information for SSR
 * @returns A readable store with undefined if the user state is still loading,
 * null if the user is signed out, or a User object if the user is signed in.
 */
export const configureUser = (
	auth: Auth,
	initSession: App.Session,
): Readable<Maybe<Nullable<SafeUser>>> => {
	return readable<Maybe<Nullable<SafeUser>>>(initSession.user, (set) => {
		const handleUser = async ($user: User | null) => {
			if ($user === null) {
				set($user);
				destroyCookie(undefined, 'token', { path: '/' });
				if (browser) {
					session.update(($session) => ({
						...$session,
						user: undefined,
					}));
				}
				return;
			}
			// Force 'ssr' property on object for type differentiation.
			const safeUser = $user as SafeUser;
			safeUser['ssr'] = false as const;
			set(safeUser);
			const token = await safeUser.getIdToken();
			setCookie(undefined, 'token', token, { path: '/' });
			if (browser) {
				session.update(($session) => ({
					...$session,
					user: safeUser,
				}));
			}
		};

		const unsubIdToken = onIdTokenChanged(auth, handleUser);
		const unsubAuthState = onAuthStateChanged(auth, handleUser);

		const refreshInterval = setInterval(async () => {
			const user = auth.currentUser;
			if (user) {
				await user.getIdToken(true);
			}
		}, TEN_MINUTE_MS);

		return () => {
			unsubIdToken();
			unsubAuthState();
			clearInterval(refreshInterval);
		};
	});
};
