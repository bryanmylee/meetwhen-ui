<script lang="ts">
	import type { User } from 'firebase/auth';
	import { fetchGuestMeetingPreview } from '$lib/api';
	import MeetingPreview from './MeetingPreview.svelte';

	export let guestUser: User;
	$: meetingPreviewPromise = fetchGuestMeetingPreview(guestUser.uid);
</script>

<div class="flex gap-2 items-center">
	<span class="text-label">Guest of</span>
	{#await meetingPreviewPromise}
		<MeetingPreview name="loading" slug="loading" isLoading />
	{:then meetingPreview}
		{#if meetingPreview !== undefined}
			<MeetingPreview {...meetingPreview} />
		{/if}
	{/await}
</div>
