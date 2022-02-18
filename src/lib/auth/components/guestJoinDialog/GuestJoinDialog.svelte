<script lang="ts" context="module">
	export interface GuestJoinDialogEvent {
		'show-returning': never;
		'guest-join': {
			username: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { XIcon } from 'svelte-feather-icons';
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import { Button } from '$lib/input';
	import { withError } from '$lib/core/utils/withError';
	import { focusOnMount } from '$lib/core/utils/useFocusOnMount';
	import Textfield from '$lib/input/textfield/Textfield.svelte';

	const dispatch = createEventDispatcher<GuestJoinDialogEvent>();

	export let open = true;
	$: if (!open) {
		$username.value = '';
	}
	export let meetingSlug: string;

	const username = withError('');

	const handleConfirmJoin = () => {
		dispatch('guest-join', {
			username: $username.value,
		});
	};
</script>

<Dialog bind:open>
	<div class="guest-dialog-card">
		<DialogDescription>
			<p class="text-brand">meetwhen.io/{meetingSlug}</p>
		</DialogDescription>
		<DialogTitle as="h1" class="flex justify-between items-baseline">
			<span class="text-title-1"> Join as a guest </span>
			<span>
				or
				<button
					on:click={() => dispatch('show-returning')}
					class="guest-dialog-returning"
				>
					returning guest?
				</button>
			</span>
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
				<Button type="submit" size="md" class="w-full">Join</Button>
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
		@media (min-width: 768px) {
			max-width: 48rem;
		}
	}

	:global(.guest-dialog-dismiss-button) {
		@apply absolute top-4 right-4;
		@apply wh-7;
	}

	.guest-dialog-returning {
		@apply text-neutral-400 underline underline-offset-2;
		@apply focus p-1 rounded hover:text-primary-400;
	}
</style>
