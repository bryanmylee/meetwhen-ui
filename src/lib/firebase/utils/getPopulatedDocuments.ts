import {
	doc,
	Firestore,
	getDoc,
	QueryDocumentSnapshot,
} from 'firebase/firestore';
import { populateIds } from './populateIds';

export interface GetPopulatedDocsProps {
	idsDocPath: [string, ...string[]];
	idsKey: string;
	collectionPath: [string, ...string[]];
}

export const getPopulatedDocuments = async <Data>(
	repo: Firestore,
	{ idsDocPath, idsKey, collectionPath }: GetPopulatedDocsProps,
): Promise<Maybe<QueryDocumentSnapshot<Data>[]>> => {
	const idsDoc = await getDoc(doc(repo, ...idsDocPath));
	const idsDocData = idsDoc.data();
	if (idsDocData === undefined) {
		return undefined;
	}
	const ids = idsDocData[idsKey];
	const documents = await populateIds<Data>(repo, ids, ...collectionPath);
	return documents;
};
