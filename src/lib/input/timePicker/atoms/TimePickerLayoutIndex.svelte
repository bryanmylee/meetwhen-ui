<script lang="ts">
	import { gridItemStyle, gridStyle } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';
	import TimePickerBlockGap from './TimePickerBlockGap.svelte';

	const { resolution } = getTimePickerControls();
	const { flattenedTimeCells, timeIdToRowNumber } = getTimePickerState();
	$: console.log($flattenedTimeCells.length);
</script>

<div
	class="timepicker-grid-index"
	style={gridItemStyle({ y: 1 }) +
		gridStyle({ rows: $flattenedTimeCells.length })}
>
	{#each $flattenedTimeCells as timeCell}
		<div
			class="timepicker-grid-index-cell"
			class:!rounded-t-lg={timeCell.isStartOfInterval}
			class:!rounded-b-lg={timeCell.isEndOfBlock}
			style={gridItemStyle({ y: $timeIdToRowNumber[timeToId(timeCell.time)] })}
		>
			{#if timeCell.time.minute() === 0 || timeCell.isStartOfInterval}
				<div class="label" class:start={timeCell.isStartOfInterval}>
					{timeCell.time.format('h:mm')}
				</div>
			{/if}
			{#if timeCell.isEndOfInterval}
				<div class="label end">
					{timeCell.time.add($resolution, 'minutes').format('h:mm')}
				</div>
			{/if}
		</div>
		{#if timeCell.isEndOfBlock && !timeCell.isEndOfDate}
			<TimePickerBlockGap {timeCell} />
		{/if}
	{/each}
</div>

<style lang="postcss">
	.timepicker-grid-index {
		@apply sticky left-0 z-40 grid-flow-col;
	}

	.timepicker-grid-index-cell {
		@apply relative wh-full min-h-6;
		@apply bg-shade-100;

		& .label {
			@apply bg-shade-100 rounded-lg;
			@apply p-1 -translate-y-1/2;
			@apply text-xs text-gray-400 text-center whitespace-nowrap;
			&.start {
				@apply -translate-y-1/4;
			}
			&.end {
				@apply absolute left-0 right-0 -bottom-2/3;
			}
		}
	}
</style>
