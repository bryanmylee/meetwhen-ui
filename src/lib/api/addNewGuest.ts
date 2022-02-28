import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';
import type { Interval } from '$lib/core/types';
import { IntervalConverter } from '$lib/core/types';

export interface AddNewGuestProps {
	username: string;
	meetingId: string;
	intervals: Interval[];
}

export interface AddNewGuestResult {
	passcode: string;
	scheduleId: string;
}

export const addNewGuest = async ({
	username,
	meetingId,
	intervals,
}: AddNewGuestProps): Promise<AddNewGuestResult> => {
	const { host } = browser ? getClientEnv() : getServerEnv();
	const response = await fetch(`${host}/api/guest`, {
		method: 'post',
		body: JSON.stringify({
			username,
			meetingId,
			intervals: intervals.map(IntervalConverter.serialize),
		}),
	});
	if (response.status !== 201) {
		throw await response.json();
	}
	const result = (await response.json()) as AddNewGuestResult;
	return result;
};
