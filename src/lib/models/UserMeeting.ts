import type { DocumentData } from 'firebase/firestore';

export interface UserMeetingData extends DocumentData {
	meetingIds: string[];
}
