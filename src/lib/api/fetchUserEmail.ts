import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';

export const fetchUserEmail = async (userId: string): Promise<string> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(`${host}/api/user-email?userId=${userId}`);
		const userEmail = (await response.json()) as string;
		return userEmail;
	} catch (error) {
		console.error(`Cannot fetch data for userId=${userId}`, error);
		return '';
	}
};
