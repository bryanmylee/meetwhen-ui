import { customAlphabet } from 'nanoid';
import { getServerEnv } from '$lib/env';
import { initFirebaseAdmin } from '$lib/firebase';
import type { RequestHandler } from '@sveltejs/kit';

const MAX_SLUG_ATTEMPTS = 10;
// ~919 years before 1% collision at 1000 events per hour.
const generateSlug = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	12,
);

const getUniqueSlug = async (
	admin: Awaited<ReturnType<typeof initFirebaseAdmin>>,
): Promise<string> => {
	for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
		const slug = generateSlug();
		const slugsSnapshot = await admin
			.firestore()
			.collection('meetings')
			.select('slug')
			.where('slug', '==', slug)
			.get();
		const existingCount = slugsSnapshot.docs.length;
		if (existingCount === 0) {
			return slug;
		}
	}
	throw new Error('No more slugs available');
};

export const get: RequestHandler = async () => {
	try {
		const { serviceKey } = getServerEnv();
		const firebaseAdmin = await initFirebaseAdmin(serviceKey);
		const slug = await getUniqueSlug(firebaseAdmin);
		return {
			body: JSON.stringify(slug),
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				status: 500,
				body: error.message,
			};
		}
		return { status: 500 };
	}
};
