<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import TimePicker from './TimePicker.svelte';

	const today = dayjs().startOf('day');
</script>

<Meta title="Input/TimePicker" component={TimePicker} />

<Story name="Sample time pickers">
	<h1 class="text-xl font-bold">Single interval</h1>
	<TimePicker
		validIntervals={[{ start: today.hour(8), end: today.hour(10) }]}
	/>

	<h1 class="text-xl font-bold">Multiple intervals</h1>
	<TimePicker
		validIntervals={[
			{ start: today.hour(8), end: today.hour(10) },
			{ start: today.hour(12), end: today.hour(15) },
		]}
	/>

	<h1 class="text-xl font-bold">Single interval past midnight</h1>
	<TimePicker
		validIntervals={[
			{ start: today.hour(22), end: today.add(1, 'day').hour(2) },
		]}
	/>
</Story>
