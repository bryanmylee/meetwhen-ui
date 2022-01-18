import { readable } from 'svelte/store';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { Maybe } from '$lib/core/types/Maybe';
import { setFirebaseApp, setFirebaseAuth, setFirebaseUser } from './context';

export const firebaseConfig = {
	apiKey: 'AIzaSyBCU9eFkutJr4lcatVLgwGvMtzaMO1usBo',
	authDomain: 'meetwhen-store.firebaseapp.com',
	projectId: 'meetwhen-store',
	storageBucket: 'meetwhen-store.appspot.com',
	messagingSenderId: '675479103941',
	appId: '1:675479103941:web:88a6db0ba21209f5de43ac',
	measurementId: 'G-8JXB4HG49T',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = readable<Maybe<User>>(undefined, (set) => {
	return onAuthStateChanged(auth, ($user) => {
		set($user ?? undefined);
	});
});

export const initFirebase = (): void => {
	setFirebaseApp(app);
	setFirebaseAuth(auth);
	setFirebaseUser(user);
};
