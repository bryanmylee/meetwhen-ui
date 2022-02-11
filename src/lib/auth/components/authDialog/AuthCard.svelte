<script lang="ts" context="module">
	export interface AuthEvent {
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
			providerType: OAuthProviderType;
		};
		cancel: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Switch } from '@rgossiaux/svelte-headlessui';
	import type { WithErrorable } from '$lib/core/utils/withError';
	import PasswordSignInForm from './atoms/PasswordSignInForm.svelte';
	import PasswordCreateForm from './atoms/PasswordCreateForm.svelte';
	import OAuthLoginButtons from './atoms/OAuthLoginButtons.svelte';
	import type { OAuthProviderType } from '$lib/auth/providers';

	const dispatch = createEventDispatcher<AuthEvent>();

	export let isCreating = false;

	export let name: WithErrorable<string>;
	export let email: WithErrorable<string>;
	export let password: WithErrorable<string>;

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

	let className = '';
	export { className as class };
</script>

<div class="auth-card {className}">
	<slot name="header" />
	<div class="auth-card-content">
		<div class="auth-password">
			<div class="flex items-baseline justify-between">
				<h1 class="text-title-1">
					{#if isCreating}
						Create an account
					{:else}
						Sign in
					{/if}
				</h1>
				<span>
					or
					<Switch
						checked={isCreating}
						on:change={(event) => {
							isCreating = event.detail;
						}}
						class="auth-creating-toggle"
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
					on:cancel
				/>
			{:else}
				<PasswordSignInForm
					{email}
					{password}
					on:submit={handlePasswordSignInSubmit}
					on:cancel
				/>
			{/if}
		</div>
		<div class="auth-oauth">
			<h2 class="text-center text-neutral-400">or sign in with</h2>
			<OAuthLoginButtons
				on:click={(event) =>
					dispatch('oauth-signin', {
						providerType: event.detail.providerType,
					})}
			/>
		</div>
		<slot name="footer" />
	</div>
</div>

<style lang="postcss">
	.auth-card {
		@apply relative z-10 p-6 shadow-lg rounded-xl bg-shade-0;
		@apply flex flex-col gap-4;
	}

	.auth-card-content {
		@apply flex flex-col gap-4;
		@media (min-width: 768px) {
			@apply flex-row items-stretch gap-6;
		}
	}

	.auth-password {
		@apply flex flex-col justify-between gap-4;
		@apply flex-1;
	}

	.auth-oauth {
		@apply flex flex-col gap-4 pt-4;
		@apply border-t border-neutral-200 gdark:border-neutral-600;
		@media (min-width: 768px) {
			@apply border-t-0 border-l pt-2 pl-6;
		}
	}

	.auth-card :global(.auth-creating-toggle) {
		@apply text-neutral-400 underline underline-offset-2;
		@apply focus p-1 rounded hover:text-primary-400;
	}
</style>
