import { addDoc, collection } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getTotalInterval } from '$lib/core/utils';
import type { Interval } from '$lib/core/types';
import { ScheduleConverter } from '$lib/models';
import type { Schedule } from '$lib/models';

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
	const doc = await addDoc(collection(repo, 'schedule'), newScheduleData);
	return {
		...addSchedule,
		id: doc.id,
		total,
		userId,
	};
};
