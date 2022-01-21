<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = async ({
		params,
		session,
	}) => {
		const { slug } = params;
		const meetingData = await findMeetingDataWithSlug(
			firebaseClient.repo,
			slug,
		);
		return {
			props: {
				meetingData,
				currentUser: session.user,
			},
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/core/types/Session';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { MeetingData } from '$lib/models/Meeting';
	import type { Id } from '$lib/core/types/Id';
	import type { SafeUser } from '$lib/core/types/SafeUser';
	import { firebaseClient, getRepo } from '$lib/firebase';
	import { useLiveDocument } from '$lib/firebase/useLiveDocument';
	import { findMeetingDataWithSlug } from '$lib/firebase/queries/findMeetingDataWithSlug';

	const repo = getRepo();

	export let meetingData: Id<MeetingData>;
	const liveMeetingDocument = useLiveDocument<MeetingData>(
		repo,
		'meeting',
		meetingData.id,
	);
	$: liveMeetingData = $liveMeetingDocument?.data();
	$: if (liveMeetingData !== undefined) {
		meetingData = {
			id: meetingData.id,
			...liveMeetingData,
		};
	}
	$: meeting = MeetingConverter.parse(meetingData);

	export let currentUser: SafeUser;
</script>

<div class="p-4 flex-col gap-4">
	<h1>{meeting.name}</h1>
	<p>{meeting.color}</p>
</div>
