<script lang="ts" context="module">
	export interface NavEvent {
		'open-auth': never;
		'toggle-show-theme': never;
		'dismiss-theme': never;
		'select-theme': {
			theme: ThemeType;
		};
	}
</script>

<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { Button } from '$lib/input';
	import type { SafeUser } from '$lib/models';
	import type { ThemeType } from '$lib/core/types';
	import { media } from '$lib/core/state';
	import NavDropdown from './atoms/NavDropdown.svelte';
	import NavList from './atoms/NavList.svelte';
	import NavItems from './atoms/NavItems.svelte';

	export let user: Maybe<Nullable<SafeUser>> = undefined;
	export let theme: ThemeType = 'auto';
	export let onHomePage = false;

	let showTheme = false;
</script>

<nav class="nav">
	<div>
		{#if !onHomePage}
			<a
				href="/"
				class="hero"
				transition:fade|local={{ duration: 300, easing: cubicInOut }}
			>
				meetwhen.io
			</a>
		{/if}
	</div>
	<ul class="menu-links">
		<li>
			<Button href="/new" size="sm">New</Button>
		</li>
		<li>
			{#if $media.sm}
				<NavList>
					<NavItems
						{user}
						{showTheme}
						selectedTheme={theme}
						on:dismiss-theme={() => (showTheme = false)}
						on:toggle-show-theme={() => (showTheme = !showTheme)}
						on:select-theme
						on:open-auth
					/>
				</NavList>
			{:else}
				<NavDropdown on:dismiss={() => (showTheme = false)}>
					<NavItems
						{user}
						{showTheme}
						selectedTheme={theme}
						on:dismiss-theme={() => (showTheme = false)}
						on:toggle-show-theme={() => (showTheme = !showTheme)}
						on:select-theme
						on:open-auth
					/>
				</NavDropdown>
			{/if}
		</li>
	</ul>
	{#if !onHomePage}
		<div
			class="nav-bg"
			transition:fly|local={{ y: -100, easing: cubicInOut, duration: 500 }}
		/>
	{/if}
</nav>

<style lang="postcss">
	.nav {
		@apply fixed inset-0 bottom-auto;
		@apply flex justify-between items-center gap-2;
		@apply px-4 h-14 z-50;
	}

	.nav-bg {
		@apply absolute inset-0 z-[-1];
		@apply card rounded-t-none;
	}

	.hero {
		@apply text-brand focus-text hover:opacity-50 active:opacity-30;
	}

	.menu-links {
		@apply flex items-center gap-2;
	}
</style>
