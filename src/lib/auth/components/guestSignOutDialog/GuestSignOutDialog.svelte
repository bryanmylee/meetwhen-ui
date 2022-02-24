<script lang="ts" context="module">
	export interface GuestSignOutDialogEvent {
		'sign-out': never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { DialogTitle, DialogDescription } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import MeetingPreview from '$lib/profile/components/MeetingPreview.svelte';
	import type { MeetingPreviewData } from '$lib/models';
	import { LoadingButton } from '$lib/input';

	const dispatch = createEventDispatcher<GuestSignOutDialogEvent>();

	export let open = true;

	export let guestMeeting: Maybe<MeetingPreviewData>;
</script>

<Dialog {open} static>
	<div class="guest-sign-out-card">
		<DialogDescription class="text-title-2">
			You're a guest of
		</DialogDescription>
		<MeetingPreview
			isLoading={guestMeeting === undefined}
			name={guestMeeting?.name ?? 'loading'}
			slug={guestMeeting?.slug ?? 'loading'}
			color={guestMeeting?.color}
		/>
		<p class="text-sm italic">Guest accounts are unique to each meet</p>
		<DialogTitle
			as="h1"
			class="text-title-2 border-t border-neutral-200 dark:border-neutral-600 mt-2 pt-4"
		>
			To view this meet
		</DialogTitle>
		<div class="flex gap-4">
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
