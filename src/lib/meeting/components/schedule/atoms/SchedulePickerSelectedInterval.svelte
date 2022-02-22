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
	class="timepicker-selected"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style:grid-area={intervalGridArea({
		dateIdToColumnNumber: $dateIdToColumnNumber,
		timeIdToRowNumber: $timeIdToRowNumber,
		resolution: $resolution,
		interval,
	})}
/>

<style lang="postcss">
	.timepicker-selected {
		@apply rounded-r-xl pointer-events-none z-10;
		@apply bg-primary-400/50;
		margin-left: var(--scheduleWidth);
	}
</style>
