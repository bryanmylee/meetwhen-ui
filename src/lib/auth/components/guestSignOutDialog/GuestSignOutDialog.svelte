<script lang="ts">
	import { DialogTitle, DialogDescription } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import MeetingPreview from '$lib/profile/components/MeetingPreview.svelte';
	import type { Meeting } from '$lib/models';
	import { Button } from '$lib/input';

	export let open = true;

	export let previousMeeting: Pick<Meeting, 'name' | 'color' | 'slug'>;
</script>

<Dialog bind:open>
	<div class="guest-sign-out-card">
		<DialogTitle as="h1" class="text-title-2">
			Signed in as a guest of
		</DialogTitle>
		<MeetingPreview
			name={previousMeeting.name}
			color={previousMeeting.color}
			slug={previousMeeting.slug}
		/>
		<DialogDescription class="text-sm italic">
			Guest accounts are unique to each meet
		</DialogDescription>
		<div class="flex gap-4">
			<Button size="md" color="gray" class="w-full">Cancel</Button>
			<Button size="md" color="gradient" class="w-full">Sign out</Button>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.guest-sign-out-card {
		@apply card p-6 relative z-10;
		@apply flex flex-col gap-4;
	}
</style>
