import { doc, deleteDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export const deleteSchedule = async (
	repo: Firestore,
	scheduleId: string,
): Promise<void> => {
	await deleteDoc(doc(repo, 'schedule', scheduleId));
};
