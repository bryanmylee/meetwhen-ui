import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onSnapshot } from 'firebase/firestore';
import type { DocumentData, DocumentReference } from 'firebase/firestore';
import type { DocumentSnapshot } from 'firebase/firestore';

/**
 * Listens to a document on Firestore. This must be called during component initialization.
 */
export const useLiveDocument = <Data extends DocumentData>(
	ref: DocumentReference,
): Readable<Maybe<DocumentSnapshot<Data>>> => {
	const store = writable<Maybe<DocumentSnapshot<Data>>>(undefined);
	onMount(() => {
		return onSnapshot(ref, (document) => {
			store.set(document as DocumentSnapshot<Data>);
		});
	});
	return store;
};
