<script lang="ts" context="module">
	export interface AuthDialogEvent {
		'password-signin': {
			email: string;
			password: string;
		};
		'password-create': {
			name: string;
			email: string;
			password: string;
		};
		'oauth-signin': {
			providerType: string;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Dialog,
		DialogDescription,
		DialogOverlay,
		DialogTitle,
		Switch,
	} from '@rgossiaux/svelte-headlessui';
	import { XIcon } from 'svelte-feather-icons';
	import { primaryVars } from '$lib/core/state';
	import { withError } from '$lib/core/utils/withError';
	import { Button } from '$lib/input';
	import PasswordSignInForm from './PasswordSignInForm.svelte';
	import PasswordCreateForm from './PasswordCreateForm.svelte';
	import OAuthLoginButtons from './OAuthLoginButtons.svelte';

	const dispatch = createEventDispatcher<AuthDialogEvent>();

	export let open = false;
	export let isCreating = false;

	let name = withError('');
	let email = withError('');
	let password = withError('');
	$: if (!open) {
		name.reset();
		email.reset();
		password.reset();
	}

	export const handlePasswordSignInSubmit = () => {
		dispatch('password-signin', {
			email: $email.value,
			password: $password.value,
		});
	};

	export const handlePasswordCreateSubmit = () => {
		dispatch('password-create', {
			name: $name.value,
			email: $email.value,
			password: $password.value,
		});
	};
</script>

<Dialog {open} on:close={() => (open = false)}>
	<div class="dialog" style={$primaryVars}>
		<div transition:fade={{ duration: 300 }}>
			<DialogOverlay class="dialog-overlay" />
			<div
				class="dialog-card"
				in:fly={{ duration: 500, y: 50, easing: cubicOut }}
			>
				<DialogTitle as="h1" class="text-brand w-fit">meetwhen.io</DialogTitle>
				<div class="flex items-baseline justify-between">
					<DialogDescription as="h2" class="text-2xl font-medium">
						{#if isCreating}
							Create an account
						{:else}
							Sign in
						{/if}
					</DialogDescription>
					<span>
						or
						<Switch
							checked={isCreating}
							on:change={(event) => {
								isCreating = event.detail;
							}}
							class="dialog-creating-toggle"
						>
							{#if isCreating}
								sign in
							{:else}
								create an account
							{/if}
						</Switch>
					</span>
				</div>
				{#if isCreating}
					<PasswordCreateForm
						{name}
						{email}
						{password}
						on:submit={handlePasswordCreateSubmit}
						on:cancel={() => (open = false)}
					/>
				{:else}
					<PasswordSignInForm
						{email}
						{password}
						on:submit={handlePasswordSignInSubmit}
						on:cancel={() => (open = false)}
					/>
				{/if}
				<h2
					class="text-sm text-center !text-neutral-400 pt-4 border-t border-neutral-200 dark:border-neutral-600"
				>
					or sign in with
				</h2>
				<OAuthLoginButtons
					on:click={(event) =>
						dispatch('oauth-signin', {
							providerType: event.detail.providerType,
						})}
				/>
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
		@apply fixed inset-0 z-10 flex items-center justify-center;
	}

	.dialog :global(.dialog-overlay) {
		@apply fixed inset-0 bg-neutral-600/50;
	}

	.dialog-card {
		@apply relative z-10 p-4 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4;
		@apply w-96;
	}

	.dialog :global(.dialog-creating-toggle) {
		@apply !text-neutral-400 underline underline-offset-2;
		@apply focus p-1 rounded hover:!text-primary-400;
	}

	.dialog :global(.dialog-dismiss-button) {
		@apply absolute top-4 right-4;
		@apply wh-7;
	}
</style>
