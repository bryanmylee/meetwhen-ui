<script lang="ts">
	import type { HasNeighbors } from '$lib/core/types/HasNeighbors';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { GridItem } from '$lib/core/components/grid';
	import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
	import {
		getTimePickerState,
		getCurrentDateTimeElement,
	} from '../utils/timePickerContext';
	import { timePickerToId } from '../utils/timePickerId';

	export let dateId: string;
	export let timeId: string;
	$: label =
		`${timeFromId(timeId).format('HH:mm')}` +
		` ${dateFromId(dateId).format('D MMM YYYY')}`;

	export let selected = false;
	export let current = false;
	export let disabled = false;
	export let selectMode: Maybe<SelectMode> = undefined;
	export let neighbours: HasNeighbors;

	const state = getTimePickerState();
	const { dateIdToColumnNumber, timeIdToRowNumber } = state;

	let buttonElement: Maybe<HTMLButtonElement>;
	const currentDateTimeElement = getCurrentDateTimeElement();
	$: if (current) {
		$currentDateTimeElement = buttonElement;
	}
</script>

<GridItem x={$dateIdToColumnNumber[dateId]} y={$timeIdToRowNumber[timeId]}>
	<button
		bind:this={buttonElement}
		type="button"
		role="gridcell"
		aria-label={label}
		data-select-id={timePickerToId([dateId, timeId])}
		aria-selected={selected}
		{disabled}
		tabindex={current ? 0 : -1}
		class:add={selectMode === 'add'}
		class:remove={selectMode === 'remove'}
		class:!rounded-t-none={neighbours.top}
		class:!rounded-b-none={neighbours.bottom}
		class:!rounded-l-none={neighbours.left}
		class:!rounded-r-none={neighbours.right}
		class="datetime-item"
	/>
</GridItem>

<style lang="postcss">
	.datetime-item {
		@apply rounded-xl w-full h-full bg-shade-100;
		@apply select-none focus:outline-none;
		@apply border-3 border-transparent;
		@apply transition;

		&[aria-selected='true'] {
			@apply bg-primary-400 shadow shadow-primary-400/30 z-10;
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
			&:hover:not(:disabled) {
				@apply bg-shade-200;
			}
		}
	}

	/** div required for GridItem element */
	:global(:focus-within > div) > [tabindex='0'] {
		&[aria-selected='true'] {
			@apply border-white;
		}
		&[aria-selected='false'] {
			@apply border-primary-400;
		}
	}
</style>
