import type { DocumentData } from 'firebase/firestore';

export interface UserData extends DocumentData {
	meetingId: string;
}
