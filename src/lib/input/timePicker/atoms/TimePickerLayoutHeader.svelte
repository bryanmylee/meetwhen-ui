<script lang="ts">
	import { gridArea, gridTemplate } from '$lib/core/components/grid';
	import { dateFromId } from '$lib/core/utils/dayjs';
	import { getTimePickerState } from '../utils/timePickerContext';

	const { dateIds, dateIdToColumnNumber } = getTimePickerState();

	export let shadow = false;
</script>

<div
	class="timepicker-grid-header"
	style:grid-area={gridArea({ x: 1 })}
	style:display="grid"
	style:grid-template={gridTemplate({ cols: $dateIds.length })}
>
	{#each $dateIds as dateId}
		{@const date = dateFromId(dateId)}
		<div
			class="timepicker-grid-header-cell"
			style:grid-area={gridArea({ x: $dateIdToColumnNumber[dateId] })}
		>
			{date.format('ddd D MMM')}
		</div>
	{/each}
</div>

<div
	class="timepicker-grid-header-bg"
	class:has-shadow={shadow}
	style:grid-area={gridArea({ endX: 2 })}
/>

<style lang="postcss">
	.timepicker-grid-header {
		@apply sticky top-0 z-40 rounded-lg;
		@apply px-1 py-2 gap-x-3;
	}

	.timepicker-grid-header-cell {
		@apply wh-full min-w-24 p-1 bg-shade-100 rounded-lg;
		@apply text-label text-center;
	}

	.timepicker-grid-header-bg {
		@apply sticky top-0 z-[39];
		@apply bg-white gdark:bg-neutral-800;
		@apply transition-shadow;
		&.has-shadow {
			@apply shadow-md;
		}
	}
</style>
