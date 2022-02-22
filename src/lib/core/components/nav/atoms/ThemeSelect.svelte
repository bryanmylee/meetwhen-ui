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
	import {
		Popover,
		PopoverButton,
		PopoverPanel,
		RadioGroup,
		RadioGroupOption,
	} from '@rgossiaux/svelte-headlessui';
	import { SunIcon, MoonIcon, DropletIcon } from 'svelte-feather-icons';
	import type { ThemeType } from '$lib/core/types';
	import { clickOutside } from '$lib/core/actions';
	import type { NavEvent } from '../Nav.svelte';

	const dispatch = createEventDispatcher<NavEvent>();

	export let open = false;
	export let selected: ThemeType = 'auto';
	$: selectedOption = options.find((o) => o.value === selected);
</script>

<Popover
	class="themeselect"
	use={[[clickOutside, () => dispatch('dismiss-theme')]]}
>
	<PopoverButton tabindex="-1" class="themeselect-anchor">
		<svelte:component this={selectedOption?.icon} class="wh-5" />
	</PopoverButton>
	<div class="themeselect-items-container">
		{#if open}
			<div
				transition:fade|local={{ duration: 300, easing: cubicOut }}
				class="themeselect-items-reveal"
			>
				<PopoverPanel static>
					<RadioGroup value={selected} class="themeselect-items">
						{#each options as { value, icon }}
							<RadioGroupOption
								as="button"
								{value}
								id="select-{value}"
								class="themeselect-item"
								on:click={() => dispatch('select-theme', { theme: value })}
							>
								<svelte:component this={icon} class="wh-5" />
								<label for="select-{value}">{value}</label>
							</RadioGroupOption>
						{/each}
					</RadioGroup>
				</PopoverPanel>
			</div>
		{/if}
	</div>
</Popover>

<style lang="postcss" global>
	.themeselect {
		@apply relative w-full;
	}

	.themeselect-anchor {
		@apply w-full flex justify-center;
	}

	.themeselect-items-container {
		@apply absolute top-0 right-0 -translate-x-2 translate-y-2;
	}

	.themeselect-items-reveal {
		@apply p-2 card;
	}

	.themeselect-items {
		@apply flex gap-2;
	}

	.themeselect-item {
		@apply flex flex-col justify-center items-center gap-0.5 focus;
		@apply wh-16 p-2 rounded-lg;
		@apply text-center whitespace-nowrap;
		@apply bg-shade-100;
		&:hover,
		&[tabindex='0'] {
			@apply bg-shade-50 shadow;
		}
		&:active {
			@apply bg-shade-200 shadow-sm;
		}
		&[aria-checked='true'] {
			@apply text-primary-400;
			& > label {
				@apply text-primary-400;
			}
		}

		& > label {
			@apply text-label;
			@apply pointer-events-none;
		}
	}
</style>
