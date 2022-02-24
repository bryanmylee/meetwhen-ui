import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';

export const fetchNewSlug = async (): Promise<string> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(`${host}/api/slug`);
		const slug = (await response.json()) as string;
		return slug;
	} catch (error) {
		console.error(`Cannot get slug`, error);
		return '';
	}
};
