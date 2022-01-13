<script lang="ts">
	import { gridItemStyle, gridStyle } from '$lib/core/components/grid';
	import { dateFromId } from '$lib/core/utils/dayjs/dateIds';
	import { getTimePickerState } from '../utils/timePickerContext';

	const { dateIds, dateIdToColumnNumber } = getTimePickerState();

	export let shadow = false;
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

<div
	class="timepicker-grid-header-bg"
	class:shadow
	style={gridItemStyle({ endX: 2 })}
/>

<style lang="postcss">
	.timepicker-grid-header {
		@apply sticky top-0 z-50 gap-x-3 rounded-lg;
		@apply m-[-8px] border-8 border-white gdark:border-neutral-800;
	}

	.timepicker-grid-header-cell {
		@apply wh-full min-w-24 p-1 bg-shade-100 rounded-lg;
		@apply text-sm text-center;
		& > strong {
			@apply font-semibold;
		}
	}

	.timepicker-grid-header-bg {
		@apply sticky top-0 z-[49] m-[-8px];
		@apply bg-white gdark:bg-neutral-800;
		@apply transition-shadow;
		&.shadow {
			@apply shadow-md;
		}
	}
</style>
