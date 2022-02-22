import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Firestore, Query } from 'firebase/firestore';
import { ScheduleConverter } from '$lib/models';
import type { Schedule, ScheduleData } from '$lib/models';

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
): Promise<Id<Schedule>[]> => {
	const schedulesSnapshot = await getDocs(
		findAllSchedulesWithMeetingIdQuery(repo, meetingId),
	);
	return schedulesSnapshot.docs
		.map((doc) => [doc.id, doc.data()] as const)
		.map(([id, data]) => ({ ...ScheduleConverter.parse(data), id }));
};
