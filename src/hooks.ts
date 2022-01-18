import type { GetSession } from '@sveltejs/kit';
import { parseCookies } from '$lib/core/utils/cookies';
import { initFirebaseAdmin } from '$lib/firebase/server';
import type { Session } from '$lib/core/types/Session';

const firebaseAdmin = initFirebaseAdmin();

export const getSession: GetSession<
	Record<string, unknown>,
	unknown,
	Session
> = async (request) => {
	const cookies = parseCookies(request);
	try {
		const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
		return {
			user: {
				...token,
				ssr: true,
			},
		};
	} catch {
		return {};
	}
};
