import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import {
	collection,
	CollectionReference,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { getRepo } from '.';

/**
 * Populates a list of IDs for documents. This must be called during component initialization.
 *
 * `setRepo` must be called in the component hierarchy.
 */
export const usePopulatedDocuments = <Data>(
	ids: Readable<string[]>,
	path: string,
	...pathSegments: string[]
): Readable<QueryDocumentSnapshot<Data>[]> => {
	const repo = getRepo();
	const store = writable<QueryDocumentSnapshot<Data>[]>([]);
	onMount(() => {
		const collectionRef = collection(
			repo,
			path,
			...pathSegments,
		) as CollectionReference<Data>;
		ids.subscribe(async ($ids) => {
			const collectionQuery = query(
				collectionRef,
				where('__name__', 'in', $ids),
			);
			const collectionSnapshot = await getDocs(collectionQuery);
			store.set(collectionSnapshot.docs);
		});
	});
	return store;
};
