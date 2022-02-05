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

	export let open = false;

	export let slug: string;
	$: shareLink = `meetwhen.io/${slug}`;

	let message = 'Click to copy';
	$: if (!open) {
		message = 'Click to copy';
	}

	const handleClick = async () => {
		try {
			await navigator.clipboard.writeText(shareLink);
			message = 'Copied to clipboard!';
		} catch {
			message = 'Click to copy not supported';
		}
	};
</script>

<Dialog {open} on:close={() => (open = false)}>
	<div class="share-dialog" style={$primaryVars}>
		<div transition:fade={{ duration: 300, easing: cubicOut }}>
			<DialogOverlay class="share-dialog-overlay" />
			<button
				class="share-dialog-card group"
				in:fly={{ duration: 500, y: 50, easing: cubicOut }}
				on:click={handleClick}
			>
				<DialogTitle as="h1" class="share-dialog-title">
					Share this meet!
				</DialogTitle>
				<div class="dialog-card-content">
					<DialogDescription class="text-brand text-center">
						{shareLink}
					</DialogDescription>
					<span class="text-sm italic text-center">{message}</span>
				</div>
			</button>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.share-dialog {
		@apply fixed inset-0 z-50 flex items-center justify-center;
	}

	.share-dialog :global(.share-dialog-overlay) {
		@apply fixed inset-0 bg-neutral-600/50;
	}

	.share-dialog-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4 focus;
		&:hover {
			@apply shadow-md-wide;
		}
	}

	.share-dialog :global(.share-dialog-title) {
		@apply text-title-2 text-center w-full;
		@apply transition;
	}

	:global(.share-dialog-card.group:hover .share-dialog-title) {
		@apply opacity-60;
	}
	:global(.share-dialog-card.group:active .share-dialog-title) {
		@apply opacity-30;
	}

	.dialog-card-content {
		@apply flex flex-col gap-4;
		@apply transition group-hover:opacity-50 group-active:opacity-30;
	}
</style>
