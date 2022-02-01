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
		Popover,
		PopoverButton,
		PopoverPanel,
		RadioGroup,
		RadioGroupOption,
	} from '@rgossiaux/svelte-headlessui';
	import type { NavEvent } from './Nav.svelte';

	const dispatch = createEventDispatcher<NavEvent>();

	export let open = false;

	export let selected: ThemeType = 'auto';
	$: selectedOption = options.find((o) => o.value === selected);
</script>

<Popover class="themeselect">
	<PopoverButton class="themeselect-anchor">
		<svelte:component this={selectedOption?.icon} class="wh-6" />
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
								as="div"
								{value}
								id="select-{value}"
								let:active
								let:checked
								class="focus:outline-none"
							>
								<button
									class="themeselect-item"
									class:active
									class:checked
									on:click={() => dispatch('select-theme', { theme: value })}
								>
									<svelte:component this={icon} class="wh-6" />
									<label for="select-{value}">{value}</label>
								</button>
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
		@apply absolute top-1/2 right-full -translate-y-1/2 pr-6;
	}

	.themeselect-items-reveal {
		@apply p-2 card;
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
		&.checked {
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
