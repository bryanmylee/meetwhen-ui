<script lang="ts" context="module">
	export const load: Load = async ({ session }) => {
		if (session.user === undefined) {
			return {
				status: 302,
				redirect: '/login?back=/profile',
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
	import type { SafeUser, Meeting } from '$lib/models';
	import { useAuth, useRepo } from '$lib/firebase/context';
	import { signOut } from 'firebase/auth';
	import { Button } from '$lib/input';
	import { goto } from '$app/navigation';
	import {
		findAllPreviousMeetingsOwnedByUser,
		findAllUpcomingMeetingsOwnedByUser,
		getEndFromMeetings,
	} from '$lib/firebase/queries/meetings';
	import { usePaginated } from '$lib/firebase/queries/paginated';
	import MeetingPreviews from '$lib/profile/components/MeetingPreviews.svelte';
	import Head from '$lib/core/components/Head.svelte';
	import GuestPreview from '$lib/profile/components/GuestPreview.svelte';

	const repo = useRepo();
	const auth = useAuth();

	export let currentUser: SafeUser;
	$: isGuest = currentUser.email?.endsWith('.guest');
	$: name = currentUser.displayName;

	const upcomingMeetingsPage = usePaginated<Id<Meeting>>(
		async (pageSize, previous) => {
			return await findAllUpcomingMeetingsOwnedByUser(repo, currentUser.uid, {
				limit: pageSize,
				afterEnd:
					previous === undefined ? undefined : getEndFromMeetings(previous),
			});
		},
		{ pageSize: 8 },
	);

	const previousMeetingsPage = usePaginated<Id<Meeting>>(
		async (pageSize, previous) => {
			return await findAllPreviousMeetingsOwnedByUser(repo, currentUser.uid, {
				limit: pageSize,
				afterEnd:
					previous === undefined ? undefined : getEndFromMeetings(previous),
			});
		},
		{ pageSize: 8 },
	);

	const handleSignOut = async () => {
		await signOut(auth);
		goto('/', {
			replaceState: true,
		});
	};
</script>

<Head noRobots subtitle="profile" />

<section>
	<div class="flex flex-col w-full max-w-xl gap-4 p-4 mx-auto">
		<h1 class="text-title-1">Welcome back, {name}</h1>
		{#if isGuest && !currentUser.ssr}
			<GuestPreview guestUser={currentUser} />
		{:else}
			<MeetingPreviews
				title="Upcoming"
				open
				meetingsPage={upcomingMeetingsPage}
			/>
			<MeetingPreviews title="Previous" meetingsPage={previousMeetingsPage} />
		{/if}
		<Button color="gray" on:click={handleSignOut}>Sign out</Button>
	</div>
</section>
