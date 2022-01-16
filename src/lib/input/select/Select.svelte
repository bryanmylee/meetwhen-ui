<script lang="ts">
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
	} from '@rgossiaux/svelte-headlessui';
	import { ChevronDownIcon } from 'svelte-feather-icons';
	import { classes } from '$lib/core/utils/classes';

	type T = $$Generic;

	let selectedValue: T;
	export { selectedValue as value };

	export let id: (item: T) => string | number = (item) => `${item}`;
	export let label: (item: T) => string = (item) => `${item}`;

	export let values: T[];

	export let disabled = false;
	export let top = false;
</script>

<Listbox
	value={selectedValue}
	on:change={(event) => (selectedValue = event.detail)}
	class="listbox"
	{disabled}
>
	<ListboxButton
		class={classes('listbox-button focus-inset', top && 'top')}
		let:open
	>
		<span>
			{label(selectedValue)}
		</span>
		<ChevronDownIcon class={classes('wh-6', open && 'rotate-180')} />
	</ListboxButton>
	<ListboxOptions class={classes('listbox-options focus-inset', top && 'top')}>
		{#each values as value (id(value))}
			<ListboxOption {value} let:active let:selected class="contents">
				<div class="listbox-option" class:active class:selected>
					{label(value)}
				</div>
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>

<style lang="postcss" global>
	.listbox {
		@apply relative w-full;

		& .listbox-button {
			@apply px-4 py-2 bg-shade-100 rounded-xl w-full;
			@apply text-left flex justify-between items-center;
			@apply transition-colors;
			&[aria-expanded='true'] {
				@apply bg-shade-200;
				&:not(.top) {
					@apply rounded-b-none;
				}
				&.top {
					@apply rounded-t-none;
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

		& .listbox-options {
			@apply absolute left-0 right-0 z-10;
			@apply p-3 bg-shade-0 rounded-xl shadow-lg;
			@apply max-h-96 overflow-auto;
			&:not(.top) {
				@apply top-10 rounded-t-none;
			}
			&.top {
				@apply bottom-10 rounded-b-none;
			}

			& .listbox-option {
				@apply p-2 rounded-lg;
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
		}
	}
</style>
