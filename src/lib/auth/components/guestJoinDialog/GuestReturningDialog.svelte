<script lang="ts" context="module">
	export interface GuestReturningEvent {
		'guest-sign-in': {
			passcode: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { XIcon } from 'svelte-feather-icons';
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import { Button, PasscodeInput } from '$lib/input';
	import { withError } from '$lib/core/utils/withError';
	import { focusOnMount } from '$lib/core/utils/useFocusOnMount';

	const dispatch = createEventDispatcher<GuestReturningEvent>();

	export let open = true;
	$: if (!open) {
		$passcode.value = '';
	}
	export let meetingSlug: string;

	export let error = '';
	$: $passcode.error = error;
	const passcode = withError('');
	$: if ($passcode.value.length === 6) {
		handleConfirmSignIn();
	}

	const handleConfirmSignIn = () => {
		dispatch('guest-sign-in', {
			passcode: $passcode.value.toUpperCase(),
		});
	};
</script>

<Dialog bind:open>
	<div class="guest-dialog-card">
		<DialogDescription>
			<p class="text-brand">meetwhen.io/{meetingSlug}</p>
		</DialogDescription>
		<DialogTitle as="h1" class="flex justify-between items-baseline">
			<span class="text-title-1"> Sign in as guest </span>
		</DialogTitle>
		<div class="flex justify-center scale-150 mt-3">
			<PasscodeInput
				bind:value={$passcode.value}
				error={$passcode.error}
				use={[focusOnMount]}
			/>
		</div>
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
		max-width: 24rem;
	}

	:global(.guest-dialog-dismiss-button) {
		@apply absolute top-4 right-4;
		@apply wh-7;
	}
</style>
