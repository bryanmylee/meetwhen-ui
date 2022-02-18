<script lang="ts">
	import { DialogDescription, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { CopyDialog } from '$lib/core/components/dialog';

	export let open = true;
	export let passcode: string;
</script>

<CopyDialog bind:open toCopy={passcode}>
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
	</div>
</CopyDialog>

<style lang="postcss">
	:global(.passcode-dialog-title) {
		@apply text-title-2 text-center w-full;
		@apply transition;
	}

	.passcode-dialog-content {
		@apply flex flex-col gap-4;
		@apply transition group-hover:opacity-50 group-active:opacity-30;
	}

	.passcode {
		@apply font-semibold text-3xl tracking-wider text-brand;
	}
</style>
