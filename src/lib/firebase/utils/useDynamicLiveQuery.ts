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
export const useDynamicLiveQuery = <Data extends DocumentData>(
	query: Readable<Query>,
): Readable<Maybe<QueryDocumentSnapshot<Data>[]>> => {
	const store = writable<Maybe<QueryDocumentSnapshot<Data>[]>>(undefined);
	let unsubscribePreviousSnapshot: Maybe<() => void>;
	onMount(() => {
		const unsubscribeQuery = query.subscribe(($query) => {
			if (unsubscribePreviousSnapshot !== undefined) {
				unsubscribePreviousSnapshot();
			}
			return onSnapshot($query, (querySnapshot) => {
				store.set(querySnapshot.docs as QueryDocumentSnapshot<Data>[]);
			});
		});
		return () => {
			if (unsubscribePreviousSnapshot !== undefined) {
				unsubscribePreviousSnapshot();
			}
			unsubscribeQuery();
		};
	});
	return store;
};
