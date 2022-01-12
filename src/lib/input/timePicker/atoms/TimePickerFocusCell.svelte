<script lang="ts">
	import { gridItemStyle } from '$lib/core/components/grid';
	import type { Maybe } from '$lib/core/types/Maybe';
	import { dateToId } from '$lib/core/utils/dayjs/dateIds';
	import { timeToId } from '$lib/core/utils/dayjs/timeIds';
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
	style={gridItemStyle({
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
