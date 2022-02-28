import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';

export interface DeleteGuestProps {
	userId: string;
	idToken: string;
}

export const deleteGuest = async ({
	userId,
	idToken,
}: DeleteGuestProps): Promise<void> => {
	const { host } = browser ? getClientEnv() : getServerEnv();
	await fetch(`${host}/api/guest`, {
		method: 'delete',
		body: JSON.stringify({
			userId,
			idToken,
		}),
	});
};
