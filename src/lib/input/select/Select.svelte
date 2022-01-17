<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
	} from '@rgossiaux/svelte-headlessui';
	import { ChevronDownIcon, ChevronsDownIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/core/utils/classes';
	import { scrollIndicator } from '$lib/core/utils/useScrollIndicator';
	import { scrollToSelected } from '$lib/core/utils/useScrollToSelected';

	type T = $$Generic;

	let selectedValue: T;
	export { selectedValue as value };

	export let id: (item: T) => string | number = (item) => `${item}`;
	export let label: (item: T) => string = (item) => `${item}`;

	export let values: T[];

	export let disabled = false;
	export let top = false;
	export let sm = false;

	const optionsIndicator = writable({ showX: false, showY: false });
</script>

<Listbox
	value={selectedValue}
	on:change={(event) => (selectedValue = event.detail)}
	class={classes('listbox', top && 'top', sm && 'sm')}
	{disabled}
>
	<ListboxButton class="listbox-button" let:open>
		<span>
			{label(selectedValue)}
		</span>
		<ChevronDownIcon class={classes('wh-6', open && 'rotate-180')} />
	</ListboxButton>
	<ListboxOptions class="listbox-options">
		<div class="listbox-options-scrollbox">
			<div
				use:scrollIndicator={optionsIndicator}
				use:scrollToSelected={{ alignTop: !top }}
				class="listbox-options-scroll"
			>
				{#each values as value (id(value))}
					<ListboxOption {value} let:active let:selected>
						<div class="listbox-option" class:active class:selected>
							{label(value)}
						</div>
					</ListboxOption>
				{/each}
			</div>
			{#if $optionsIndicator.showY}
				<div
					transition:fade|local={{ duration: 150 }}
					class="listbox-options-scroll-indicator"
				>
					<ChevronsDownIcon class="wh-4" />
				</div>
			{/if}
		</div>
	</ListboxOptions>
</Listbox>

<style lang="postcss" global>
	.listbox {
		@apply relative w-full;
	}

	.listbox-button {
		@apply p-4 bg-shade-100 rounded-xl w-full focus-inset;
		.sm & {
			@apply py-2;
		}
		@apply text-left flex justify-between items-center;
		@apply transition-colors;
		&[aria-expanded='true'] {
			@apply bg-shade-200 rounded-b-none;
			.top & {
				@apply rounded-t-none rounded-b-xl;
			}
		}
		&:disabled {
			@apply text-neutral-400 opacity-50;
		}
		&:not(:disabled)[aria-expanded='false'] {
			&:not(:active):hover {
				@apply bg-shade-50 shadow;
			}
			&:active {
				@apply bg-shade-200 shadow-sm;
			}
		}
	}

	.listbox-options {
		@apply absolute left-0 right-0 z-10 focus-inset;
		@apply bg-shade-0 rounded-xl shadow-lg;
		@apply top-full rounded-t-none;
		.top & {
			@apply top-auto rounded-t-xl;
			@apply bottom-full rounded-b-none;
		}
	}

	.listbox-options-scrollbox {
		@apply relative p-3;
	}

	.listbox-options-scroll {
		@apply rounded-lg;
		@apply max-h-96 overflow-auto no-scrollbar;
	}

	.listbox-options-scroll-indicator {
		@apply absolute bottom-4 left-0 right-0;
		@apply flex justify-center;
	}

	.listbox-option {
		@apply p-2 rounded-lg cursor-pointer;
		@apply whitespace-nowrap;
		&:not(:active):hover {
			@apply bg-shade-100;
		}
		&.active {
			@apply bg-shade-200;
		}
		&.selected {
			@apply bg-primary-400 text-white;
			&:not(:active):hover {
				@apply bg-primary-500;
			}
		}
	}
</style>
