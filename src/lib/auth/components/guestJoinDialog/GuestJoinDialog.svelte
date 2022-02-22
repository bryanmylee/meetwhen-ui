<script lang="ts" context="module">
	export interface GuestJoinDialogEvent {
		'guest-join': never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { XIcon } from 'svelte-feather-icons';
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import { Button, LoadingButton } from '$lib/input';
	import type { WithErrorable } from '$lib/core/utils/withError';
	import { focusOnMount } from '$lib/core/utils/useFocusOnMount';
	import Textfield from '$lib/input/textfield/Textfield.svelte';

	const dispatch = createEventDispatcher<GuestJoinDialogEvent>();

	export let open = true;
	$: if (!open) {
		$username.value = '';
	}
	export let meetingSlug: string;

	export let username: WithErrorable<string>;

	const handleConfirmJoin = () => {
		dispatch('guest-join');
	};
</script>

<Dialog bind:open>
	<div class="guest-dialog-card">
		<DialogDescription>
			<p class="text-brand w-fit -mb-2">meetwhen.io/{meetingSlug}</p>
		</DialogDescription>
		<DialogTitle as="h1" class="flex justify-between items-baseline">
			<span class="text-title-1"> Join as a guest </span>
		</DialogTitle>
		<form
			on:submit|preventDefault={handleConfirmJoin}
			class="flex flex-col gap-4"
		>
			<Textfield
				bind:value={$username.value}
				error={$username.error}
				label="Name"
				required
				spellcheck={false}
				use={[focusOnMount]}
			/>
			<div class="flex gap-4">
				<Button
					color="gray"
					size="md"
					class="w-full"
					on:click={() => (open = false)}
				>
					Cancel
				</Button>
				<LoadingButton type="submit" size="md" class="w-full">
					Join
				</LoadingButton>
			</div>
		</form>
		<Button
			on:click={() => (open = false)}
			variant="text-only"
			icon
			class="guest-dialog-dismiss-button"
		>
			<XIcon />
		</Button>
	</div>
</Dialog>

<style lang="postcss">
	.guest-dialog-card {
		@apply card p-6 relative z-10;
		@apply flex flex-col gap-4;
		width: calc(100vw - 2rem);
		max-width: 30rem;
	}

	:global(.guest-dialog-dismiss-button) {
		@apply absolute top-5 right-5;
		@apply wh-7;
	}
</style>
