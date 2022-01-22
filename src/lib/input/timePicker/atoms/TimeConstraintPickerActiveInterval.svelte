<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';
	import { timePickerIntervalStyle } from './timePickerIntervalStyle';

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();

	export let interval: Interval;
	export let selectMode: Maybe<SelectMode>;
</script>

<div
	class="timepicker-active"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style={timePickerIntervalStyle({
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
		@apply relative rounded-xl pointer-events-none z-20;
		@apply ring ring-inset;
		& > span {
			@apply absolute left-2 text-xs font-semibold;
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
