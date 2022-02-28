import type { RequestHandler } from '@sveltejs/kit';
import type { UserRecord } from 'firebase-admin/auth';
import type { DocumentReference, WriteResult } from 'firebase-admin/firestore';
import { getGuestEmail, generateSignInCode } from '$lib/auth';
import { IntervalConverter } from '$lib/core/types';
import type { IntervalData } from '$lib/core/types';
import type { ScheduleData } from '$lib/models';
import { getServerEnv } from '$lib/env';
import { initFirebaseAdmin } from '$lib/firebase';
import { getTotalInterval } from '$lib/core/utils';

interface AddNewGuestData {
	username: string;
	meetingId: string;
	intervals: IntervalData[];
}

export const post: RequestHandler = async ({ request }) => {
	const { username, meetingId, intervals } =
		(await request.json()) as AddNewGuestData;
	// validation
	if (
		typeof username !== 'string' ||
		typeof meetingId !== 'string' ||
		typeof intervals !== 'object' ||
		!Array.isArray(intervals) ||
		!intervals.every(
			({ beg, end }) =>
				typeof beg === 'number' && typeof end === 'number' && beg < end,
		)
	) {
		return { status: 400 };
	}
	const { serviceKey } = getServerEnv();
	const firebaseAdmin = await initFirebaseAdmin(serviceKey);
	const email = getGuestEmail(username, meetingId);
	const passcode = generateSignInCode();
	let userRecord: Maybe<UserRecord>;
	let userDataRef: Maybe<WriteResult>;
	let scheduleDataRef: Maybe<DocumentReference<ScheduleData>>;
	try {
		userRecord = await firebaseAdmin.auth().createUser({
			displayName: username,
			email,
			password: passcode,
		});
		userDataRef = await firebaseAdmin
			.firestore()
			.collection('guest-users')
			.doc(userRecord.uid)
			.set({
				meetingId,
				passcode,
			});
		const newScheduleData: ScheduleData = {
			intervals,
			meetingId,
			userId: userRecord.uid,
			total: IntervalConverter.serialize(
				getTotalInterval(intervals.map(IntervalConverter.parse)),
			),
		};
		scheduleDataRef = (await firebaseAdmin
			.firestore()
			.collection('schedules')
			.add(newScheduleData)) as DocumentReference<ScheduleData>;
		return {
			status: 201,
			body: JSON.stringify({
				passcode,
				scheduleId: scheduleDataRef.id,
			}),
		};
	} catch (error) {
		console.error(error);
		// rollback
		if (userRecord !== undefined) {
			if (userDataRef !== undefined) {
				if (scheduleDataRef !== undefined) {
					console.log('rolling back guest schedule data');
					await firebaseAdmin
						.firestore()
						.collection('schedules')
						.doc(scheduleDataRef.id)
						.delete();
				}
				console.log('rolling back guest user data');
				await firebaseAdmin
					.firestore()
					.collection('guest-users')
					.doc(userRecord.uid)
					.delete();
			}
			console.log('rolling back guest user account');
			await firebaseAdmin.auth().deleteUser(userRecord.uid);
		}
		return {
			status: 400,
			body: JSON.stringify(error),
		};
	}
};
