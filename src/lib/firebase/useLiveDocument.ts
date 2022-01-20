import { doc, onSnapshot } from 'firebase/firestore';
import type { DocumentSnapshot } from 'firebase/firestore';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { getRepo } from '.';
import type { Maybe } from '$lib/core/types/Maybe';

/**
 * Listens to a document on Firestore. This must be called during component initialization.
 *
 * `setRepo` must be called in the component hierarchy.
 */
export const useLiveDocument = <Data>(
	path: string,
	...pathSegments: string[]
): Readable<Maybe<DocumentSnapshot<Data>>> => {
	const repo = getRepo();
	const store = writable<Maybe<DocumentSnapshot<Data>>>(undefined);
	onMount(() => {
		return onSnapshot(doc(repo, path, ...pathSegments), (document) => {
			store.set(document as DocumentSnapshot<Data>);
		});
	});
	return store;
};
