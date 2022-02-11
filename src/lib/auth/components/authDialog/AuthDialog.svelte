<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { XIcon } from 'svelte-feather-icons';
	import {
		Dialog,
		DialogOverlay,
		DialogTitle,
	} from '@rgossiaux/svelte-headlessui';
	import { primaryVars } from '$lib/core/state';
	import { Button } from '$lib/input';
	import AuthCard from './AuthCard.svelte';
	import type { WithErrorable } from '$lib/core/utils/withError';

	export let name: WithErrorable<string>;
	export let email: WithErrorable<string>;
	export let password: WithErrorable<string>;

	export let open = true;
	export let isCreating = false;
</script>

<Dialog {open} on:close={() => (open = false)}>
	<div class="dialog" style={$primaryVars}>
		<div transition:fade={{ duration: 300, easing: cubicOut }}>
			<DialogOverlay class="dialog-overlay" />
			<div in:fly={{ duration: 500, y: 50, easing: cubicOut }}>
				<AuthCard
					{name}
					{email}
					{password}
					bind:isCreating
					on:password-signin
					on:password-create
					on:oauth-signin
					on:cancel={() => (open = false)}
					class="dialog-card"
				>
					<svelte:fragment slot="header">
						<DialogTitle as="h2" class="text-brand w-fit">
							meetwhen.io
						</DialogTitle>
					</svelte:fragment>
					<svelte:fragment slot="footer">
						<Button
							on:click={() => (open = false)}
							variant="text-only"
							icon
							class="dialog-dismiss-button"
						>
							<XIcon />
						</Button>
					</svelte:fragment>
				</AuthCard>
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

	.dialog :global(.dialog-card) {
		width: calc(100vw - 2rem);
		max-width: 30rem;
		@media (min-width: 768px) {
			max-width: 48rem;
		}
	}

	.dialog :global(.dialog-dismiss-button) {
		@apply absolute top-4 right-4;
		@apply wh-7;
	}
</style>
