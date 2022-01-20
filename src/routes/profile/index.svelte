<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = ({ session }) => {
		if (session.user === undefined) {
			return {
				status: 302,
				redirect: '/profile/login',
			};
		}
		return {
			props: {
				currentUser: session.user,
			},
		};
	};
</script>

<script lang="ts">
	import { derived } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/core/types/Session';
	import type { SafeUser } from '$lib/core/types/SafeUser';
	import { useLiveDocument } from '$lib/firebase/useLiveDocument';
	import { usePopulatedDocuments } from '$lib/firebase/usePopulatedDocuments';
	import type { UserMeetingData } from '$lib/models/UserMeeting';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { MeetingData } from '$lib/models/Meeting';

	export let currentUser: SafeUser;

	const meetingIdDoc = useLiveDocument<UserMeetingData>(
		'user-meeting',
		currentUser.uid,
	);
	const meetingIds = derived(
		meetingIdDoc,
		($meetingIdDoc) => $meetingIdDoc?.data()?.meetingIds ?? [],
	);
	const meetingDocs = usePopulatedDocuments<MeetingData>(meetingIds, 'meeting');
	const meetings = derived(meetingDocs, ($meetingDocs) =>
		$meetingDocs.map((doc) => doc.data()).map(MeetingConverter.parse),
	);
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {currentUser.email}</h1>
	{#each $meetings as meeting}
		<div>
			<h2>{meeting.name}</h2>
			<p>{meeting.color}</p>
		</div>
	{/each}
</div>
