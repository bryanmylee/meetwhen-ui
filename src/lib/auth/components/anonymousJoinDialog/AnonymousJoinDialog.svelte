<script lang="ts" context="module">
	export interface AnonymousJoinDialogEvent {
		'show-returning': never;
		'anonymous-create': {
			username: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { XIcon } from 'svelte-feather-icons';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
	} from '@rgossiaux/svelte-headlessui';
	import { primaryVars } from '$lib/core/state';
	import { Button } from '$lib/input';
	import type { WithErrorable } from '$lib/core/utils/withError';
	import { focusOnMount } from '$lib/core/utils/useFocusOnMount';
	import Textfield from '$lib/input/textfield/Textfield.svelte';

	const dispatch = createEventDispatcher<AnonymousJoinDialogEvent>();

	export let open = true;

	export let username: WithErrorable<string>;

	export let meetingSlug: string;

	export const handleConfirmJoin = () => {
		dispatch('anonymous-create', {
			username: $username.value,
		});
	};
</script>

<Dialog {open} on:close={() => (open = false)}>
	<div class="dialog" style={$primaryVars}>
		<div transition:fade={{ duration: 300, easing: cubicOut }}>
			<DialogOverlay class="dialog-overlay" />
			<div
				in:fly={{ duration: 500, y: 50, easing: cubicOut }}
				class="dialog-card"
			>
				<DialogDescription>
					<p class="text-brand">meetwhen.io/{meetingSlug}</p>
				</DialogDescription>
				<DialogTitle as="h1" class="flex justify-between items-baseline">
					<span class="text-title-1"> Join as a guest </span>
					<span>
						or
						<button
							on:click={() => dispatch('show-returning')}
							class="dialog-returning"
						>
							returning guest?
						</button>
					</span>
				</DialogTitle>
				<Textfield
					label="Name"
					required
					value={$username.value}
					error={$username.error}
					use={[focusOnMount]}
				/>
				<div class="flex gap-4">
					<Button
						color="gray"
						size="md"
						class="w-full"
						on:click={() => (open = false)}
					>
						Cancel
					</Button>
					<Button size="md" class="w-full" on:click={handleConfirmJoin}>
						Join
					</Button>
				</div>
				<Button
					on:click={() => (open = false)}
					variant="text-only"
					icon
					class="dialog-dismiss-button"
				>
					<XIcon />
				</Button>
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

	.dialog-card {
		@apply card p-6 relative z-10;
		@apply flex flex-col gap-4;
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

	.dialog-returning {
		@apply text-neutral-400 underline underline-offset-2;
		@apply focus p-1 rounded hover:text-primary-400;
	}
</style>
