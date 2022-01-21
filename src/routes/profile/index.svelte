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
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '$lib/core/types/Session';
	import type { SafeUser } from '$lib/core/types/SafeUser';
	import { getRepo } from '$lib/firebase';
	import { useLiveDocument } from '$lib/firebase/useLiveDocument';
	import { populateIds } from '$lib/firebase/populateIds';
	import type { UserMeetingData } from '$lib/models/UserMeeting';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { MeetingData } from '$lib/models/Meeting';

	export let currentUser: SafeUser;

	const repo = getRepo();

	const meetingIdDoc = useLiveDocument<UserMeetingData>(
		repo,
		'user-meeting',
		currentUser.uid,
	);
	$: meetingIds = $meetingIdDoc?.data()?.meetingIds ?? [];
	$: meetingsPromise = populateIds<MeetingData>(
		repo,
		meetingIds,
		'meeting',
	).then((documents) =>
		documents.map((doc) => doc.data()).map(MeetingConverter.parse),
	);
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {currentUser.email}</h1>
	{#await meetingsPromise}
		<div>loading...</div>
	{:then meetings}
		{#each meetings as meeting}
			<div>
				<h2>{meeting.name}</h2>
				<p>{meeting.color}</p>
				<a href="/{meeting.slug}">{meeting.slug}</a>
			</div>
		{/each}
	{/await}
</div>
