<script lang="ts">
	import { onMount } from 'svelte';
	import type { User } from 'firebase/auth';
	import { fetchGuestMeetingPreview } from '$lib/api';
	import GuestSignOutDialogPure from './GuestSignOutDialogPure.svelte';
	import type { MeetingPreviewData } from '$lib/api/fetchGuestMeetingPreview';

	export let open = false;
	export let guestUser: User;
	let meetingPreview: Maybe<MeetingPreviewData> = undefined;
	onMount(() => {
		fetchGuestMeetingPreview(guestUser.uid).then(
			(data) => (meetingPreview = data),
		);
	});
</script>

<div class="flex gap-2 items-center">
	<GuestSignOutDialogPure
		{open}
		isLoading={meetingPreview === undefined}
		guestMeeting={meetingPreview ?? {
			name: 'loading',
			slug: 'loading',
		}}
		on:sign-out
	/>
</div>
