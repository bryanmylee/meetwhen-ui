<script lang="ts">
	import type { Interval } from '$lib/core/types';
	import { intervalGridArea } from '../utils/intervalGridArea';
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
	style:grid-area={intervalGridArea({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval: block,
	})}
/>

<style lang="postcss">
	.timepicker-block {
		@apply ring-primary-400 rounded-xl;
		@apply pointer-events-none;

		:global(.timepicker:focus) & {
			@apply ring;
		}
	}
</style>
