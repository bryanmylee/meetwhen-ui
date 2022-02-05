<script lang="ts" context="module">
	export const load: Load = async ({ params }) => {
		const { slug } = params;
		const meeting = await findMeetingWithSlug(firebaseClient.repo, slug);
		const linkPreviews: LinkPreviewData[] =
			meeting?.links !== undefined && meeting.links.length !== 0
				? await fetchLinkPreviews(meeting.links)
				: meeting?.links?.map((link) => ({ url: link })) ?? [];
		console.log('preload', linkPreviews);
		return {
			props: {
				meeting,
				linkPreviews,
			},
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { Meeting, MeetingData } from '$lib/models/Meeting';
	import type { Id } from '$lib/core/types/Id';
	import { firebaseClient } from '$lib/firebase/client';
	import { useRepo } from '$lib/firebase/context';
	import { useLiveDocument } from '$lib/firebase/utils/useLiveDocument';
	import { findMeetingWithSlug } from '$lib/firebase/queries/meetings';
	import { MeetingHeader } from '$lib/meeting/components';
	import { fetchLinkPreviews } from '$lib/meeting/utils/fetchLinkPreviews';
	import type { LinkPreviewData } from '$lib/meeting/types/LinkPreviewData';

	const repo = useRepo();

	export let meeting: Id<Meeting>;
	const liveMeetingDocument = useLiveDocument<MeetingData>(
		repo,
		'meetings',
		meeting.id,
	);
	$: {
		const data = $liveMeetingDocument?.data();
		if (data !== undefined)
			meeting = {
				id: meeting.id,
				...MeetingConverter.parse(data),
			};
	}

	export let linkPreviews: LinkPreviewData[];
	$: if (meeting.links !== undefined && meeting.links.length !== 0) {
		fetchLinkPreviews(meeting.links).then(
			(previews) => (linkPreviews = previews),
		);
	}
	$: console.log(meeting);
</script>

<section>
	<div class="max-w-xl p-4 mx-auto flex flex-col gap-4">
		<MeetingHeader {...meeting} {linkPreviews} />
	</div>
</section>
