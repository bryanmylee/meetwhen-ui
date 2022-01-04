<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Textfield from './Textfield.svelte';
</script>

<Meta
	title="Input/Textfield"
	component={Textfield}
	argTypes={{
		label: { control: 'text' },
		id: { control: 'text' },
	}}
/>

<Template let:args>
	<Textfield {...args} />
</Template>

<Story name="Gallery">
	<div class="flex flex-col gap-4 w-52">
		<Textfield label="Default" />
		<Textfield label="Password" password />
		<Textfield label="Error" error="Incorrect password" />
		<Textfield label="Required" required />
		<Textfield label="Disabled" disabled />
	</div>
</Story>

<Story
	name="Custom"
	source
	args={{
		label: 'Custom',
	}}
/>
