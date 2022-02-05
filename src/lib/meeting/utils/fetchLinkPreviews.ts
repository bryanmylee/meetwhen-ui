import type { LinkPreviewData } from '../types/LinkPreviewData';

export const fetchLinkPreviews = async (
	links: string[],
): Promise<LinkPreviewData[]> => {
	try {
		const response = await fetch('api/link-previews', {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(links),
		});
		const linkPreviews = (await response.json()) as LinkPreviewData[];
		return linkPreviews;
	} catch {
		return links.map((link) => ({ url: link }));
	}
};
