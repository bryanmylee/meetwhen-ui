import type { RequestHandler } from '@sveltejs/kit';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { DocumentReference } from 'firebase-admin/firestore';
import { getGuestEmail, generateSignInCode } from '$lib/auth';
import { IntervalConverter } from '$lib/core/types';
import type { IntervalData } from '$lib/core/types';
import type { GuestUserData, ScheduleData } from '$lib/models';
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
	const rollbacks: (() => Promise<void>)[] = [];
	try {
		const userRecord = await firebaseAdmin.auth().createUser({
			displayName: username,
			email,
			password: passcode,
		});
		rollbacks.push(async () => {
			console.log('rolling back guest user account');
			await firebaseAdmin.auth().deleteUser(userRecord.uid);
		});
		await firebaseAdmin
			.firestore()
			.collection('guest-users')
			.doc(userRecord.uid)
			.set({
				meetingId,
				passcode,
			});
		rollbacks.push(async () => {
			console.log('rolling back guest user data');
			await firebaseAdmin
				.firestore()
				.collection('guest-users')
				.doc(userRecord.uid)
				.delete();
		});
		const newScheduleData: ScheduleData = {
			intervals,
			meetingId,
			userId: userRecord.uid,
			total: IntervalConverter.serialize(
				getTotalInterval(intervals.map(IntervalConverter.parse)),
			),
		};
		const scheduleDataRef = (await firebaseAdmin
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
		for (let i = rollbacks.length - 1; i >= 0; i--) {
			await rollbacks[i]();
		}
		return {
			status: 400,
			body: JSON.stringify(error),
		};
	}
};

interface DeleteGuestData {
	userId: string;
	idToken: string;
}

export const del: RequestHandler = async ({ request }) => {
	const { userId, idToken } = (await request.json()) as DeleteGuestData;
	// validation
	if (typeof userId !== 'string') {
		return { status: 400 };
	}
	if (typeof idToken !== 'string') {
		return { status: 401 };
	}
	const { serviceKey } = getServerEnv();
	const firebaseAdmin = await initFirebaseAdmin(serviceKey);
	// authentication
	let decodedIdToken: DecodedIdToken;
	try {
		decodedIdToken = await firebaseAdmin.auth().verifyIdToken(idToken);
		if (decodedIdToken.uid !== userId) {
			throw new Error('Incorrect identity on ID token');
		}
	} catch (error) {
		return {
			status: 403,
		};
	}
	const userSnapshot = await firebaseAdmin
		.firestore()
		.collection('guest-users')
		.doc(userId)
		.get();
	const userData = userSnapshot.data() as GuestUserData;
	const scheduleQuery = await firebaseAdmin
		.firestore()
		.collection('schedules')
		.where('userId', '==', userId)
		.where('meetingId', '==', userData.meetingId)
		.get();
	if (scheduleQuery.docs.length !== 1) {
		return {
			status: 500,
			body: `Cannot retrieve schedule userId=${userId} meetingId=${userData.meetingId}`,
		};
	}
	const scheduleSnapshot = scheduleQuery.docs[0];
	const scheduleData = scheduleSnapshot.data() as ScheduleData;
	// deletion
	const rollbacks: (() => Promise<void>)[] = [];
	try {
		await firebaseAdmin
			.firestore()
			.collection('schedules')
			.doc(scheduleSnapshot.id)
			.delete();
		rollbacks.push(async () => {
			console.log('rolling back schedule delete');
			await firebaseAdmin
				.firestore()
				.collection('schedules')
				.doc(scheduleSnapshot.id)
				.set(scheduleData);
		});
		await firebaseAdmin
			.firestore()
			.collection('guest-users')
			.doc(userId)
			.delete();
		rollbacks.push(async () => {
			console.log('rolling back guest user data delete');
			await firebaseAdmin
				.firestore()
				.collection('guest-users')
				.doc(userId)
				.set(userData);
		});
		await firebaseAdmin.auth().deleteUser(userId);
		return {
			status: 200,
		};
	} catch (error) {
		console.error(error);
		for (let i = rollbacks.length - 1; i >= 0; i--) {
			await rollbacks[i]();
		}
		return {
			status: 500,
		};
	}
};
