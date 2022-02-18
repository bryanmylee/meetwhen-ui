<script lang="ts">
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';

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

<Dialog bind:open>
	<button class="share-dialog-card group" on:click={handleClick}>
		<DialogTitle as="h1" class="share-dialog-title">
			Share this meet!
		</DialogTitle>
		<div class="share-dialog-content">
			<DialogDescription class="text-brand text-center select-text">
				{shareLink}
			</DialogDescription>
			<span class="text-sm italic text-center">{message}</span>
		</div>
	</button>
</Dialog>

<style lang="postcss">
	.share-dialog-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4 focus;
		&:hover {
			@apply shadow-md-wide;
		}
	}

	:global(.share-dialog-title) {
		@apply text-title-2 text-center w-full;
		@apply transition;
	}

	:global(.share-dialog-card.group:hover .share-dialog-title) {
		@apply opacity-60;
	}
	:global(.share-dialog-card.group:active .share-dialog-title) {
		@apply opacity-30;
	}

	.share-dialog-content {
		@apply flex flex-col gap-4;
		@apply transition group-hover:opacity-50 group-active:opacity-30;
	}
</style>
