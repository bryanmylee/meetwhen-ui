<script>
	import { onDay } from '$lib/core/utils/dayjs/onDay';
	import { timeFromId } from '$lib/core/utils/dayjs/timeIds';
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import { Button, DatePicker, Textfield, TimePicker } from '.';

	/** @type import('dayjs').Dayjs[] */
	let selectedDates = [];
	$: validIntervals = selectedDates.map((date) => ({
		start: onDay(timeFromId('08:00'), date),
		end: onDay(timeFromId('17:00'), date),
	}));
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
	<form class="flex flex-col gap-4 mt-4 w-80">
		<Textfield label="Username" required error={args.error} />
		<Textfield label="Password" password error={args.error} />
		<Textfield label="Date of birth" disabled error={args.error} />
		<div class="flex gap-4">
			<Button>Log In</Button>
			<Button color="gray">Cancel</Button>
			<Button color="gray" disabled>Revoke</Button>
		</div>
		<DatePicker bind:value={selectedDates} error={args.error} />
		<TimePicker {validIntervals} />
	</form>
</Story>
