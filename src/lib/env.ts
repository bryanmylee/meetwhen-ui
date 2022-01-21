import { browser } from '$app/env';

export interface ServerEnv {
	serviceKey: ServiceKey;
}

export interface ServiceKey {
	type: string;
	project_id: string;
	private_key_id: string;
	private_key: string;
	client_email: string;
	client_id: string;
	auth_uri: string;
	token_uri: string;
	auth_provider_x509_cert_url: string;
	client_x509_cert_url: string;
}

export const getServerEnv = (): ServerEnv => {
	if (browser) {
		throw Error('Cannot load server constants on the client');
	}

	const serviceKey = JSON.parse(
		(import.meta.env.VITE_FIREBASE_SERVICE_KEY ?? '').toString(),
	) as ServiceKey;

	return {
		serviceKey,
	};
};

export interface ClientEnv {
	firebaseConfig: FirebaseConfig;
}

export interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
	measurementId: string;
}

export const getClientEnv = (): ClientEnv => {
	const firebaseConfig = JSON.parse(
		(import.meta.env.VITE_FIREBASE_CLIENT_CONFIG ?? '').toString(),
	) as FirebaseConfig;

	return {
		firebaseConfig,
	};
};
