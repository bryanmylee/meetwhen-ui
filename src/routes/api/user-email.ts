import type { RequestHandler } from '@sveltejs/kit';
import { initFirebaseAdmin } from '$lib/firebase';
import { getServerEnv } from '$lib/env';

export const get: RequestHandler = async ({ url }) => {
	try {
		const userId = url.searchParams.get('userId');
		if (userId === null || userId === '') {
			throw new Error('query parameter `userId` is required');
		}
		const { serviceKey } = getServerEnv();
		const firebaseAdmin = await initFirebaseAdmin(serviceKey);
		const userResult = await firebaseAdmin.auth().getUser(userId);
		return {
			body: JSON.stringify(userResult.email),
		};
	} catch (error) {
		console.error(error);
		return {
			status: 400,
		};
	}
};
