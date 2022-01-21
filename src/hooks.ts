import * as firebaseAdmin from 'firebase-admin';
import type { GetSession } from '@sveltejs/kit';
import { parseCookies } from '$lib/core/utils/cookies';
import type { Session } from '$lib/core/types/Session';
import { initFirebaseAdmin } from '$lib/firebase/server';
import { getServerEnv } from '$lib/env';

export const getSession: GetSession<
	Record<string, unknown>,
	unknown,
	Session
> = async (request) => {
	const { serviceKey } = getServerEnv();
	initFirebaseAdmin(serviceKey);
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
