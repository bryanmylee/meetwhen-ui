<script lang="ts">
	import { classes } from '$lib/core/utils/classes';
	import {
		Listbox,
		ListboxButton,
		ListboxOption,
		ListboxOptions,
	} from '@rgossiaux/svelte-headlessui';

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
	<ListboxButton class={classes('listbox-button focus-inset', top && 'top')}>
		{label(selectedValue)}
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
			@apply p-4 bg-shade-100 rounded-xl w-full;
			@apply text-left;
			@apply transition-colors;
			&[aria-expanded='true'] {
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
			&:not(:disabled) {
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
				@apply top-14 rounded-t-none;
			}
			&.top {
				@apply bottom-14 rounded-b-none;
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
					&:hover {
						@apply bg-primary-500;
					}
				}
			}
		}
	}
</style>
