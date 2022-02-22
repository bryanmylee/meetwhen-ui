import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';
import type { UserRecord } from '$lib/models/UserRecord';

export const fetchMeetingUserRecords = async (
	meetingId: string,
): Promise<Id<UserRecord>[]> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(
			`${host}/api/meeting-user-records?meetingId=${meetingId}`,
		);
		const userData = (await response.json()) as Id<UserRecord>[];
		return userData;
	} catch (error) {
		console.error(`Cannot fetch user data for meetingId=${meetingId}`, error);
		return [];
	}
};
