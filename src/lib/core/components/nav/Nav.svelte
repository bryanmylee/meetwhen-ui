<script lang="ts" context="module">
	export interface NavEvent {
		'open-auth': never;
		'select-theme': {
			theme: ThemeType;
		};
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { Button } from '$lib/input';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { Nullable } from '$lib/core/types/Nullable';
	import type { SafeUser } from '$lib/models/SafeUser';
	import type { ThemeType } from '$lib/core/types/ThemeType';
	import { media } from '$lib/core/state';
	import type { NavItem } from './types/NavItem';
	import NavDropdown from './atoms/NavDropdown.svelte';
	import NavList from './atoms/NavList.svelte';
	import ThemeSelect from './atoms/ThemeSelect.svelte';

	export let user: Maybe<Nullable<SafeUser>> = undefined;
	export let theme: ThemeType = 'auto';
	export let onHomePage = false;

	const dispatch = createEventDispatcher<NavEvent>();

	let showTheme = false;

	let navItems: NavItem[];
	$: navItems = [
		user == null
			? {
					type: 'button',
					action: user === null ? () => dispatch('open-auth') : () => {},
					attributes:
						user === null
							? {}
							: {
									class: 'opacity-30 cursor-wait',
							  },
					display: 'label',
					label: 'Sign In',
			  }
			: {
					type: 'link',
					href: '/profile',
					display: 'label',
					label: 'Profile',
			  },
		{
			type: 'button',
			action: () => (showTheme = !showTheme),
			preventDismiss: true,
			display: 'component',
			component: ThemeSelect,
			props: {
				open: showTheme,
				selected: theme,
				onSelectTheme: (t: ThemeType) => dispatch('select-theme', { theme: t }),
			},
		},
	];
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
				<NavList {navItems} />
			{:else}
				<NavDropdown {navItems} on:dismiss={() => (showTheme = false)} />
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
