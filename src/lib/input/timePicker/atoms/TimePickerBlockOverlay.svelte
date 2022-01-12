<script lang="ts">
	import type { Interval } from '$lib/core/types/Interval';
	import { timePickerIntervalStyle } from '../atoms/timePickerIntervalStyle';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';

	export let block: Interval;

	const { resolution } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();
</script>

<div
	class="timepicker-block"
	style={timePickerIntervalStyle({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval: block,
	})}
/>

<style lang="postcss">
	.timepicker-block {
		@apply ring ring-primary-400 rounded-xl;
		@apply pointer-events-none;
	}
</style>
