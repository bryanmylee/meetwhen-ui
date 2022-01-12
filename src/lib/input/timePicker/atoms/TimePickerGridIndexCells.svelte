<script lang="ts">
	import { gridItemStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';

	const { resolution } = getTimePickerControls();
	const { localTimeCells, timeIdToRowNumber } = getTimePickerState();
</script>

{#each $localTimeCells as timeCell}
	<div
		class="timepicker-grid-index-cell"
		class:!rounded-t-lg={timeCell.isStartOfInterval}
		class:!rounded-b-lg={timeCell.isEndOfBlock}
		style={gridItemStyle({ y: $timeIdToRowNumber[timeToId(timeCell.time)] })}
	>
		{#if timeCell.time.minute() === 0}
			<div class="label" class:first={timeCell.isStartOfInterval}>
				{timeCell.time.format('h:mm')}
			</div>
		{:else if timeCell.isStartOfInterval}
			<div class="label" class:first={timeCell.isStartOfInterval}>
				{timeCell.time.format('h:mm')}
			</div>
		{/if}
		{#if timeCell.isEndOfInterval}
			<div class="label end">
				{timeCell.time.add($resolution, 'minutes').format('h:mm')}
			</div>
		{/if}
	</div>
{/each}

<style lang="postcss">
	.timepicker-grid-index-cell {
		@apply relative bg-shade-100;

		& .label {
			@apply p-1 bg-shade-100 rounded-lg whitespace-nowrap;
			@apply text-xs text-neutral-400 text-center -translate-y-1/2;
			&.first {
				@apply -translate-y-1/4;
			}
			&.end {
				@apply translate-y-0 absolute left-0 right-0 -bottom-1/4;
			}
		}
	}
</style>
