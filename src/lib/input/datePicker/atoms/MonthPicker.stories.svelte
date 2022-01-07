<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import MonthPicker from './MonthPicker.svelte';

	let month = dayjs();
</script>

<Meta title="Input/DatePicker/MonthPicker" component={MonthPicker} />

<Story name="Sample month picker" let:args>
	<h1 class="mb-4 text-xl font-bold">Sample month picker</h1>
	<MonthPicker bind:month {...args} />
</Story>
