import { browser } from '$app/env';
import type { ServiceKey } from '$lib/env';

export const initFirebaseAdmin = async (
	serviceKey: ServiceKey,
): Promise<typeof import('firebase-admin')> => {
	if (browser) {
		throw Error('Cannot initialize Firebase Admin on the client');
	}
	const firebaseAdmin = (await import('firebase-admin')).default;
	if (firebaseAdmin.apps.length > 0) {
		return firebaseAdmin;
	}
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			privateKey: serviceKey.private_key,
			clientEmail: serviceKey.client_email,
			projectId: serviceKey.project_id,
		}),
		databaseURL: 'https://meetwhen-store.firebaseio.com',
	});
	return firebaseAdmin;
};
