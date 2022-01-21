/* eslint-disable @typescript-eslint/no-empty-function */
import type { SafeUser } from '$lib/core/types/SafeUser';

export const mockHydratedUser: SafeUser = {
	ssr: false,
	uid: 'adam_uid',
	displayName: 'Adam Smith',
	email: 'adam.smith@gmail.com',
	photoURL: null,
	phoneNumber: '98765432',
	isAnonymous: false,
	emailVerified: false,
	providerId: '',
	providerData: [],
	metadata: {},
	refreshToken: '',
	tenantId: null,
	reload: () => new Promise(() => {}),
	delete: () => new Promise(() => {}),
	getIdToken: () => new Promise(() => ''),
	getIdTokenResult: () => new Promise(() => {}),
	toJSON() {
		return this;
	},
};

export const mockSSRUser: SafeUser = {
	ssr: true,
	uid: 'adam_uid',
	email: 'adam.smith@gmail.com',
	phone_number: '98765432',
	picture: undefined,
	email_verified: false,
	firebase: {
		sign_in_provider: '',
		identities: {},
	},
	aud: '',
	auth_time: 0,
	exp: 0,
	iat: 0,
	iss: '',
	sub: '',
};
