<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import type { SelectMode } from '$lib/input';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '$lib/input/timePicker/utils/timePickerContext';
	import { intervalGridArea } from '$lib/input/timePicker/utils/intervalGridArea';

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();

	export let interval: Interval;
	export let selectMode: Maybe<SelectMode>;
</script>

<div
	class="timepicker-active"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style:grid-area={intervalGridArea({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval,
	})}
>
	<span class="top-1">{interval.start.format('h:mm a')}</span>
	{#if !interval.end.subtract($resolution, 'minutes').isSame(interval.start)}
		<span class="bottom-1">{interval.end.format('h:mm a')}</span>
	{/if}
</div>

<style lang="postcss">
	.timepicker-active {
		@apply relative rounded-r-xl pointer-events-none z-20;
		@apply ring ring-inset;
		margin-left: var(--scheduleWidth);
		& > span {
			@apply absolute left-2 text-label-sm;
		}
		&.add {
			@apply bg-primary-300 ring-primary-500 gdark:ring-white;
			& > span {
				@apply text-white;
			}
		}
		&.remove {
			@apply bg-red-200 ring-red-400;
			& > span {
				@apply text-red-400;
			}
		}
	}
</style>
