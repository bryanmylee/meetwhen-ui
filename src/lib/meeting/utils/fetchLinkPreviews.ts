import { browser } from '$app/env';
import { getClientEnv, getServerEnv } from '$lib/env';
import type { LinkPreviewData } from '../types/LinkPreviewData';

export const fetchLinkPreviews = async (
	links: string[],
): Promise<LinkPreviewData[]> => {
	try {
		const { host } = browser ? getClientEnv() : getServerEnv();
		const response = await fetch(`${host}/api/link-previews`, {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(links),
		});
		const linkPreviews = (await response.json()) as LinkPreviewData[];
		return linkPreviews;
	} catch (error) {
		console.error('Cannot fetch previews for', links, error);
		return links.map((link) => ({ url: link }));
	}
};
