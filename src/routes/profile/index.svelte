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
	import { signOut } from 'firebase/auth';
	import { Button } from '$lib/input';
	import { goto } from '$app/navigation';
	import {
		findAllUpcomingMeetingsOwnedByUser,
		getEndFromMeetings,
	} from '$lib/firebase/queries/findAllUpcomingMeetingsOwnedByUser';
	import { usePaginated } from '$lib/firebase/queries/paginated';
	import type { Meeting } from '$lib/models/Meeting';
	import type { Id } from '$lib/core/types/Id';

	const repo = useRepo();
	const auth = useAuth();

	export let currentUser: SafeUser;
	$: name = currentUser.displayName ?? currentUser.email;

	const upcomingPage = usePaginated<Id<Meeting>>(async (pageSize, previous) => {
		return await findAllUpcomingMeetingsOwnedByUser(repo, currentUser.uid, {
			limit: pageSize,
			afterEnd:
				previous === undefined ? undefined : getEndFromMeetings(previous),
		});
	});

	const handleSignOut = async () => {
		await signOut(auth);
		goto('/', {
			replaceState: true,
		});
	};
</script>

<section>
	<div class="container p-8 mx-auto flex flex-col gap-4">
		<div class="welcome">
			<h1 class="text-title-1">Welcome back, {name}</h1>
		</div>
		{#if $upcomingPage.isLoading}
			{#each { length: 3 } as _}
				<div>
					<h2 class="skeleton-text">Loading meeting...</h2>
					<p class="skeleton-text">012345678910</p>
				</div>
			{/each}
		{:else}
			{#each $upcomingPage.data as meeting}
				<div>
					<h2>{meeting.name}</h2>
					<a href="/{meeting.slug}">{meeting.slug}</a>
				</div>
			{/each}
		{/if}
		<div class="flex items-center gap-4">
			<Button on:click={() => upcomingPage.previousPage()}>Previous</Button>
			<Button on:click={() => upcomingPage.nextPage()}>Next</Button>
			<div>
				is last: {!$upcomingPage.isLoading && $upcomingPage.isLast}
			</div>
		</div>
		<Button color="gray" on:click={handleSignOut}>Sign Out</Button>
	</div>
</section>

<style lang="postcss">
	.welcome {
		@apply card p-4;
	}
</style>
