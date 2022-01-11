<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import DatePicker from './DatePicker.svelte';
	import { timeoutError } from '$lib/test/timeoutError';

	const [ariaValue, ariaError] = timeoutError([]);
</script>

<Meta title="Input/DatePicker" component={DatePicker} argTypes={{}} />

<Story name="Custom" let:args>
	<DatePicker {...args} />
</Story>

<Story name="ARIA status live update">
	<DatePicker bind:value={$ariaValue} error={$ariaError} />
</Story>
