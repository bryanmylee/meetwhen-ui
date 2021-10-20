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
				<a href="/profile" class="nav-item">
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
					class="nav-item"
				>
					Log In
				</button>
			</li>
			<li>
				<button
					on:click={() => {
						isLoggingIn = false;
						showAuthModal = true;
					}}
					class="nav-item"
				>
					Sign Up
				</button>
			</li>
		{/if}
		<li class:active={key === '/new'}>
			<a href="/new" class="nav-item">New</a>
		</li>
		<li class:active={key === '/help'}>
			<a href="/help" class="nav-item">Help</a>
		</li>
		<li><DarkModeButton class="nav-item" /></li>
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
	.active {
		@apply text-primary;
	}

	li {
		@apply flex justify-center;
	}
</style>
