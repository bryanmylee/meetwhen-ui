<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = async ({
		params,
		session,
	}) => {
		const { slug } = params;
		const meeting = await findMeetingWithSlug(firebaseClient.repo, slug);
		return {
			props: {
				meeting,
				currentUser: session.user,
			},
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/core/types/Session';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { Meeting, MeetingData } from '$lib/models/Meeting';
	import type { Id } from '$lib/core/types/Id';
	import type { SafeUser } from '$lib/models/SafeUser';
	import { firebaseClient } from '$lib/firebase/client';
	import { useRepo } from '$lib/firebase/context';
	import { useLiveDocument } from '$lib/firebase/utils/useLiveDocument';
	import { findMeetingWithSlug } from '$lib/firebase/queries/findMeetingWithSlug';

	const repo = useRepo();

	export let meeting: Id<Meeting>;
	const liveMeetingDocument = useLiveDocument<MeetingData>(
		repo,
		'meeting',
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

	export let currentUser: SafeUser;
</script>

<div class="p-4 flex-col gap-4">
	<h1>{meeting.name}</h1>
	<p>{meeting.color}</p>
</div>
