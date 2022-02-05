import type { RequestHandler } from '@sveltejs/kit';
import { getLinkPreview } from 'link-preview-js';

export const post: RequestHandler = async ({ request }) => {
	try {
		let urls = (await request.json()) as string[];
		if (!Array.isArray(urls) && typeof urls === 'string') {
			urls = [urls];
		}
		const previews = await Promise.all(urls.map((url) => getLinkPreview(url)));
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
