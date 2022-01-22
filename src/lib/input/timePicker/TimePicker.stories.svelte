<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import TimePicker from './TimePicker.svelte';
	import TimeConstraintPicker from './TimeConstraintPicker.svelte';

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

<Story name="Scrolling time picker" let:args>
	<div class="wh-96">
		<TimePicker
			{...args}
			validIntervals={[...Array(20)].map((_, day) => ({
				start: today.add(day, 'days').hour(1),
				end: today.add(day, 'days').hour(23),
			}))}
		/>
	</div>
</Story>

<Story name="Sample time constraint picker" let:args>
	<h1 class="my-4 text-xl font-bold">Constraint picker</h1>
	<TimeConstraintPicker
		{...args}
		validIntervals={[
			{ start: today.hour(8), end: today.hour(17) },
			{ start: today.hour(8).add(1, 'day'), end: today.hour(17).add(1, 'day') },
			{ start: today.hour(8).add(2, 'day'), end: today.hour(17).add(2, 'day') },
			{ start: today.hour(8).add(3, 'day'), end: today.hour(17).add(3, 'day') },
			{ start: today.hour(8).add(4, 'day'), end: today.hour(17).add(4, 'day') },
		]}
	/>
</Story>
