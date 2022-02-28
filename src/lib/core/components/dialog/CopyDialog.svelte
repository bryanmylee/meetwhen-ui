<script lang="ts">
	import Dialog from './Dialog.svelte';

	export let open = true;
	export let toCopy: string;

	let message = 'Click to copy';
	$: if (open) {
		message = 'Click to copy';
	}

	const handleClick = async () => {
		try {
			await navigator.clipboard.writeText(toCopy);
			message = 'Copied to clipboard!';
		} catch {
			message = 'Click to copy not supported';
		}
	};
</script>

<Dialog bind:open>
	<button on:click={handleClick} class="copy-dialog">
		<div class="copy-dialog-content">
			<slot />
		</div>
		<span class="copy-dialog-message">{message}</span>
	</button>
</Dialog>

<style lang="postcss">
	.copy-dialog {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col items-center gap-4 focus;
		&:hover {
			@apply shadow-md-wide;
		}

		&:hover .copy-dialog-content,
		&:hover .copy-dialog-message {
			@apply opacity-60;
		}

		&:active .copy-dialog-content,
		&:hover .copy-dialog-message {
			@apply opacity-30;
		}
	}

	.copy-dialog-message {
		@apply text-sm italic text-center;
	}
</style>
