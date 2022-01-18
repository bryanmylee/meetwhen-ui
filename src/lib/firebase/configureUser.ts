import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onIdTokenChanged, onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { destroyCookie, setCookie } from '$lib/core/utils/cookies';
import type { Maybe } from '$lib/core/types/Maybe';
import type { Session } from '$lib/core/types/Session';

const TEN_MINUTE_MS = 10 * 60 * 1000;

export type SafeUser =
	| (User & { ssr: false })
	| (DecodedIdToken & { ssr: true });

export const configureUser = (
	auth: Auth,
	{ idToken }: Session,
): Readable<Maybe<SafeUser>> => {
	const initUser = idToken && {
		...idToken,
		ssr: true as const,
	};
	return readable<Maybe<SafeUser>>(initUser, (set) => {
		const handleUser = async ($user: User | null) => {
			if ($user === null) {
				set(undefined);
				destroyCookie(undefined, 'token', { path: '/' });
				return;
			}
			const token = await $user.getIdToken();
			($user as SafeUser)['ssr'] = false as const;
			set($user as SafeUser);
			setCookie(undefined, 'token', token, { path: '/' });
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
