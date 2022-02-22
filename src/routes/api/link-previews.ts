import type { LinkPreviewData } from '$lib/core/types';
import type { RequestHandler } from '@sveltejs/kit';
import { getLinkPreview } from 'link-preview-js';

export const post: RequestHandler = async ({ request }) => {
	try {
		let urls = (await request.json()) as string[];
		if (!Array.isArray(urls) && typeof urls === 'string') {
			urls = [urls];
		}
		const previews: LinkPreviewData[] = await Promise.all(
			urls.map(async (url) => {
				try {
					const preview = (await getLinkPreview(url)) as LinkPreviewData;
					return {
						url,
						favicons: preview.favicons,
						title: preview.title,
						description: preview.description,
					};
				} catch (error) {
					return {
						url,
					};
				}
			}),
		);
		return {
			status: 200,
			body: JSON.stringify(previews),
		};
	} catch {
		return {
			status: 400,
		};
	}
};
