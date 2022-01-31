<script>
	import dayjs from 'dayjs';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import AdjustableIntervalsSelect from './AdjustableIntervalsSelect.svelte';

	let selectedDates = [dayjs(), dayjs().add(1, 'day'), dayjs().add(2, 'days')];

	/**
	 * @type {(import('$lib/core/types/Interval').Interval)[]}
	 */
	let intervals = [];
</script>

<Meta
	title="Page/New/AdjustableIntervalsSelect"
	component={AdjustableIntervalsSelect}
/>

<Story name="Sample intervals">
	<h1 class="text-xl font-bold">Intervals</h1>
	<div
		class="grid grid-cols-2 gap-4 p-4 my-4 rounded-xl bg-neutral-100 dark:bg-neutral-600"
	>
		{#each intervals as interval}
			<p>
				{interval.start.format('D MMM H:mma')}
			</p>
			<p>
				{interval.end.format('D MMM H:mma')}
			</p>
		{/each}
	</div>
	<AdjustableIntervalsSelect {selectedDates} bind:intervals />
</Story>
