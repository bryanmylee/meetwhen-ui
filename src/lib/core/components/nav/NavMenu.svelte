<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
	} from '@rgossiaux/svelte-headlessui';
	import { MenuIcon } from 'svelte-feather-icons';
	import type { NavEvent } from './Nav.svelte';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SafeUser } from '$lib/models/SafeUser';
	import type { ThemeType } from '$lib/core/types/ThemeType';
	import ThemeSelect from './ThemeSelect.svelte';

	const dispatch = createEventDispatcher<NavEvent>();

	export let user: Maybe<SafeUser> = undefined;
	export let theme: ThemeType = 'auto';
</script>

<Menu class="menu" let:open>
	<MenuButton class="menu-button">
		<MenuIcon class="wh-6" />
	</MenuButton>
	<div class="menu-items-container">
		{#if open}
			<div
				transition:slide|local={{ duration: 300, easing: cubicOut }}
				class="menu-items-reveal"
			>
				<MenuItems static class="focus:outline-none">
					{#if user === undefined}
						<MenuItem
							as="button"
							on:click={() => dispatch('open-auth')}
							let:active
						>
							<span class="menu-item" class:active> Sign In </span>
						</MenuItem>
					{:else}
						<MenuItem as="a" href="/profile" let:active>
							<span class="menu-item" class:active> Profile </span>
						</MenuItem>
					{/if}
					<span class="menu-divider" />
					<MenuItem as="div" let:active>
						<div class="menu-item" class:active>
							<ThemeSelect open={active} selected={theme} on:select-theme />
						</div>
					</MenuItem>
				</MenuItems>
			</div>
		{/if}
	</div>
</Menu>

<style lang="postcss" global>
	.menu {
		@apply relative;
	}

	.menu-button {
		@apply p-2 flex items-center rounded-xl;
		@apply bg-shade-100 focus transition-colors;
		&:not(:active):hover {
			@apply bg-shade-50 shadow;
		}
		&:active {
			@apply bg-shade-200 shadow-sm;
		}
	}

	.menu-items-container {
		@apply absolute top-full right-0 pt-2;
		@apply rounded-b-xl shadow-lg;
	}

	.menu-items-reveal {
		@apply p-2 rounded-b-xl bg-shade-0;
		&:focus-within {
			@apply ring ring-inset ring-primary-400;
		}
	}

	.menu-item {
		@apply flex items-center p-2 rounded-lg;
		@apply text-center whitespace-nowrap;
		&:hover,
		&.active {
			@apply bg-shade-100;
		}
		&:active {
			@apply bg-shade-200;
		}
	}

	.menu-divider {
		@apply block my-2 w-full h-0.5 bg-shade-200;
	}
</style>
