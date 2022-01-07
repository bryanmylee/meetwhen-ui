<script lang="ts">
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import type { HasNeighbors } from '$lib/core/types/HasNeighbors';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import { dateToId } from '../utils/dateIds';

	export let date: Dayjs;
	$: gridColumnStart = date.date() === 1 ? date.day() || 7 : '';
	$: isToday = date.isSame(dayjs(), 'day');

	export let selected = false;
	export let disabled = false;
	export let focused = false;
	export let selectMode: Maybe<SelectMode> = undefined;
	export let neighbours: HasNeighbors;
</script>

<button
	type="button"
	data-select-id={dateToId(date)}
	aria-selected={selected}
	{disabled}
	tabindex={focused ? 0 : -1}
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	class:today={isToday}
	class:!rounded-t-none={neighbours.top}
	class:!rounded-b-none={neighbours.bottom}
	class:!rounded-l-none={neighbours.left}
	class:!rounded-r-none={neighbours.right}
	class="date-item"
	style="grid-column-start: {gridColumnStart};"
>
	{date.date()}
</button>

<style lang="postcss" global>
	.date-item {
		@apply p-2 text-center rounded-xl select-none focus:outline-none;
		@apply border-3 border-transparent;
		@apply transition;

		&[aria-selected='true'] {
			@apply bg-primary-400 text-white shadow shadow-primary-400/30 z-10;
			&.today {
				@apply font-bold;
			}
			&.add {
				@apply shadow-lg shadow-primary-400/30;
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
				@apply bg-neutral-200 dark:bg-neutral-600;
			}
		}

		&:disabled {
			@apply text-neutral-300 dark:text-neutral-600;
		}
	}

	:focus-within > [tabindex='0'] {
		&[aria-selected='true'] {
			@apply border-white;
		}
		&[aria-selected='false'] {
			@apply border-primary-400;
		}
	}
</style>
