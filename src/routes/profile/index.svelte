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
	import { useRepo } from '$lib/firebase/context';
	import { useLiveDocuments } from '$lib/firebase/utils/useLiveDocuments';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { MeetingData } from '$lib/models/Meeting';

	export let currentUser: SafeUser;

	const repo = useRepo();
	const meetings = useLiveDocuments<MeetingData>(repo, {
		idsDocPath: ['user-meeting', currentUser.uid],
		idsKey: 'meetingIds',
		collectionPath: ['meeting'],
	});
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {currentUser.email}</h1>
	{#if $meetings === undefined}
		<div>loading...</div>
	{:else}
		{#each $meetings as meetingDoc}
			{@const meeting = MeetingConverter.parse(meetingDoc.data())}
			<div>
				<h2>{meeting.name}</h2>
				<p>{meeting.color}</p>
				<a href="/{meeting.slug}">{meeting.slug}</a>
			</div>
		{/each}
	{/if}
</div>
