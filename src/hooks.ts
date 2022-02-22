import type { GetSession } from '@sveltejs/kit';
import * as firebaseAdmin from 'firebase-admin';
import { initFirebaseAdmin } from '$lib/firebase/server';
import { parseCookies } from '$lib/core/utils/cookies';
import type { SafeUser } from '$lib/models/SafeUser';
import type { ThemeType } from '$lib/core/types';
import { getServerEnv } from '$lib/env';

export const getSession: GetSession = async ({ request }) => {
	const { serviceKey } = getServerEnv();
	initFirebaseAdmin(serviceKey);
	const cookies = parseCookies(request);
	const user = await getSSRUser(cookies.token);
	const theme = cookies.theme as Maybe<ThemeType>;
	return {
		user,
		theme,
	};
};

const getSSRUser = async (token: Maybe<string>): Promise<Maybe<SafeUser>> => {
	try {
		const idToken = await firebaseAdmin.auth().verifyIdToken(token ?? '');
		return {
			...idToken,
			ssr: true,
		};
	} catch {
		return undefined;
	}
};
