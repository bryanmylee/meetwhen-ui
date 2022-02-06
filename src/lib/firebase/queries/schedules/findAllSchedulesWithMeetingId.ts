import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Firestore, Query } from 'firebase/firestore';
import { ScheduleConverter } from '$lib/models/Schedule';
import type { Schedule, ScheduleData } from '$lib/models/Schedule';

export const findAllSchedulesWithMeetingIdQuery = (
	repo: Firestore,
	meetingId: string,
): Query<ScheduleData> =>
	query(
		collection(repo, 'schedules'),
		where('meetingId', '==', meetingId),
	) as Query<ScheduleData>;

export const findAllSchedulesWithMeetingId = async (
	repo: Firestore,
	meetingId: string,
): Promise<Schedule[]> => {
	const schedulesSnapshot = await getDocs(
		findAllSchedulesWithMeetingIdQuery(repo, meetingId),
	);
	return schedulesSnapshot.docs
		.map((doc) => doc.data())
		.map(ScheduleConverter.parse);
};
