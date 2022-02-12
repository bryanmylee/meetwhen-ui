import type { DocumentData } from 'firebase/firestore';

export interface CustomUserData extends DocumentData {
	meetingId: string;
}
