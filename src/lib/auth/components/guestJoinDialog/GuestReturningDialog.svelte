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
	import { Button, LoadingPasscodeInput } from '$lib/input';
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
			<p class="text-brand w-fit -mb-2">meetwhen.io/{meetingSlug}</p>
		</DialogDescription>
		<DialogTitle as="h1" class="text-title-2">Sign in as guest</DialogTitle>
		<div class="flex justify-center scale-125 mx-7">
			<LoadingPasscodeInput
				bind:value={$passcode.value}
				error={$passcode.error}
				use={[focusOnMount]}
			/>
		</div>
		<p class="text-sm text-center italic">
			Enter the passcode you saved before
		</p>
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
	}

	:global(.guest-dialog-dismiss-button) {
		@apply absolute top-5 right-5;
		@apply wh-7;
	}
</style>
