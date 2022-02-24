import type { GetSession } from '@sveltejs/kit';
import { initFirebaseAdmin } from '$lib/firebase';
import { parseCookies } from '$lib/core/utils/cookies';
import type { SafeUser } from '$lib/models';
import type { ThemeType } from '$lib/core/types';
import { getServerEnv } from '$lib/env';

export const getSession: GetSession = async ({ request }) => {
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
		const { serviceKey } = getServerEnv();
		const firebaseAdmin = await initFirebaseAdmin(serviceKey);
		const idToken = await firebaseAdmin.auth().verifyIdToken(token ?? '');
		return {
			...idToken,
			ssr: true,
		};
	} catch (error) {
		console.error(error);
		return undefined;
	}
};
