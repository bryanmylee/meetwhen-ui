<script lang="ts">
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import type { HasNeighbors } from '$lib/core/types/HasNeighbors';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import { dateToId } from '$lib/core/utils/dayjs/dateIds';
	import { getCurrentDateElement } from '../utils/datePickerContext';

	export let date: Dayjs;
	$: gridColumnStart = date.date() === 1 ? date.day() || 7 : '';
	$: isToday = date.isSame(dayjs(), 'day');

	export let selected = false;
	export let disabled = false;
	export let current = false;
	export let selectMode: Maybe<SelectMode> = undefined;
	export let neighbors: HasNeighbors;

	let buttonElement: Maybe<HTMLButtonElement>;
	const currentDateElement = getCurrentDateElement();
	$: if (current) {
		$currentDateElement = buttonElement;
	}
</script>

<button
	bind:this={buttonElement}
	type="button"
	role="gridcell"
	aria-label={date.format('D MMMM YYYY')}
	data-select-id={dateToId(date)}
	aria-selected={selected}
	{disabled}
	tabindex={current ? 0 : -1}
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	class:today={isToday}
	class:!rounded-t-none={neighbors.top}
	class:!rounded-b-none={neighbors.bottom}
	class:!rounded-l-none={neighbors.left}
	class:!rounded-r-none={neighbors.right}
	class="date-item"
	style="grid-column-start: {gridColumnStart};"
>
	{date.date()}
</button>

<style lang="postcss">
	.date-item {
		@apply p-2 text-center rounded-xl select-none focus:outline-none;
		@apply border-3 border-transparent;
		@apply transition;

		&[aria-selected='true'] {
			@apply bg-primary-400 text-white shadow shadow-primary-400/50 z-10;
			&.today {
				@apply font-bold;
			}
			&.add {
				@apply shadow-lg shadow-primary-400/50;
			}
			&.remove {
				@apply bg-primary-400/50;
			}
			&:hover {
				@apply bg-primary-300;
			}
		}

		&[aria-selected='false'] {
			@apply z-0;
			&.today {
				@apply font-bold text-primary-400;
			}
			&:hover:not(:disabled) {
				@apply bg-shade-200;
			}
		}

		&:disabled {
			@apply text-neutral-400 opacity-50;
		}
	}

	:global(:focus-within) > [tabindex='0'] {
		@apply border-primary-400;
		&.remove {
			@apply border-red-400;
		}
		&[aria-selected='true'] {
			@apply border-primary-500 gdark:border-white;
		}
	}
</style>
