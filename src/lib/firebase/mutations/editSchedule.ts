import { doc, updateDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getTotalInterval } from '$lib/core/utils';
import type { Interval } from '$lib/core/types';
import { ScheduleConverter } from '$lib/models';
import type { Schedule } from '$lib/models';

export interface EditSchedule {
	id: string;
	meetingId: string;
	intervals: Interval[];
}

export const editSchedule = async (
	repo: Firestore,
	{ id, ...editSchedule }: EditSchedule,
	currentUser: User,
): Promise<Id<Schedule>> => {
	const userId = currentUser.uid;
	const total = getTotalInterval(editSchedule.intervals);
	const editScheduleData = ScheduleConverter.serialize({
		...editSchedule,
		total,
		userId,
	});
	await updateDoc(doc(repo, 'schedules', id), editScheduleData);
	return {
		...editSchedule,
		id,
		total,
		userId,
	};
};
