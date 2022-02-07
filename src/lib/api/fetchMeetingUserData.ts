import { browser } from '$app/env';
import type { Id } from '$lib/core/types/Id';
import { getClientEnv, getServerEnv } from '$lib/env';
import type { UserData } from '$lib/models/UserData';

export const fetchMeetingUserData = async (
	meetingId: string,
): Promise<Id<UserData>[]> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(
			`${host}/api/meeting-user-data?meetingId=${meetingId}`,
		);
		const userData = (await response.json()) as Id<UserData>[];
		return userData;
	} catch (error) {
		console.error(`Cannot fetch user data for meetingId=${meetingId}`, error);
		return [];
	}
};
