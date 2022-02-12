<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
	} from '@rgossiaux/svelte-headlessui';
	import { primaryVars } from '$lib/core/state';

	export let open = true;
	export let passcode: string;
	let message = 'Click to copy';
	$: if (!open) {
		message = 'Click to copy';
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
		open = false;
	};
</script>

<Dialog {open} on:close={handleDismiss}>
	<div class="passcode-dialog" style={$primaryVars}>
		<div transition:fade={{ duration: 300, easing: cubicOut }}>
			<DialogOverlay class="passcode-dialog-overlay" />
			<button
				class="passcode-dialog-card group"
				in:fly={{ duration: 500, y: 50, easing: cubicOut }}
				on:click={handleClick}
			>
				<DialogTitle as="h1" class="passcode-dialog-title">
					Save your passcode
				</DialogTitle>
				<div class="dialog-card-content">
					<DialogDescription class="text-center text-sm">
						Use this code to sign in later
					</DialogDescription>
					<p class="passcode">
						{passcode}
					</p>
					<span class="text-sm italic text-center">{message}</span>
				</div>
			</button>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.passcode-dialog {
		@apply fixed inset-0 z-50 flex items-center justify-center;
	}

	.passcode-dialog :global(.passcode-dialog-overlay) {
		@apply fixed inset-0 bg-neutral-600/50;
	}

	.passcode-dialog-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col items-center gap-4 focus;
		&:hover {
			@apply shadow-md-wide;
		}
	}

	.passcode-dialog :global(.passcode-dialog-title) {
		@apply text-title-2 text-center w-full;
		@apply transition;
	}

	:global(.passcode-dialog-card.group:hover .passcode-dialog-title) {
		@apply opacity-60;
	}
	:global(.passcode-dialog-card.group:active .passcode-dialog-title) {
		@apply opacity-30;
	}

	.dialog-card-content {
		@apply flex flex-col gap-4;
		@apply transition group-hover:opacity-50 group-active:opacity-30;
	}

	.passcode {
		@apply font-semibold text-3xl tracking-wider text-brand;
	}
</style>
