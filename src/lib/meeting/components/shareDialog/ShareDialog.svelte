<script lang="ts">
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { CopyDialog } from '$lib/core/components/dialog';

	export let open = false;

	export let slug: string;
	$: shareLink = `meetwhen.io/${slug}`;
</script>

<CopyDialog bind:open toCopy={shareLink}>
	<DialogTitle as="h1" class="share-dialog-title">Share this meet!</DialogTitle>
	<DialogDescription class="text-brand text-center select-text">
		{shareLink}
	</DialogDescription>
</CopyDialog>

<style lang="postcss">
	:global(.share-dialog-title) {
		@apply text-title-2 text-center w-full mb-4;
		@apply transition;
	}
</style>
