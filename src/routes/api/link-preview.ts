import type { RequestHandler } from '@sveltejs/kit';
import { getLinkPreview } from 'link-preview-js';

export const post: RequestHandler = async ({ request }) => {
	try {
		const url = await request.text();
		const preview = await getLinkPreview(url);
		return {
			status: 200,
			body: JSON.stringify(preview),
		};
	} catch {
		return {
			status: 400,
		};
	}
};
