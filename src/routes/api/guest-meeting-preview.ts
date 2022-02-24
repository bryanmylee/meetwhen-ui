import type { RequestHandler } from '@sveltejs/kit';
import { initFirebaseAdmin } from '$lib/firebase';
import { getServerEnv } from '$lib/env';
import type { GuestUserData, MeetingData } from '$lib/models';

export const get: RequestHandler = async ({ url }) => {
	try {
		const guestId = url.searchParams.get('guestId');
		if (guestId === null || guestId === '') {
			throw new Error('query parameter `guestId` is required');
		}
		const { serviceKey } = getServerEnv();
		const firebaseAdmin = await initFirebaseAdmin(serviceKey);
		const guestSnapshot = await firebaseAdmin
			.firestore()
			.collection('guest-users')
			.doc(guestId)
			.get();
		if (!guestSnapshot.exists) {
			return {
				status: 404,
				body: `guestId=${guestId} not found`,
			};
		}
		const { meetingId } = guestSnapshot.data() as GuestUserData;
		const meetingSnapshot = await firebaseAdmin
			.firestore()
			.collection('meetings')
			.doc(meetingId)
			.get();
		const { name, slug, color } = meetingSnapshot.data() as MeetingData;
		return {
			body: JSON.stringify({ id: meetingId, name, slug, color }),
		};
	} catch (error) {
		console.error(error);
		return {
			status: 400,
		};
	}
};
