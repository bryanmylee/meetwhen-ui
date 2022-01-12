<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import TimePicker from './TimePicker.svelte';

	const today = dayjs().startOf('day');
</script>

<Meta title="Input/TimePicker" component={TimePicker} />

<Story name="Sample time pickers" let:args>
	<h1 class="my-4 text-xl font-bold">Single interval</h1>
	<TimePicker
		{...args}
		validIntervals={[
			{ start: today.hour(8).minute(30), end: today.hour(10).minute(30) },
		]}
	/>

	<h1 class="my-4 text-xl font-bold">Multiple intervals</h1>
	<TimePicker
		{...args}
		validIntervals={[
			{ start: today.hour(8), end: today.hour(10) },
			{ start: today.hour(12), end: today.hour(15) },
		]}
	/>

	<h1 class="my-4 text-xl font-bold">Single interval past midnight</h1>
	<TimePicker
		{...args}
		validIntervals={[
			{ start: today.hour(22), end: today.add(1, 'day').hour(2) },
		]}
	/>

	<h1 class="my-4 text-xl font-bold">Multiple days</h1>
	<TimePicker
		{...args}
		validIntervals={[
			{ start: today.hour(8), end: today.hour(10) },
			{ start: today.add(1, 'day').hour(8), end: today.add(1, 'day').hour(10) },
			{
				start: today.add(2, 'days').hour(8),
				end: today.add(2, 'days').hour(10),
			},
		]}
	/>

	<h1 class="my-4 text-xl font-bold">Multiple days with gaps</h1>
	<TimePicker
		{...args}
		validIntervals={[
			{ start: today.hour(8), end: today.hour(9) },
			{ start: today.hour(11), end: today.hour(12) },
			{ start: today.add(1, 'day').hour(8), end: today.add(1, 'day').hour(12) },
			{
				start: today.add(2, 'days').hour(8),
				end: today.add(2, 'days').hour(12),
			},
		]}
	/>
</Story>
