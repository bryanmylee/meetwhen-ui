import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { doc, onSnapshot } from 'firebase/firestore';
import type { DocumentSnapshot, Firestore } from 'firebase/firestore';
import type { Maybe } from '$lib/core/types/Maybe';

/**
 * Listens to a document on Firestore. This must be called during component initialization.
 */
export const useLiveDocument = <Data>(
	repo: Firestore,
	path: string,
	...pathSegments: string[]
): Readable<Maybe<DocumentSnapshot<Data>>> => {
	const store = writable<Maybe<DocumentSnapshot<Data>>>(undefined);
	onMount(() => {
		return onSnapshot(doc(repo, path, ...pathSegments), (document) => {
			store.set(document as DocumentSnapshot<Data>);
		});
	});
	return store;
};
