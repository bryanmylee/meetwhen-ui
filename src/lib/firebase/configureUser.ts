import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onIdTokenChanged, onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { browser } from '$app/env';
import { session } from '$app/stores';
import { destroyCookie, setCookie } from '$lib/core/utils/cookies';
import type { Maybe } from '$lib/core/types/Maybe';
import type { Session } from '$lib/core/types/Session';
import type { SafeUser } from '$lib/core/types/SafeUser';

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
					session.update(
						($session: Session) =>
							({
								...$session,
								user: undefined,
							} as Session),
					);
				}
				return;
			}
			const token = await $user.getIdToken();
			// Force 'ssr' property on object for type differentiation.
			($user as SafeUser)['ssr'] = false as const;
			set($user as SafeUser);
			setCookie(undefined, 'token', token, { path: '/' });
			if (browser) {
				session.update(
					($session: Session) =>
						({
							...$session,
							user: $user,
						} as Session),
				);
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
