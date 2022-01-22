<script lang="ts" context="module">
	export const load: Load<{ session: Session }> = async ({ session }) => {
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
	import type { SafeUser } from '$lib/models/SafeUser';
	import { useAuth, useRepo } from '$lib/firebase/context';
	import { useLiveDocuments } from '$lib/firebase/utils/useLiveDocuments';
	import { signOut } from 'firebase/auth';
	import { MeetingConverter } from '$lib/models/Meeting';
	import type { MeetingData } from '$lib/models/Meeting';
	import { Button } from '$lib/input';
	import { goto } from '$app/navigation';

	const repo = useRepo();
	const auth = useAuth();

	export let currentUser: SafeUser;

	const meetingDocs = useLiveDocuments<MeetingData>(repo, {
		idsDocPath: ['user-meeting', currentUser.uid],
		idsKey: 'meetingIds',
		collectionPath: ['meeting'],
	});

	const handleSignOut = async () => {
		await signOut(auth);
		goto('/', {
			replaceState: true,
		});
	};
</script>

<div class="flex flex-col gap-4 p-4">
	<h1>Welcome back, {currentUser.email}</h1>
	{#if $meetingDocs === undefined}
		<div>loading...</div>
	{:else}
		{#each $meetingDocs as meetingDoc}
			{@const meeting = MeetingConverter.parse(meetingDoc.data())}
			<div>
				<h2>{meeting.name}</h2>
				<p>{meeting.color}</p>
				<a href="/{meeting.slug}">{meeting.slug}</a>
			</div>
		{/each}
	{/if}
	<Button color="gray" on:click={handleSignOut}>Sign Out</Button>
</div>
