<script lang="ts" context="module">
	export interface GuestSignOutDialogEvent {
		'sign-out': never;
		cancel: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { DialogTitle, DialogDescription } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import MeetingPreview from '$lib/profile/components/MeetingPreview.svelte';
	import type { Meeting } from '$lib/models';
	import { Button, LoadingButton } from '$lib/input';

	const dispatch = createEventDispatcher<GuestSignOutDialogEvent>();

	export let open = true;

	export let isLoading = false;
	export let guestMeeting: Pick<Meeting, 'name' | 'color' | 'slug'>;
</script>

<Dialog {open} static>
	<div class="guest-sign-out-card">
		<DialogTitle as="h1" class="text-title-2">
			Signed in as a guest of
		</DialogTitle>
		<MeetingPreview
			{isLoading}
			name={guestMeeting.name}
			color={guestMeeting.color}
			slug={guestMeeting.slug}
		/>
		<DialogDescription class="text-sm italic">
			Guest accounts are unique to each meet
		</DialogDescription>
		<div class="flex gap-4">
			<Button
				size="md"
				color="gray"
				class="w-full"
				on:click={() => dispatch('cancel')}
			>
				Cancel
			</Button>
			<LoadingButton
				size="md"
				color="gradient"
				class="w-full"
				on:click={() => dispatch('sign-out')}
			>
				Sign out
			</LoadingButton>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.guest-sign-out-card {
		@apply card p-6 relative z-10;
		@apply flex flex-col gap-4;
	}
</style>
