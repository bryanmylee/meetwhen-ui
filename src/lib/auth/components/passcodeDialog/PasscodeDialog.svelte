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
		<div class="passcode-box">
			<span class="passcode-label">
				{passcode}
			</span>
			{#each { length: 6 } as _}
				<div class="passcode-letterbox" />
			{/each}
		</div>
	</div>
</CopyDialog>

<style lang="postcss">
	:global(.passcode-dialog-title) {
		@apply text-title-1 text-center w-full mb-2;
		@apply transition;
	}

	.passcode-dialog-content {
		@apply flex flex-col gap-4;
	}

	.passcode-box {
		@apply relative flex justify-center gap-2;
		@apply mx-6 scale-125;
	}

	.passcode-label {
		@apply absolute inset-0;
		@apply font-mono font-semibold text-3xl text-brand;
		letter-spacing: 1.375rem;
		margin-right: -1.375rem;
	}

	.passcode-letterbox {
		@apply font-mono text-3xl w-8 h-10 bg-shade-100 rounded;
	}
</style>
