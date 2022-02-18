<script lang="ts">
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';

	export let open = true;
	export let passcode: string;
	let message = 'Click to copy';
	$: if (open) {
		message = 'Click to copy';
	} else {
		handleDismiss();
	}

	const handleClick = async () => {
		try {
			await navigator.clipboard.writeText(passcode);
			message = 'Copied to clipboard!';
		} catch {
			message = 'Click to copy not supported';
		}
	};

	const handleDismiss = async () => {
		await handleClick();
	};
</script>

<Dialog bind:open>
	<button class="passcode-dialog-card group" on:click={handleClick}>
		<DialogTitle as="h1" class="passcode-dialog-title">
			Save your passcode
		</DialogTitle>
		<div class="passcode-dialog-content">
			<DialogDescription class="text-center text-sm">
				Use this code to sign in later
			</DialogDescription>
			<p class="passcode">
				{passcode}
			</p>
			<span class="text-sm italic text-center">{message}</span>
		</div>
	</button>
</Dialog>

<style lang="postcss">
	.passcode-dialog-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col items-center gap-4 focus;
		&:hover {
			@apply shadow-md-wide;
		}
	}

	.passcode-dialog-card :global(.passcode-dialog-title) {
		@apply text-title-2 text-center w-full;
		@apply transition;
	}

	:global(.passcode-dialog-card.group:hover .passcode-dialog-title) {
		@apply opacity-60;
	}
	:global(.passcode-dialog-card.group:active .passcode-dialog-title) {
		@apply opacity-30;
	}

	.passcode-dialog-content {
		@apply flex flex-col gap-4;
		@apply transition group-hover:opacity-50 group-active:opacity-30;
	}

	.passcode {
		@apply font-semibold text-3xl tracking-wider text-brand;
	}
</style>
