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
	class="timepicker-active"
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
	.timepicker-active {
		@apply rounded-xl pointer-events-none z-20;
		@apply ring ring-inset;
		&.add {
			@apply bg-primary-300 ring-primary-500 gdark:ring-white;
		}
		&.remove {
			@apply ring-red-400;
		}
	}
</style>
