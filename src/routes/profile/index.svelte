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
	import { useLiveDocument } from '$lib/firebase/useLiveDocument';
	import { getRepo } from '$lib/firebase';
	import type { UserMeetingData } from '$lib/models/UserMeeting';
	import { getMeetingsFromIds } from './_queries';

	export let currentUser: SafeUser;

	const repo = getRepo();

	const meetingIdDoc = useLiveDocument<UserMeetingData>(
		'user-meeting',
		currentUser.uid,
	);
	$: meetingIds = $meetingIdDoc?.data()?.meetingIds ?? [];
	$: meetings = (repo && getMeetingsFromIds(repo, meetingIds)) ?? [];
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {currentUser.email}</h1>
	{#await meetings then meetingsData}
		{#each meetingsData as meeting}
			{JSON.stringify(meeting)}
		{/each}
	{/await}
</div>
