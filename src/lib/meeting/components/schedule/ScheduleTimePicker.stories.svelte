<script>
	import dayjs from 'dayjs';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import ScheduleTimePicker from './ScheduleTimePicker.svelte';
	import { Button } from '$lib/input';

	let exampleIsEditing = false;
	const today = dayjs().startOf('day');
	const intervals = [
		{
			start: today.hour(8),
			end: today.hour(17),
		},
		{
			start: today.add(1, 'day').hour(8),
			end: today.add(1, 'day').hour(17),
		},
		{
			start: today.add(2, 'day').hour(8),
			end: today.add(2, 'day').hour(17),
		},
		{
			start: today.add(3, 'day').hour(8),
			end: today.add(3, 'day').hour(17),
		},
		{
			start: today.add(4, 'day').hour(8),
			end: today.add(4, 'day').hour(17),
		},
	];
</script>

<Meta
	title="Page/Meeting/ScheduleTimePicker"
	component={ScheduleTimePicker}
	argTypes={{}}
/>

<Template let:args>
	<ScheduleTimePicker {...args} />
</Template>

<Story name="Example schedules" source>
	<div class="flex flex-col gap-4">
		<Button on:click={() => (exampleIsEditing = !exampleIsEditing)}>
			Toggle editing
		</Button>
		<ScheduleTimePicker editing={exampleIsEditing} validIntervals={intervals} />
	</div>
</Story>
