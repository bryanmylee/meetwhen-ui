import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Maybe } from '$lib/core/types/Maybe';
import { MeetingConverter } from '$lib/models/Meeting';
import type { Meeting, MeetingData } from '$lib/models/Meeting';
import { findAllSchedulesWithMeetingId } from '../schedules/findAllSchedulesWithMeetingId';

export const getMeetingWithId = async (
	repo: Firestore,
	meetingId: string,
): Promise<Maybe<Meeting>> => {
	const meetingSnapshot = await getDoc(doc(repo, 'meetings', meetingId));
	if (!meetingSnapshot.exists()) {
		return undefined;
	}
	const schedules = await findAllSchedulesWithMeetingId(
		repo,
		meetingSnapshot.id,
	);
	const meeting = MeetingConverter.parse(meetingSnapshot.data() as MeetingData);
	return { ...meeting, schedules };
};
