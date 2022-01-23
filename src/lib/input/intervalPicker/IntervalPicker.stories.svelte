<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import IntervalPicker from './IntervalPicker.svelte';

	let startHour = 8;
	let endHour = 17;
	/**
	 * @type {import("../../core/types/Maybe").Maybe<import("../../core/types/Interval").Interval>}
	 */
	let interval = undefined;
</script>

<Meta title="Input/IntervalPicker" component={IntervalPicker} />

<Story name="Sample interval picker">
	<p class="mb-4">
		{interval?.start.format('ha')}
		to
		{interval?.end.format('ha')}
	</p>
	<IntervalPicker bind:interval {startHour} {endHour} />
</Story>
