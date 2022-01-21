import { writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type {
	DocumentData,
	Firestore,
	QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { Maybe } from '$lib/core/types/Maybe';
import { useLiveDocument } from './useLiveDocument';
import { populateIds } from './populateIds';

export interface UseLiveDocumentsProps {
	idsDocPath: [string, ...string[]];
	idsKey: string;
	collectionPath: [string, ...string[]];
}

export const useLiveDocuments = <Data>(
	repo: Firestore,
	{ idsDocPath, idsKey, collectionPath }: UseLiveDocumentsProps,
): Readable<Maybe<QueryDocumentSnapshot<Data>[]>> => {
	const idsDoc = useLiveDocument(repo, ...idsDocPath);
	const store = writable<Maybe<QueryDocumentSnapshot<Data>[]>>(
		undefined,
		(set) => {
			return idsDoc.subscribe(async ($idsDoc) => {
				const idsDocData = $idsDoc?.data() as DocumentData;
				if (idsDocData === undefined) {
					return undefined;
				}
				const ids = idsDocData[idsKey];
				const documents = await populateIds<Data>(repo, ids, ...collectionPath);
				set(documents);
			});
		},
	);
	return store;
};
