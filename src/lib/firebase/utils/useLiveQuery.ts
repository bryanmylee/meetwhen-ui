import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onSnapshot } from 'firebase/firestore';
import type {
	DocumentData,
	Query,
	QueryDocumentSnapshot,
} from 'firebase/firestore';

/**
 * Listens to a query on Firestore. This must be called during component initialization.
 */
export const useLiveQuery = <Data extends DocumentData>(
	query: Query,
): Readable<Maybe<QueryDocumentSnapshot<Data>[]>> => {
	const store = writable<Maybe<QueryDocumentSnapshot<Data>[]>>(undefined);
	onMount(() => {
		return onSnapshot(query, (querySnapshot) => {
			store.set(querySnapshot.docs as QueryDocumentSnapshot<Data>[]);
		});
	});
	return store;
};
