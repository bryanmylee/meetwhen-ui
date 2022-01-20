import * as admin from 'firebase-admin';
import serviceKey from '../../../../firebase.service.key.json';

export const initFirebaseAdmin = (): typeof admin => {
	if (admin.apps.length > 0) {
		return admin;
	}
	admin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			privateKey: serviceKey.private_key,
			clientEmail: serviceKey.client_email,
			projectId: serviceKey.project_id,
		}),
		databaseURL: 'https://meetwhen-store.firebaseio.com',
	});
	return firebaseAdmin;
};

export const firebaseAdmin = initFirebaseAdmin();
