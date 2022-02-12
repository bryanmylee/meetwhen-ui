import { doc, deleteDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface DeleteAnonymousUser {
	userId: string;
}

export const deleteAnonymousUser = async (
	repo: Firestore,
	{ userId }: DeleteAnonymousUser,
): Promise<void> => {
	await deleteDoc(doc(repo, 'anonymous-users', userId));
};
