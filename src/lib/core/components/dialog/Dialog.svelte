<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
	import { primaryVars } from '$lib/core/state';

	export let open = true;
	let isStatic = false;
	export { isStatic as static };
</script>

<Dialog
	{open}
	on:close={() => {
		if (!isStatic) {
			open = false;
		}
	}}
>
	<div class="dialog" style={$primaryVars}>
		<div transition:fade|local={{ duration: 300, easing: cubicOut }}>
			<DialogOverlay class="dialog-overlay" />
			<div
				class="relative z-10"
				in:fly|local={{ duration: 500, y: 50, easing: cubicOut }}
			>
				<slot />
			</div>
		</div>
	</div>
</Dialog>

<style lang="postcss">
	.dialog {
		@apply fixed inset-0 z-50 flex items-center justify-center;
	}

	.dialog :global(.dialog-overlay) {
		@apply fixed inset-0 bg-neutral-600/50;
	}
</style>
