import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getTotalInterval } from '$lib/core/utils';
import type { Interval } from '$lib/core/types';
import { ScheduleConverter } from '$lib/models/Schedule';
import type { Schedule } from '$lib/models/Schedule';

export interface AddSchedule {
	meetingId: string;
	intervals: Interval[];
}

export const addSchedule = async (
	repo: Firestore,
	addSchedule: AddSchedule,
	currentUser: User,
): Promise<Id<Schedule>> => {
	const userId = currentUser.uid;
	const total = getTotalInterval(addSchedule.intervals);
	const newScheduleData = ScheduleConverter.serialize({
		...addSchedule,
		total,
		userId,
	});
	const doc = await addDoc(collection(repo, 'schedules'), newScheduleData);
	return {
		...addSchedule,
		id: doc.id,
		total,
		userId,
	};
};
