<script lang="ts">
	import { gridArea } from '$lib/core/components/grid';
	import { dateToId, timeToId } from '$lib/core/utils/dayjs';
	import type { SelectMode } from '$lib/input';
	import {
		getTimePickerControls,
		getTimePickerState,
	} from '../utils/timePickerContext';

	export let selectMode: Maybe<SelectMode>;

	const { currentDateTime } = getTimePickerControls();
	const { dateIdToColumnNumber, timeIdToRowNumber } = getTimePickerState();
</script>

<div
	class="timepicker-focus"
	class:add={selectMode === 'add'}
	class:remove={selectMode === 'remove'}
	style:grid-area={gridArea({
		x: $dateIdToColumnNumber[dateToId($currentDateTime)],
		y: $timeIdToRowNumber[timeToId($currentDateTime)],
	})}
/>

<style lang="postcss">
	.timepicker-focus {
		@apply rounded-xl pointer-events-none z-30;
		:global(:focus-within) > & {
			@apply ring ring-inset ring-primary-400;
			&.add {
				@apply ring-primary-500 gdark:ring-white;
			}
			&.remove {
				@apply ring-red-400;
			}
		}
	}
</style>
