<script lang="ts">
	import { gridItemStyle } from '$lib/core/components/grid';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { getTimePickerState } from '../utils/timePickerContext';

	const { dateIds, dateIdToColumnNumber } = getTimePickerState();
</script>

{#each $dateIds as dateId}
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

<style lang="postcss">
	.timepicker-grid-header-cell {
		@apply text-center;
		@apply p-1 mb-2 bg-shade-100 rounded-lg;
		& > strong {
			@apply font-semibold;
		}
	}
</style>
