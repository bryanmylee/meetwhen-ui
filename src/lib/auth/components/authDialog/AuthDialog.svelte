<script lang="ts">
	import { XIcon } from 'svelte-feather-icons';
	import { DialogTitle } from '@rgossiaux/svelte-headlessui';
	import { Dialog } from '$lib/core/components/dialog';
	import { Button } from '$lib/input';
	import AuthCard from './AuthCard.svelte';
	import type { WithErrorable } from '$lib/core/utils/withError';

	export let name: WithErrorable<string>;
	export let email: WithErrorable<string>;
	export let password: WithErrorable<string>;

	export let open = true;
	export let isCreating = false;
	export let hasMeeting = false;
</script>

<Dialog bind:open on:dismiss>
	<AuthCard
		{name}
		{email}
		{password}
		{hasMeeting}
		bind:isCreating
		on:password-signin
		on:password-create
		on:oauth-signin
		on:show-guest-signin
		on:cancel={() => (open = false)}
		class="auth-dialog-card"
	>
		<svelte:fragment slot="header">
			<DialogTitle as="h2" class="text-brand w-fit -mb-2">
				meetwhen.io
			</DialogTitle>
		</svelte:fragment>
		<svelte:fragment slot="footer">
			<Button
				on:click={() => (open = false)}
				variant="text-only"
				icon
				class="auth-dialog-dismiss-button"
			>
				<XIcon />
			</Button>
		</svelte:fragment>
	</AuthCard>
</Dialog>

<style lang="postcss">
	:global(.auth-dialog-card) {
		width: calc(100vw - 2rem);
		max-width: 30rem;
		@media (min-width: 768px) {
			max-width: 48rem;
		}
	}

	:global(.auth-dialog-dismiss-button) {
		@apply absolute top-5 right-5;
		@apply wh-7;
	}
</style>
