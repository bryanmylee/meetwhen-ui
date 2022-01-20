import {
	collection,
	CollectionReference,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import type { Firestore, QueryDocumentSnapshot } from 'firebase/firestore';

/**
 * Populates a list of IDs for document snapshots.
 */
export const populateIds = async <Data>(
	repo: Firestore,
	ids: string[],
	path: string,
	...pathSegments: string[]
): Promise<QueryDocumentSnapshot<Data>[]> => {
	if (ids.length === 0) {
		return [];
	}
	const collectionRef = collection(
		repo,
		path,
		...pathSegments,
	) as CollectionReference<Data>;
	const collectionQuery = query(collectionRef, where('__name__', 'in', ids));
	const collectionSnapshot = await getDocs(collectionQuery);
	return collectionSnapshot.docs;
};
