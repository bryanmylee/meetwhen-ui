<script lang="ts">
	import { gridArea, gridTemplate } from '$lib/core/components/grid';
	import { timeToId } from '$lib/core/utils/dayjs';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';
	import TimePickerBlockGap from './TimePickerBlockGap.svelte';

	const { resolution } = getTimePickerControls();
	const { flattenedTimeCells, timeIdToRowNumber } = getTimePickerState();

	export let shadow = false;
</script>

<div
	class="timepicker-grid-index"
	class:has-shadow={shadow}
	style:grid-area={gridArea({ y: 1 })}
	style:display="grid"
	style:grid-template={gridTemplate({ rows: $flattenedTimeCells.length })}
>
	{#each $flattenedTimeCells as timeCell}
		<div
			class="timepicker-grid-index-cell"
			class:!rounded-t-lg={timeCell.isStartOfInterval}
			class:!rounded-b-lg={timeCell.isEndOfBlock}
			style:grid-area={gridArea({
				y: $timeIdToRowNumber[timeToId(timeCell.time)],
			})}
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
		@apply sticky left-0 z-30 grid-flow-col;
		@apply bg-white gdark:bg-neutral-800;
		@apply p-1 border-r-4 border-white gdark:border-neutral-800;
		@apply transition-shadow;
		&.has-shadow {
			@apply shadow-md;
		}
	}

	.timepicker-grid-index-cell {
		@apply relative wh-full min-h-6;
		@apply bg-shade-100;

		& .label {
			@apply bg-shade-100 rounded-lg;
			@apply px-1 -translate-y-1/2;
			@apply text-xs text-neutral-400 text-center whitespace-nowrap;
			&.start {
				@apply translate-y-1/3;
			}
			&.end {
				@apply absolute inset-0 top-auto;
			}
		}
	}
</style>
