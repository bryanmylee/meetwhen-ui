import { doc, deleteDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export interface DeleteGuestUserData {
	userId: string;
}

export const deleteGuestUserData = async (
	repo: Firestore,
	{ userId }: DeleteGuestUserData,
): Promise<void> => {
	await deleteDoc(doc(repo, 'guest-users', userId));
};
