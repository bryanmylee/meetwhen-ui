<script>
	import { Meta, Story } from '@storybook/addon-svelte-csf';
	import DatePicker from './DatePicker.svelte';
</script>

<Meta title="Input/DatePicker" component={DatePicker} argTypes={{}} />

<Story name="Sample date picker" let:args>
	<DatePicker {...args} />
</Story>
