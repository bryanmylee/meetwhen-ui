import { doc, deleteDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface DeleteGuestUser {
	userId: string;
}

export const deleteGuestUser = async (
	repo: Firestore,
	{ userId }: DeleteGuestUser,
): Promise<void> => {
	await deleteDoc(doc(repo, 'guest-users', userId));
};
