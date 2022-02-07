import * as firebaseAdmin from 'firebase-admin';
import type { RequestHandler } from '@sveltejs/kit';
import type { Id } from '$lib/core/types/Id';
import type { ScheduleData } from '$lib/models/Schedule';
import type { UserData } from '$lib/models/UserData';

/**
 * This limits the amount of user information exposed when viewing a meeting.
 */
export const get: RequestHandler = async ({ url }) => {
	try {
		const meetingId = url.searchParams.get('meetingId');
		if (meetingId === null || meetingId === '') {
			throw new Error('query parameter `meetingId` is required');
		}
		const schedulesSnapshot = await firebaseAdmin
			.firestore()
			.collection('schedules')
			.select('userId')
			.where('meetingId', '==', meetingId)
			.get();
		const scheduleData = schedulesSnapshot.docs.map((d) => d.data()) as Pick<
			ScheduleData,
			'userId'
		>[];
		const userIds = scheduleData.map((d) => d.userId);
		const identifiers = userIds.map((uid) => ({ uid }));
		const usersResult = await firebaseAdmin.auth().getUsers(identifiers);
		const userData: Id<UserData>[] = usersResult.users.map((u) => ({
			id: u.uid,
			displayName: u.displayName,
			email: u.email,
			photoURL: u.photoURL,
		}));
		return {
			body: JSON.stringify(userData),
		};
	} catch (error) {
		console.error(error);
		return {
			status: 400,
		};
	}
};
