import * as firebaseAdmin from 'firebase-admin';
import serviceKey from '../../../../firebase.service.key.json';

export const initFirebaseAdmin = (): typeof firebaseAdmin => {
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
