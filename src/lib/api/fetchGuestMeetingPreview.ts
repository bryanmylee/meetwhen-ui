import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';
import type { MeetingPreviewData } from '$lib/models';

export const fetchGuestMeetingPreview = async (
	guestId: string,
): Promise<Maybe<Id<MeetingPreviewData>>> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(
			`${host}/api/guest-meeting-preview?guestId=${guestId}`,
		);
		const meetingPreview = (await response.json()) as Id<MeetingPreviewData>;
		return meetingPreview;
	} catch (error) {
		console.error(`Cannot fetch meeting preview for guestId=${guestId}`, error);
		return undefined;
	}
};
