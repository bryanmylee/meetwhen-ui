import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onSnapshot } from 'firebase/firestore';
import type { DocumentData, DocumentReference } from 'firebase/firestore';
import type { DocumentSnapshot } from 'firebase/firestore';

/**
 * Listens to a document on Firestore. This must be called during component initialization.
 */
export const useDynamicLiveDocument = <Data extends DocumentData>(
	ref: Readable<DocumentReference>,
): Readable<Maybe<DocumentSnapshot<Data>>> => {
	const store = writable<Maybe<DocumentSnapshot<Data>>>(undefined);
	let unsubscribePreviousSnapshot: Maybe<() => void>;
	onMount(() => {
		const unsubscribeRef = ref.subscribe(($ref) => {
			if (unsubscribePreviousSnapshot !== undefined) {
				unsubscribePreviousSnapshot();
			}
			unsubscribePreviousSnapshot = onSnapshot($ref, (document) => {
				store.set(document as DocumentSnapshot<Data>);
			});
		});
		return () => {
			if (unsubscribePreviousSnapshot !== undefined) {
				unsubscribePreviousSnapshot();
			}
			unsubscribeRef();
		};
	});
	return store;
};
