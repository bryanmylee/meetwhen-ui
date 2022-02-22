<script lang="ts">
	import type { User } from 'firebase/auth';
	import { getGuestUserWithId, useRepo, getMeetingWithId } from '$lib/firebase';
	import MeetingPreview from './MeetingPreview.svelte';

	const repo = useRepo();

	export let guestUser: User;
	$: meetingPromise = getGuestUserWithId(repo, guestUser.uid).then((data) => {
		if (data === undefined) {
			return undefined;
		}
		return getMeetingWithId(repo, data.meetingId);
	});
</script>

<div class="flex gap-2 items-center">
	<span class="text-label">Guest of</span>
	{#await meetingPromise}
		<MeetingPreview name="loading" slug="loading" isLoading />
	{:then meeting}
		{#if meeting !== undefined}
			<MeetingPreview
				name={meeting.name}
				slug={meeting.slug}
				color={meeting.color}
			/>
		{/if}
	{/await}
</div>
