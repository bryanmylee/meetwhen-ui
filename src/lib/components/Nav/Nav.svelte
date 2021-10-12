<script lang="ts">
	import { session } from '$app/stores';
	import AuthModal from '$lib/components/AuthModal/AuthModal.svelte';
	import DarkModeButton from './DarkModeButton.svelte';
	import HomeNavItem from './HomeNavItem.svelte';
	import Template from './Template.svelte';
	import { activeMeeting } from '$lib/app-state';

	export let key: string;

	let isLoggingIn = true;
	let showAuthModal = false;
</script>

<Template {key}>
	<svelte:fragment slot="left">
		<HomeNavItem slot="left" />
	</svelte:fragment>
	<svelte:fragment slot="right">
		{#if $session.user !== null}
			<li class:active={key === '/profile'}>
				<a href="/profile" class="text-focusable">
					Hi, <span class="font-bold">{$session.user.name}</span>
				</a>
			</li>
		{:else}
			<li>
				<button
					on:click={() => {
						isLoggingIn = true;
						showAuthModal = true;
					}}
					class="text-focusable">Log In</button
				>
			</li>
			<li>
				<button
					on:click={() => {
						isLoggingIn = false;
						showAuthModal = true;
					}}
					class="text-focusable">Sign Up</button
				>
			</li>
		{/if}
		<li class:active={key === '/help'}><a href="/help" class="text-focusable">Help</a></li>
		<li class="flex items-center"><DarkModeButton /></li>
	</svelte:fragment>
</Template>

{#if showAuthModal}
	<AuthModal
		activeMeeting={$activeMeeting}
		{isLoggingIn}
		on:dismiss={() => (showAuthModal = false)}
	/>
{/if}

<style lang="postcss">
	a,
	button {
		@apply font-medium hover:text-primary hover:underline;
	}

	li {
		@apply px-4;
		&:last-child {
			@apply pr-0;
		}
	}

	.active {
		@apply text-primary;
	}
</style>
