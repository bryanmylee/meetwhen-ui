import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onIdTokenChanged, onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { browser } from '$app/env';
import { session } from '$lib/stores';
import { destroyCookie, setCookie } from '$lib/core/utils/cookies';
import type { Maybe } from '$lib/core/types/Maybe';
import type { Session } from '$lib/core/types/Session';
import type { SafeUser } from '$lib/models/SafeUser';

const TEN_MINUTE_MS = 10 * 60 * 1000;

export const configureUser = (
	auth: Auth,
	initSession: Session,
): Readable<Maybe<SafeUser>> => {
	return readable<Maybe<SafeUser>>(initSession.user, (set) => {
		const handleUser = async ($user: User | null) => {
			if ($user === null) {
				set(undefined);
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
