<script lang="ts" context="module">
	export interface NavDropdownEvent {
		dismiss: never;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { MenuIcon } from 'svelte-feather-icons';
	import type { NavItem } from '../types/NavItem';
	import { Button } from '$lib/input';
	import { clickOutside } from '$lib/core/utils/useClickOutside';

	const dispatch = createEventDispatcher<NavDropdownEvent>();

	$: if (!open) {
		dispatch('dismiss');
	}

	let open = false;
	export let navItems: NavItem[];
</script>

<div class="menu" use:clickOutside={() => (open = false)}>
	<Button color="gray" size="sm" on:click={() => (open = !open)}>
		<MenuIcon class="wh-6" />
	</Button>
	<div class="menu-items-container">
		{#if open}
			<div
				transition:slide|local={{ duration: 300, easing: cubicOut }}
				class="menu-items-reveal"
				on:click={() => (open = false)}
			>
				<div>
					{#each navItems as navItem}
						{#if navItem.type === 'button'}
							<button
								on:click={(event) => {
									if (navItem.preventDismiss) {
										event.stopPropagation();
									}
									navItem.action();
								}}
								class="menu-item"
							>
								{#if navItem.display === 'label'}
									{navItem.label}
								{:else}
									<svelte:component
										this={navItem.component}
										{...navItem.props ?? {}}
										clickOutside
									/>
								{/if}
							</button>
						{:else}
							<a href={navItem.href} class="menu-item">
								{#if navItem.display === 'label'}
									{navItem.label}
								{:else}
									<svelte:component
										this={navItem.component}
										{...navItem.props ?? {}}
									/>
								{/if}
							</a>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.menu {
		@apply relative;
	}

	.menu-items-container {
		@apply absolute top-full -right-2 mt-2 pt-2;
		@apply rounded-xl shadow-lg z-10;
	}

	.menu-items-reveal {
		@apply p-2 card;
	}

	.menu-item {
		@apply focus;
		@apply w-full flex justify-center items-center p-2 rounded-lg;
		@apply text-center text-label whitespace-nowrap;
		&:hover {
			@apply bg-shade-200;
		}
		&:active {
			@apply bg-shade-300;
		}
	}
</style>
