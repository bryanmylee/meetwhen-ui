<script lang="ts" context="module">
	export interface NavEvent {
		'open-auth': never;
		'select-theme': {
			theme: ThemeType;
		};
	}
</script>

<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { Button } from '$lib/input';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SafeUser } from '$lib/models/SafeUser';
	import NavMenu from './NavMenu.svelte';
	import type { ThemeType } from '$lib/core/types/ThemeType';

	export let user: Maybe<SafeUser> = undefined;
	export let theme: ThemeType = 'auto';
	export let onHomePage = false;
</script>

<nav class="nav">
	<div>
		{#if !onHomePage}
			<a
				href="/"
				class="hero"
				transition:fade={{ duration: 300, easing: cubicInOut }}
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
			<NavMenu {user} {theme} on:open-auth on:select-theme />
		</li>
	</ul>
	{#if !onHomePage}
		<div
			class="nav-bg"
			transition:fly={{ y: -100, easing: cubicInOut, duration: 500 }}
		/>
	{/if}
</nav>

<style lang="postcss">
	.nav {
		@apply fixed inset-0 bottom-auto;
		@apply flex justify-between items-center gap-2;
		@apply px-4 py-2 z-50;
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
