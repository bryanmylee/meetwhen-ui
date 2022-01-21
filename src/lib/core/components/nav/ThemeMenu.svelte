<script lang="ts" context="module">
	export interface ThemeOption {
		value: ThemeType;
		icon: typeof DropletIcon;
	}

	const options: ThemeOption[] = [
		{
			value: 'light',
			icon: SunIcon,
		},
		{
			value: 'dark',
			icon: MoonIcon,
		},
		{
			value: 'auto',
			icon: DropletIcon,
		},
	];
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { SunIcon, MoonIcon, DropletIcon } from 'svelte-feather-icons';
	import type { ThemeType } from '$lib/core/types/ThemeType';
	import {
		Menu,
		MenuButton,
		MenuItems,
		MenuItem,
	} from '@rgossiaux/svelte-headlessui';
	import type { NavEvent } from './Nav.svelte';

	const dispatch = createEventDispatcher<NavEvent>();

	export let open = false;

	export let selected: ThemeType = 'auto';
	$: selectedOption = options.find((o) => o.value === selected);
</script>

<Menu class="themeselect">
	<MenuButton class="themeselect-button">
		<svelte:component this={selectedOption?.icon} class="wh-6" />
	</MenuButton>
	<div class="themeselect-items-container">
		{#if open}
			<div
				transition:fade|local={{ duration: 300, easing: cubicOut }}
				class="themeselect-items-reveal"
			>
				<MenuItems static class="themeselect-items">
					{#each options as { value, icon }}
						<MenuItem as="div" id="select-{value}" let:active>
							<button
								class="themeselect-item"
								class:active
								class:selected={value === selected}
								on:click={() => dispatch('select-theme', { theme: value })}
							>
								<svelte:component this={icon} class="wh-6" />
								<label for="select-{value}">{value}</label>
							</button>
						</MenuItem>
					{/each}
				</MenuItems>
			</div>
		{/if}
	</div>
</Menu>

<style lang="postcss" global>
	.themeselect {
		@apply relative w-full;
	}

	.themeselect-button {
		@apply w-full flex justify-center;
	}

	.themeselect-items-container {
		@apply absolute top-1/2 right-full -translate-y-1/2 pr-6;
	}

	.themeselect-items-reveal {
		@apply p-2 rounded-xl bg-shade-0 shadow-lg;
		&:focus-within {
			@apply ring ring-inset ring-primary-400;
		}
	}

	.themeselect-items {
		@apply flex gap-2;
	}

	.themeselect-item {
		@apply flex flex-col justify-center items-center;
		@apply wh-16 p-2 rounded-lg;
		@apply text-center whitespace-nowrap;
		@apply bg-shade-100;
		&:hover,
		&.active {
			@apply bg-shade-50 shadow;
		}
		&:active {
			@apply bg-shade-200 shadow-sm;
		}
		&.selected {
			@apply text-primary-400;
		}

		& > label {
			@apply text-sm font-medium;
			@apply pointer-events-none;
		}
	}
</style>
