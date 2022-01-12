<script lang="ts">
	import { gridItemStyle, gridStyle } from '$lib/core/components/grid';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { getTimePickerState } from '../utils/timePickerContext';

	const { dateIds, dateIdToColumnNumber } = getTimePickerState();
</script>

<div
	class="timepicker-grid-header"
	style={gridItemStyle({ x: 1 }) + gridStyle({ cols: $dateIds.length })}
>
	{#each $dateIds as dateId}
		<!-- @const -->
		{#each [dateFromId(dateId)] as date}
			<div
				class="timepicker-grid-header-cell"
				style={gridItemStyle({ x: $dateIdToColumnNumber[dateId] })}
			>
				{date.format('ddd')}
				<strong>
					{date.format('D MMM')}
				</strong>
			</div>
		{/each}
	{/each}
</div>

<style lang="postcss">
	.timepicker-grid-header {
		@apply sticky top-0 z-50 gap-x-3;
	}

	.timepicker-grid-header-cell {
		@apply wh-full min-w-24 p-1 bg-shade-100 rounded-lg;
		@apply text-sm text-center;
		& > strong {
			@apply font-semibold;
		}
	}
</style>
