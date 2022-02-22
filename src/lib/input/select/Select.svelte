<script lang="ts">
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
	} from '@rgossiaux/svelte-headlessui';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/core/utils';
	import { scrollToSelected } from '$lib/core/actions';

	type T = $$Generic;

	export let id = '';

	let selectedValue: T;
	export { selectedValue as value };

	export let itemId: (item: T) => string | number = (item) => `${item}`;
	export let itemLabel: (item: T) => string = (item) => `${item}`;

	export let values: T[];

	export let disabled = false;
	export let top = false;
	export let sm = false;

	let className = '';
	export { className as class };
</script>

<Listbox
	{id}
	value={selectedValue}
	on:change={(event) => (selectedValue = event.detail)}
	class={classes('listbox', top && 'top', sm && 'sm', className)}
	{disabled}
>
	<ListboxButton class="listbox-button" let:open>
		<div>
			{@html itemLabel(selectedValue)}
		</div>
		<ChevronDownIcon class={classes('wh-5', open && 'rotate-180')} />
	</ListboxButton>
	<ListboxOptions class="listbox-options">
		<div class="listbox-options-scrollbox">
			<div
				use:scrollToSelected={{ alignTop: !top }}
				class="listbox-options-scroll"
			>
				{#each values as value (itemId(value))}
					<ListboxOption
						{value}
						let:active
						let:selected
						class="group focus:outline-none"
					>
						<div class="listbox-option" class:active class:selected>
							{@html itemLabel(value)}
						</div>
					</ListboxOption>
				{/each}
			</div>
		</div>
	</ListboxOptions>
</Listbox>

<style lang="postcss" global>
	.listbox {
		@apply relative w-full;
	}

	.listbox-button {
		@apply p-4 rounded-xl w-full focus-inset;
		@apply bg-shade-100 font-medium;
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
			@apply bg-shade-100;
			&:hover {
				@apply bg-shade-50 shadow;
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
		@apply max-h-80 overflow-auto no-scrollbar;
	}

	.listbox-option {
		@apply p-2 rounded-lg cursor-pointer;
		@apply whitespace-nowrap;
		&:not(:active):hover,
		&:not(:active).active {
			@apply bg-shade-100;
		}
		&:active {
			@apply bg-shade-200;
		}
		&:not(:hover).active,
		.group:focus & {
			@apply ring ring-inset ring-primary-400;
		}
		&.selected {
			@apply bg-primary-400 text-white;
			&:not(:active):hover,
			&:not(:active).active {
				@apply bg-primary-500;
			}
		}
	}
</style>
