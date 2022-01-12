<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import type { Maybe } from '$lib/core/types/Maybe';
	import type { SelectMode } from '$lib/input/selection/SelectMode';
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
	class="timepicker-selected"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style={timePickerIntervalStyle({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval,
	})}
/>

<style lang="postcss">
	.timepicker-selected {
		@apply rounded-xl pointer-events-none z-10;
		@apply bg-primary-400/50;
	}
</style>
