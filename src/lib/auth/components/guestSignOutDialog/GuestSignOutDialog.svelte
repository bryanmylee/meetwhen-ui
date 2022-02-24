<script lang="ts">
	import type { User } from 'firebase/auth';
	import { fetchGuestMeetingPreview } from '$lib/api/fetchGuestMeetingPreview';
	import GuestSignOutDialogPure from './GuestSignOutDialogPure.svelte';

	export let open = false;
	export let guestUser: User;
	$: meetingPreviewPromise = fetchGuestMeetingPreview(guestUser.uid);
</script>

<div class="flex gap-2 items-center">
	{#await meetingPreviewPromise}
		<GuestSignOutDialogPure
			{open}
			isLoading
			guestMeeting={{
				name: 'loading',
				slug: 'loading',
			}}
			on:cancel
			on:sign-out
		/>
	{:then meetingPreview}
		{#if meetingPreview !== undefined}
			<GuestSignOutDialogPure
				{open}
				guestMeeting={meetingPreview}
				on:cancel
				on:sign-out
			/>
		{/if}
	{/await}
</div>
