import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';
import type { Meeting } from '$lib/models';

export type MeetingPreviewData = Pick<Meeting, 'name' | 'slug' | 'color'>;

export const fetchGuestMeetingPreview = async (
	guestId: string,
): Promise<Maybe<MeetingPreviewData>> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(
			`${host}/api/guest-meeting-preview?guestId=${guestId}`,
		);
		const meetingPreview = (await response.json()) as MeetingPreviewData;
		return meetingPreview;
	} catch (error) {
		console.error(`Cannot fetch meeting preview for guestId=${guestId}`, error);
		return undefined;
	}
};
