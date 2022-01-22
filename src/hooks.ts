import type { GetSession } from '@sveltejs/kit';
import * as firebaseAdmin from 'firebase-admin';
import { initFirebaseAdmin } from '$lib/firebase/server';
import { parseCookies } from '$lib/core/utils/cookies';
import type { Session } from '$lib/core/types/Session';
import type { Maybe } from '$lib/core/types/Maybe';
import type { SafeUser } from '$lib/models/SafeUser';
import type { ThemeType } from '$lib/core/types/ThemeType';
import { getServerEnv } from '$lib/env';

export const getSession: GetSession<Record<string, unknown>, Session> = async ({
	request,
}) => {
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
