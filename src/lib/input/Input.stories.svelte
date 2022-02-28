<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import { onDay, timeFromId } from '$lib/core/utils/dayjs';
	import { Button, DatePicker, Select, Textfield, TimePicker } from '.';

	/** @type import('dayjs').Dayjs[] */
	let selectedDates = [dayjs(), dayjs().add(1, 'day')];
	$: validIntervals = selectedDates.map((date) => ({
		start: onDay(timeFromId('08:00'), date),
		end: onDay(timeFromId('17:00'), date),
	}));

	const people = [
		{ id: 1, name: 'Durward Reynolds' },
		{ id: 2, name: 'Kenton Towne' },
		{ id: 3, name: 'Therese Wunsch' },
		{ id: 4, name: 'Benedict Kessler' },
		{ id: 5, name: 'Katelyn Rohan' },
	];
	let selectedPerson = people[0];
</script>

<Meta
	title="Input"
	argTypes={{
		error: {
			name: 'error',
			type: { name: 'string', required: false },
		},
	}}
/>

<Story name="Sample form" let:args>
	<h1 class="text-xl font-bold">Sample form</h1>
	<form class="flex flex-col gap-4 mt-4">
		<Textfield label="Username" required error={args.error} />
		<Textfield label="Password" password error={args.error} />
		<Textfield label="Date of birth" disabled error={args.error} />
		<div class="flex gap-4">
			<Button>Sign In</Button>
			<Button color="gray">Cancel</Button>
			<Button color="gray" disabled>Revoke</Button>
		</div>
		<DatePicker bind:value={selectedDates} error={args.error} />
		<div class="flex gap-4">
			<Select
				bind:value={selectedPerson}
				values={people}
				itemId={(p) => p.id}
				itemLabel={(p) => p.name}
			/>
			<Select
				bind:value={selectedPerson}
				disabled
				values={people}
				itemId={(p) => p.id}
				itemLabel={(p) => p.name}
			/>
		</div>
		<TimePicker {validIntervals} error={args.error} />
	</form>
</Story>
