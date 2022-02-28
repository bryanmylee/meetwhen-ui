import type { DocumentData } from 'firebase/firestore';

export interface GuestUserData extends DocumentData {
	meetingId: string;
	passcode: string;
}
