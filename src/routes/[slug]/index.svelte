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
	import type { SafeUser } from '$lib/models/SafeUser';
	import { firebaseClient } from '$lib/firebase/client';
	import { useRepo } from '$lib/firebase/context';
	import { useLiveDocument } from '$lib/firebase/utils/useLiveDocument';
	import { findMeetingDataWithSlug } from '$lib/firebase/queries/findMeetingDataWithSlug';

	const repo = useRepo();

	export let meetingData: Id<MeetingData>;
	const liveMeetingDocument = useLiveDocument<MeetingData>(
		repo,
		'meeting',
		meetingData.id,
	);
	$: {
		const data = $liveMeetingDocument?.data();
		if (data !== undefined)
			meetingData = {
				id: meetingData.id,
				...data,
			};
	}
	$: meeting = MeetingConverter.parse(meetingData);

	export let currentUser: SafeUser;
</script>

<div class="p-4 flex-col gap-4">
	<h1>{meeting.name}</h1>
	<p>{meeting.color}</p>
</div>
