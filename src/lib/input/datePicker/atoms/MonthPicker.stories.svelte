<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import dayjs from 'dayjs';
	import MonthPicker from './MonthPicker.svelte';

	let month = dayjs();
</script>

<Meta title="Input/DatePicker/MonthPicker" component={MonthPicker} />

<Story name="Custom" let:args>
	<MonthPicker bind:month {...args} />
</Story>
