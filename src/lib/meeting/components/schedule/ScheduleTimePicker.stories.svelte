<script>
	import dayjs from 'dayjs';
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import ScheduleTimePicker from './ScheduleTimePicker.svelte';
	import { Button } from '$lib/input';
	import { setUsersCache } from '$lib/meeting/utils/usersCacheContext';
	import { writable } from 'svelte/store';

	let exampleIsEditing = false;
	const today = dayjs().startOf('day');
	const fiveDayIntervals = [
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

	/**
	 * @type {import("../../../models/Schedule").Schedule[]}
	 */
	const schedules = [
		{
			userId: '1',
			meetingId: '',
			intervals: [
				{ start: today.hour(8), end: today.hour(9) },
				{ start: today.hour(14), end: today.hour(15) },
			],
			total: { start: today.hour(8), end: today.hour(15) },
		},
		{
			userId: '2',
			meetingId: '',
			intervals: [
				{ start: today.hour(8), end: today.hour(12) },
				{
					start: today.add(1, 'day').hour(8),
					end: today.add(1, 'day').hour(12),
				},
				{
					start: today.add(2, 'days').hour(8),
					end: today.add(2, 'days').hour(12),
				},
			],
			total: { start: today.hour(8), end: today.hour(12) },
		},
		{
			userId: '3',
			meetingId: '',
			intervals: [
				{ start: today.hour(8), end: today.hour(10) },
				{
					start: today.add(2, 'days').hour(8),
					end: today.add(2, 'days').hour(10),
				},
				{
					start: today.add(4, 'days').hour(8),
					end: today.add(4, 'days').hour(14),
				},
			],
			total: { start: today.hour(8), end: today.hour(10) },
		},
	];
	setUsersCache(
		writable({
			'1': {
				displayName: 'Adam Neely',
				email: 'adam@neely.com',
				photoURL:
					'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
			},
			'2': {
				displayName: 'Rebecca Smith',
				email: 'rebecca@smith.com',
				photoURL:
					'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
			},
			'3': {
				displayName: 'Taylor Gates',
				email: 'taylor@gates.com',
				photoURL:
					'https://images.pexels.com/photos/8980686/pexels-photo-8980686.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
			},
		}),
	);
</script>

<Meta
	title="Page/Meeting/ScheduleTimePicker"
	component={ScheduleTimePicker}
	argTypes={{}}
/>

<Template let:args>
	<ScheduleTimePicker {...args} />
</Template>

<Story name="Edit schedules" source>
	<div class="flex flex-col gap-4">
		<Button on:click={() => (exampleIsEditing = !exampleIsEditing)}>
			Toggle editing
		</Button>
		<ScheduleTimePicker
			editing={exampleIsEditing}
			validIntervals={fiveDayIntervals}
		/>
	</div>
</Story>

<Story name="Example schedule intervals" source>
	<div class="flex flex-col gap-4">
		<ScheduleTimePicker
			editing={false}
			validIntervals={fiveDayIntervals}
			{schedules}
		/>
	</div>
</Story>
